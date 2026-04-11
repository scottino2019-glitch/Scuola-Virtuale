import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Plus, X, StickyNote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Note } from '@/types';
import { cn } from '@/lib/utils';

interface BulletinBoardProps {
  notes: Note[];
  onAddNote: () => void;
  onUpdateNote: (id: string, content: string) => void;
  onDeleteNote: (id: string) => void;
}

export const BulletinBoard: React.FC<BulletinBoardProps> = ({ notes, onAddNote, onUpdateNote, onDeleteNote }) => {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end border-b border-stone-800/20 pb-6">
        <div>
          <h2 className="text-4xl font-serif font-bold text-stone-200">Bacheca Accademica</h2>
          <p className="text-stone-500 text-sm mt-1 font-serif italic">Appunti e promemoria della classe</p>
        </div>
        <Button 
          onClick={onAddNote} 
          className="bg-campus-accent hover:bg-stone-700 text-white rounded-xl shadow-lg border border-stone-700 px-6 py-6"
        >
          <Plus className="mr-2 h-5 w-5" /> Nuova Nota
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {notes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: Math.random() * 4 - 2 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.02, rotate: 0 }}
              className="relative group"
            >
              {/* Pin Decoration */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-600 rounded-full shadow-md z-20 border-2 border-red-800" />
              
              <Card className={cn(
                "parchment-texture border-none shadow-xl relative min-h-[250px] transition-all duration-300",
                "before:absolute before:inset-0 before:bg-black/5 before:pointer-events-none"
              )}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 h-8 w-8 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onDeleteNote(note.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <CardHeader className="pb-2">
                  <CardTitle className="text-stone-400 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em]">
                    <StickyNote className="h-3 w-3" /> Memo #{note.id.slice(-4)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={note.content}
                    onChange={(e) => onUpdateNote(note.id, e.target.value)}
                    className="bg-transparent border-none focus-visible:ring-0 resize-none text-stone-800 font-serif text-lg leading-relaxed min-h-[150px] placeholder:text-stone-300"
                    placeholder="Inizia a scrivere..."
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
