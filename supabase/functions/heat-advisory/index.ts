import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Official heat safety guidelines (embedded for RAG context)
const HEAT_SAFETY_GUIDELINES = `
# Official Heat Safety Guidelines

## Heat Index Risk Categories (WHO & CDC Guidelines)

### LOW RISK (Heat Index below 27°C / 80°F)
- Conditions generally safe for most outdoor activities
- Standard hydration practices recommended
- No special precautions required for healthy individuals

### MODERATE RISK (Heat Index 27-32°C / 80-90°F)  
- Fatigue possible with prolonged exposure and physical activity
- Drink water every 30 minutes during outdoor activity
- Take breaks in shade or air conditioning
- Sensitive groups (elderly, children, chronic conditions) should limit exposure

### HIGH RISK (Heat Index 32-41°C / 90-105°F)
- Heat cramps and heat exhaustion likely
- Limit strenuous outdoor activities to morning/evening
- Drink 8-12 oz water every 15-20 minutes
- Never leave children or pets in vehicles
- Check on vulnerable neighbors and family members
- Wear lightweight, light-colored, loose-fitting clothing

### EXTREME RISK (Heat Index above 41°C / 105°F)
- Heat stroke highly likely without protective measures
- Avoid all non-essential outdoor activities
- Stay in air-conditioned environments
- If outdoors, take breaks every 15 minutes minimum
- Drink water continuously, do not wait until thirsty
- Know heat stroke warning signs: confusion, hot dry skin, rapid pulse
- This is a medical emergency situation

## Special Population Guidelines

### Outdoor Workers
- Mandatory rest breaks: 10 min/hour in HIGH, 15 min/hour in EXTREME
- Employer must provide water, shade, and cooling stations
- Buddy system required for monitoring heat illness symptoms

### Elderly (65+)
- Higher risk due to reduced sweating and medications
- Check indoor temperatures - should not exceed 26°C / 78°F
- Social check-ins every 2-4 hours during heat events
- Avoid caffeine and alcohol which increase dehydration

### Children
- Cannot regulate body temperature as efficiently as adults
- Never leave in parked vehicles - temperatures rise 20°F in 10 minutes
- Limit outdoor play during peak hours (10 AM - 4 PM)
- Encourage water breaks every 20 minutes during play

### Athletes & Active Individuals
- Acclimatization takes 10-14 days of gradual exposure
- Weigh before/after exercise - drink 16-24 oz per pound lost
- Cancel outdoor practices/games when Heat Index exceeds 40°C
- Watch for early signs: muscle cramps, excessive sweating, nausea

## Heat Illness Recognition and Response

### Heat Exhaustion
Symptoms: Heavy sweating, weakness, cold/pale/clammy skin, fast weak pulse, nausea
Action: Move to cool location, lie down, loosen clothing, apply cool wet cloths, sip water

### Heat Stroke (EMERGENCY)
Symptoms: High body temperature (103°F+), hot red dry skin, rapid strong pulse, confusion
Action: Call 911 immediately, move to cool area, reduce body temperature with cool cloths, DO NOT give fluids
`;

const SYSTEM_PROMPT = `You are an AI heat safety advisor that provides personalized heat risk advisories based on weather data and official guidelines.

Given location and weather data, you MUST generate advisories following this EXACT structure:

1. Determine the Heat Risk Level: LOW, MODERATE, HIGH, or EXTREME based on heat index
2. Summarize predicted conditions in one sentence
3. Provide exactly 5 actionable recommendations with emoji icons
4. Explain the rationale briefly
5. Assign a confidence score (0-1)

Use ONLY the official guidelines provided. Never hallucinate or invent safety rules.

${HEAT_SAFETY_GUIDELINES}

Response must be valid JSON matching this structure:
{
  "riskLevel": "LOW" | "MODERATE" | "HIGH" | "EXTREME",
  "predictedHeatSummary": "string",
  "recommendations": [
    { "id": 1, "text": "string", "icon": "emoji" },
    { "id": 2, "text": "string", "icon": "emoji" },
    { "id": 3, "text": "string", "icon": "emoji" },
    { "id": 4, "text": "string", "icon": "emoji" },
    { "id": 5, "text": "string", "icon": "emoji" }
  ],
  "rationale": "string",
  "confidenceScore": number,
  "usedFallback": boolean
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location, locationType, temperature, humidity, heatIndex } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build the user query with available data
    const userQuery = `
Generate a heat risk advisory for:
- Location: ${location || "Unknown location"}
- Location Type: ${locationType || "urban"}
- Current Temperature: ${temperature || 35}°C
- Humidity: ${humidity || 65}%
- Heat Index: ${heatIndex || 42}°C

Consider the location type (${locationType}) when making recommendations. Urban areas retain more heat, coastal areas may have sea breezes, campuses have outdoor walking, etc.

Provide personalized recommendations based on these specific conditions.
`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userQuery },
        ],
        temperature: 0.3,
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

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse JSON from response (handle markdown code blocks)
    let advisory;
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || 
                       content.match(/```\n?([\s\S]*?)\n?```/) ||
                       [null, content];
      const jsonStr = jsonMatch[1] || content;
      advisory = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      // Return fallback advisory
      advisory = {
        riskLevel: heatIndex >= 41 ? "EXTREME" : heatIndex >= 32 ? "HIGH" : heatIndex >= 27 ? "MODERATE" : "LOW",
        predictedHeatSummary: `Heat index of ${heatIndex || 35}°C expected with ${humidity || 65}% humidity.`,
        recommendations: [
          { id: 1, text: "Stay hydrated by drinking water every 20 minutes when outdoors.", icon: "💧" },
          { id: 2, text: "Limit outdoor activities during peak heat hours (10 AM - 4 PM).", icon: "🕐" },
          { id: 3, text: "Seek shade or air-conditioned spaces when possible.", icon: "🏠" },
          { id: 4, text: "Wear lightweight, light-colored, loose-fitting clothing.", icon: "👕" },
          { id: 5, text: "Monitor for heat illness symptoms: dizziness, nausea, rapid heartbeat.", icon: "🚨" },
        ],
        rationale: "These recommendations follow official CDC and WHO heat safety guidelines to minimize heat-related illness risk.",
        confidenceScore: 0.6,
        usedFallback: true,
      };
    }

    return new Response(JSON.stringify(advisory), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Heat advisory error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        riskLevel: "MODERATE",
        predictedHeatSummary: "Unable to generate detailed forecast. Using conservative safety recommendations.",
        recommendations: [
          { id: 1, text: "Stay hydrated and drink water regularly.", icon: "💧" },
          { id: 2, text: "Avoid prolonged outdoor exposure during midday.", icon: "🕐" },
          { id: 3, text: "Rest in cool, shaded areas when possible.", icon: "🏠" },
          { id: 4, text: "Wear appropriate protective clothing.", icon: "👕" },
          { id: 5, text: "Seek medical help if you feel unwell.", icon: "🚨" },
        ],
        rationale: "Conservative recommendations applied due to incomplete data.",
        confidenceScore: 0.3,
        usedFallback: true,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
