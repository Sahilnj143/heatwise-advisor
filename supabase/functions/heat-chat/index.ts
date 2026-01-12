import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const HEAT_SAFETY_GUIDELINES = `
# Official Heat Safety Guidelines for AI Chat Context

## Heat Index Categories
- LOW: Below 27°C (80°F) - Safe conditions
- MODERATE: 27-32°C (80-90°F) - Caution advised
- HIGH: 32-41°C (90-105°F) - Danger, limit exposure
- EXTREME: Above 41°C (105°F) - Extreme danger, avoid outdoors

## Hydration Guidelines
- Drink 8-12 oz water every 20 minutes during outdoor activity
- Don't wait until thirsty - thirst indicates dehydration has begun
- Avoid caffeine and alcohol during heat events
- Sports drinks can replace electrolytes during prolonged exposure

## Activity Timing
- Safest hours: Before 10 AM, after 6 PM
- Peak danger: 11 AM - 4 PM
- Schedule strenuous activities for cooler periods
- Take 10-15 minute breaks every hour in shade

## Heat Illness Recognition
Heat Exhaustion: Heavy sweating, weakness, pale skin, nausea
Heat Stroke: High temp (103°F+), hot red dry skin, confusion, rapid pulse
Heat Stroke is a medical emergency - call 911 immediately

## Special Populations
- Elderly: More vulnerable, check on them regularly
- Children: Cannot regulate temperature well, need supervision
- Outdoor workers: Mandatory breaks and hydration
- Athletes: Gradual acclimatization over 10-14 days
`;

const SYSTEM_PROMPT = `You are a friendly, helpful AI assistant specializing in heat safety and urban heat island effects. You provide accurate, actionable advice grounded in official health guidelines.

Your knowledge includes:
${HEAT_SAFETY_GUIDELINES}

Guidelines for responses:
1. Be concise but thorough - aim for 2-4 sentences per point
2. Always ground advice in official guidelines (WHO, CDC)
3. Use emojis sparingly to highlight key points
4. If asked about a specific zone, tailor advice to that location
5. For symptoms questions, always recommend seeking medical help when in doubt
6. Never provide medical diagnoses - only general safety guidance
7. Acknowledge uncertainty when data is incomplete

If the user provides zone context, incorporate that information into your response.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, zoneContext } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build messages with zone context if available
    const systemMessages = [{ role: "system", content: SYSTEM_PROMPT }];
    
    if (zoneContext) {
      systemMessages.push({
        role: "system",
        content: `Current zone context - The user is viewing: ${zoneContext.name}. Current conditions: Temperature ${zoneContext.temperature}°C, Humidity ${zoneContext.humidity}%, Heat Index ${zoneContext.heatIndex}°C, Risk Level: ${zoneContext.riskLevel}. Expected peak: ${zoneContext.predictedPeak}°C at ${zoneContext.peakTime}.`,
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [...systemMessages, ...messages],
        temperature: 0.5,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    // Return streaming response
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
