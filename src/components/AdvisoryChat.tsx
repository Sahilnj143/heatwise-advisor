import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HeatZone } from "@/lib/heatZones";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AdvisoryChatProps {
  selectedZone: HeatZone | null;
}

const mockResponses: Record<string, string> = {
  default: "I'm your Heat Advisory AI assistant. I can help you understand heat risks, provide safety recommendations, and answer questions about urban heat islands. What would you like to know?",
  hydration: "💧 **Hydration Guidelines:**\n\nDuring high heat conditions:\n- Drink 8-12 oz of water every 20 minutes when outdoors\n- Avoid caffeine and alcohol as they increase dehydration\n- Monitor urine color - pale yellow indicates good hydration\n- Consider electrolyte drinks for prolonged outdoor exposure",
  outdoor: "🏃 **Outdoor Activity Guidelines:**\n\nBased on current conditions:\n- **Early morning (before 10 AM):** Best time for exercise\n- **Midday (11 AM - 4 PM):** Limit exposure, seek shade\n- **Evening (after 6 PM):** Safer for moderate activities\n\nAlways take frequent breaks and listen to your body.",
  symptoms: "🚨 **Heat Illness Warning Signs:**\n\n**Heat Exhaustion:**\n- Heavy sweating, weakness, cold/pale skin\n- Fast/weak pulse, nausea\n- **Action:** Move to cool area, hydrate, rest\n\n**Heat Stroke (Emergency):**\n- High body temp (103°F+), hot/red skin\n- Rapid pulse, confusion\n- **Action:** Call 911 immediately",
};

export function AdvisoryChat({ selectedZone }: AdvisoryChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: mockResponses.default,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add zone context when selected
  useEffect(() => {
    if (selectedZone) {
      const zoneMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `📍 You've selected **${selectedZone.name}**.\n\nCurrent conditions:\n- Heat Index: ${selectedZone.heatIndex}°C (${selectedZone.riskLevel} risk)\n- Temperature: ${selectedZone.temperature}°C\n- Humidity: ${selectedZone.humidity}%\n- Expected peak: ${selectedZone.predictedPeak}°C at ${selectedZone.peakTime}\n\nHow can I help you stay safe in this area?`,
      };
      setMessages((prev) => [...prev, zoneMessage]);
    }
  }, [selectedZone?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const lowerInput = input.toLowerCase();
    let response = "I can provide information about heat safety, hydration, outdoor activity timing, and heat illness symptoms. What specific topic would you like to know more about?";

    if (lowerInput.includes("hydrat") || lowerInput.includes("water") || lowerInput.includes("drink")) {
      response = mockResponses.hydration;
    } else if (lowerInput.includes("outdoor") || lowerInput.includes("exercise") || lowerInput.includes("activity") || lowerInput.includes("time")) {
      response = mockResponses.outdoor;
    } else if (lowerInput.includes("symptom") || lowerInput.includes("sick") || lowerInput.includes("heat stroke") || lowerInput.includes("warning")) {
      response = mockResponses.symptoms;
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-3 border-b border-border">
        <div className="p-1.5 rounded-lg bg-primary/10">
          <Bot className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="font-medium text-sm text-foreground">Heat Advisory AI</h3>
          <p className="text-xs text-muted-foreground">Ask about heat safety</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${message.role === "user" ? "justify-end" : ""}`}
            >
              {message.role === "assistant" && (
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3 h-3 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground"
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
              {message.role === "user" && (
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <User className="w-3 h-3 text-muted-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2"
          >
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-3 h-3 text-primary" />
            </div>
            <div className="bg-secondary rounded-xl px-3 py-2">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about heat safety..."
            className="flex-1 text-sm bg-secondary/50"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
