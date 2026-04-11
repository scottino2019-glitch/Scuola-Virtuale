import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-components/Card';
import { Button } from '@/components/ui-components/Button';
import { Input } from '@/components/ui-components/Input';
import { ScrollArea } from '@/components/ui-components/ScrollArea';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { chatWithGemini } from '@/lib/gemini';
import { ChatMessage } from '@/types';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export const ChatGemini: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Salve, studente. Sono il tuo precettore virtuale. In quale disciplina posso assisterti oggi?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    // Focus input on mount
    setTimeout(() => inputRef.current?.focus(), 500);
  }, []);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const currentInput = input;
    const userMessage: ChatMessage = { role: 'user', text: currentInput };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      history.push({ role: 'user', parts: [{ text: currentInput }] });

      const response = await chatWithGemini(history);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Scusa, ho avuto un problema tecnico. Riprova." }]);
    } finally {
      setIsLoading(false);
      // Re-focus input after a short delay to allow keyboard to stay open on some mobile browsers
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto p-2 md:p-8 min-h-0">
      <Card className="flex-1 flex flex-col border-none shadow-2xl overflow-hidden wood-texture border border-stone-800 rounded-2xl md:rounded-3xl min-h-0">
        <CardHeader className="border-b border-stone-800 bg-black/20 backdrop-blur-md py-4 md:py-6">
          <CardTitle className="text-xl md:text-2xl font-serif text-campus-gold flex items-center gap-3">
            <div className="bg-campus-accent p-1.5 md:p-2 rounded-xl shadow-inner border border-stone-700">
              <Bot className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            Tutor Accademico
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden relative min-h-0">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          
          <ScrollArea className="flex-1 p-4 md:p-6 overscroll-contain">
            <div className="space-y-6">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={cn(
                    "max-w-[85%] p-5 rounded-3xl shadow-lg relative",
                    msg.role === 'user' 
                      ? 'bg-campus-accent text-stone-100 rounded-tr-none border border-stone-700' 
                      : 'parchment-texture text-stone-800 rounded-tl-none border border-stone-200'
                  )}>
                    <div className={cn(
                      "flex items-center gap-2 mb-2 opacity-60 text-[10px] uppercase font-bold tracking-[0.2em]",
                      msg.role === 'user' ? 'text-stone-300' : 'text-stone-500'
                    )}>
                      {msg.role === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                      {msg.role === 'user' ? 'Studente' : 'Gemini AI'}
                    </div>
                    <p className="text-base font-serif leading-relaxed italic">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="parchment-texture p-4 rounded-3xl rounded-tl-none border border-stone-200 shadow-lg">
                    <Loader2 className="h-5 w-5 animate-spin text-stone-400" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="p-4 md:p-6 bg-black/20 border-t border-stone-800">
            <form 
              onSubmit={handleSend}
              className="flex gap-2 md:gap-3 bg-stone-900/50 p-2 rounded-2xl border border-stone-800 shadow-inner"
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Chiedi qualcosa..."
                disabled={isLoading}
                className="flex-1 bg-transparent border-none text-stone-200 placeholder:text-stone-600 focus-visible:ring-0 text-base md:text-lg font-serif disabled:opacity-50"
              />
              <Button 
                type="submit"
                disabled={isLoading}
                className="rounded-xl bg-campus-accent hover:bg-stone-700 text-white shadow-lg px-4 md:px-6"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
