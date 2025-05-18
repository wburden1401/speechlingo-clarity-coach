
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
    <div className="bg-card rounded-xl p-3 shadow-sm border border-border">
      <div className="flex flex-col items-center text-center py-1">
        <Quote className="h-5 w-5 text-primary mb-1" />
        <p className="text-xs italic mb-1">{quote.quote}</p>
        <p className="text-xs text-muted-foreground">— {quote.author}</p>
      </div>
    </div>
  );
}
