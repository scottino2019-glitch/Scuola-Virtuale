import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { FileText, Save, Trash2, X, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export const Notepad: React.FC = () => {
  const [content, setContent] = useState(() => localStorage.getItem('school-notepad') || '');
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    localStorage.setItem('school-notepad', content);
  }, [content]);

  return (
    <div className="fixed bottom-24 md:bottom-8 right-8 z-50">
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="h-16 w-16 rounded-2xl bg-campus-gold hover:bg-yellow-600 shadow-2xl text-stone-900 border-2 border-stone-800 transition-all hover:scale-110"
            >
              <FileText className="h-8 w-8" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ 
              y: 0, 
              opacity: 1, 
              scale: 1,
              height: isMinimized ? '60px' : '450px',
              width: isMinimized ? '200px' : '350px'
            }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            className={cn(
              "shadow-2xl overflow-hidden wood-texture border-2 border-stone-800 rounded-3xl transition-all duration-300 flex flex-col",
              isMinimized ? "cursor-pointer" : ""
            )}
            onClick={() => isMinimized && setIsMinimized(false)}
          >
            <div className="p-4 border-b border-stone-800 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-2 text-campus-gold">
                <FileText className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Blocknote</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-stone-500 hover:text-stone-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMinimized(!isMinimized);
                  }}
                >
                  {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
                </Button>
                {!isMinimized && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-stone-500 hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(false);
                      setIsMinimized(false);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            
            {!isMinimized && (
              <div className="flex-1 p-4 flex flex-col">
                <div className="parchment-texture flex-1 rounded-2xl p-4 shadow-inner border border-stone-200 relative overflow-hidden">
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Prendi appunti per la lezione..."
                    className="h-full w-full bg-transparent border-none focus-visible:ring-0 resize-none font-serif text-stone-800 leading-relaxed placeholder:text-stone-300"
                  />
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 text-[10px] text-stone-400 font-mono italic">
                    <Save className="h-3 w-3" /> Auto-salvataggio
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-stone-500 hover:text-red-500"
                    onClick={() => setContent('')}
                  >
                    <Trash2 className="h-3 w-3 mr-1" /> Svuota
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
