import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import ReactMarkdown from 'react-markdown';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export function WellnessTip() {
  const [tip, setTip] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTip() {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: "Provide a short, actionable mental health or wellness tip for a corporate employee. Keep it under 100 words. Format with markdown.",
          config: {
            systemInstruction: "You are a corporate wellness expert. Your tips are practical, empathetic, and evidence-based."
          }
        });
        setTip(response.text || 'Take a deep breath and stay hydrated today.');
      } catch (error) {
        console.error('Error fetching wellness tip:', error);
        setTip('Take a 5-minute break to stretch and breathe.');
      } finally {
        setLoading(false);
      }
    }
    fetchTip();
  }, []);

  return (
    <Card className="overflow-hidden border-border/40 bg-white shadow-xl shadow-primary/5 card-hover rounded-[2rem]">
      <CardHeader className="pb-2 px-8 pt-8">
        <CardTitle className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.3em] text-accent">
          <Sparkles className="h-3.5 w-3.5 fill-current" />
          Sage Insight
        </CardTitle>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        {loading ? (
          <div className="flex items-center gap-3 text-xs text-muted-foreground font-sage italic py-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary opacity-30" />
            Distilling resonance...
          </div>
        ) : (
          <div className="prose prose-slate max-w-none text-base font-sage italic text-foreground/80 leading-relaxed pr-2">
            <ReactMarkdown>{tip}</ReactMarkdown>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
