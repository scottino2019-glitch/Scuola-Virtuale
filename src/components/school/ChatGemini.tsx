import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));
    history.push({ role: 'user', parts: [{ text: input }] });

    const response = await chatWithGemini(history);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto p-4 md:p-8">
      <Card className="flex-1 flex flex-col border-none shadow-2xl overflow-hidden wood-texture border border-stone-800 rounded-3xl">
        <CardHeader className="border-b border-stone-800 bg-black/20 backdrop-blur-md py-6">
          <CardTitle className="text-2xl font-serif text-campus-gold flex items-center gap-3">
            <div className="bg-campus-accent p-2 rounded-xl shadow-inner border border-stone-700">
              <Bot className="h-6 w-6 text-white" />
            </div>
            Tutor Accademico
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden relative">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          
          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
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
            </div>
          </ScrollArea>
          
          <div className="p-6 bg-black/20 border-t border-stone-800">
            <div className="flex gap-3 bg-stone-900/50 p-2 rounded-2xl border border-stone-800 shadow-inner">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Poni un quesito al tuo precettore..."
                className="flex-1 bg-transparent border-none text-stone-200 placeholder:text-stone-600 focus-visible:ring-0 text-lg font-serif"
              />
              <Button 
                onClick={handleSend} 
                disabled={isLoading}
                className="rounded-xl bg-campus-accent hover:bg-stone-700 text-white shadow-lg px-6"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
