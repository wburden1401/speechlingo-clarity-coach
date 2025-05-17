
import { useState, useEffect } from "react";
import { Quote } from "lucide-react";
import { motivationalQuotes } from "@/lib/data";

export function QuoteCard() {
  const [quote, setQuote] = useState(motivationalQuotes[0]);
  
  useEffect(() => {
    // Set a random quote on mount
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setQuote(randomQuote);
  }, []);
  
  return (
    <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
      <div className="flex flex-col items-center text-center py-2">
        <Quote className="h-6 w-6 text-primary mb-2" />
        <p className="text-sm italic mb-2">{quote.quote}</p>
        <p className="text-xs text-muted-foreground">— {quote.author}</p>
      </div>
    </div>
  );
}
