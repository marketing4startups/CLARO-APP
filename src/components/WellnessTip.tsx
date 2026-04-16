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
    <Card className="overflow-hidden border-none bg-secondary shadow-sm card-hover">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-accent">
          <Sparkles className="h-3.5 w-3.5 fill-current" />
          Daily Clarity Tip
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            Finding clarity...
          </div>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none text-sm font-medium text-slate-700 leading-relaxed italic">
            <ReactMarkdown>{tip}</ReactMarkdown>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
