import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Calendar as CalendarIcon, Clock, MapPin, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { Lesson } from '@/types';
import { motion } from 'motion/react';

interface ScheduleProps {
  lessons: Lesson[];
  onAddLesson: (lesson: Lesson) => void;
  onDeleteLesson: (id: string) => void;
}

export const Schedule: React.FC<ScheduleProps> = ({ lessons, onAddLesson, onDeleteLesson }) => {
  const days = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì'];
  const [isAdding, setIsAdding] = useState(false);
  const [newLesson, setNewLesson] = useState<Partial<Lesson>>({
    day: 'Lunedì',
    subject: '',
    time: '',
    room: ''
  });

  const handleAdd = () => {
    if (newLesson.subject && newLesson.time && newLesson.day) {
      onAddLesson({
        id: Date.now().toString(),
        subject: newLesson.subject,
        time: newLesson.time,
        day: newLesson.day,
        room: newLesson.room || 'Aula Magna'
      });
      setNewLesson({ day: 'Lunedì', subject: '', time: '', room: '' });
      setIsAdding(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end border-b border-stone-800/20 pb-6">
        <div>
          <h2 className="text-4xl font-serif font-bold text-stone-200">Orario Accademico</h2>
          <p className="text-stone-500 text-sm mt-1 font-serif italic">Programmazione settimanale delle lezioni</p>
        </div>
        <Button 
          onClick={() => setIsAdding(!isAdding)} 
          className="bg-campus-accent hover:bg-stone-700 text-white rounded-xl shadow-lg border border-stone-700 px-6 py-6"
        >
          {isAdding ? <Check className="mr-2 h-5 w-5" /> : <Plus className="mr-2 h-5 w-5" />}
          {isAdding ? 'Chiudi' : 'Nuova Lezione'}
        </Button>
      </div>

      {isAdding && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="parchment-texture border-none shadow-2xl p-8 rounded-3xl border border-stone-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 ml-1">Materia</label>
                <Input
                  placeholder="Es: Filosofia"
                  value={newLesson.subject}
                  onChange={(e) => setNewLesson({ ...newLesson, subject: e.target.value })}
                  className="bg-white/50 border-stone-200 rounded-xl font-serif"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 ml-1">Orario</label>
                <Input
                  placeholder="Es: 09:00 - 11:00"
                  value={newLesson.time}
                  onChange={(e) => setNewLesson({ ...newLesson, time: e.target.value })}
                  className="bg-white/50 border-stone-200 rounded-xl font-serif"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 ml-1">Giorno</label>
                <select
                  value={newLesson.day}
                  onChange={(e) => setNewLesson({ ...newLesson, day: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-stone-200 bg-white/50 text-sm font-serif focus:ring-2 focus:ring-campus-accent outline-none"
                >
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 ml-1">Aula</label>
                <Input
                  placeholder="Es: Aula 3"
                  value={newLesson.room}
                  onChange={(e) => setNewLesson({ ...newLesson, room: e.target.value })}
                  className="bg-white/50 border-stone-200 rounded-xl font-serif"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <Button variant="ghost" onClick={() => setIsAdding(false)} className="rounded-xl text-stone-500">Annulla</Button>
              <Button onClick={handleAdd} className="bg-campus-accent text-white rounded-xl px-8">Salva Lezione</Button>
            </div>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {days.map((day) => (
          <div key={day} className="space-y-4">
            <div className="wood-texture p-4 rounded-2xl border border-stone-800 shadow-lg">
              <h3 className="text-campus-gold font-serif font-bold text-center tracking-widest uppercase text-xs">{day}</h3>
            </div>
            <div className="space-y-4">
              {lessons.filter(l => l.day === day).length > 0 ? (
                lessons.filter(l => l.day === day).map((lesson) => (
                  <motion.div key={lesson.id} whileHover={{ y: -4 }}>
                    <Card className="parchment-texture border-none shadow-md group relative overflow-hidden rounded-2xl border border-stone-200">
                      <div className="absolute top-0 left-0 w-1 h-full bg-campus-accent opacity-50" />
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <Badge variant="outline" className="bg-campus-accent/5 text-campus-accent border-campus-accent/20 font-serif italic">
                            {lesson.time}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-stone-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => onDeleteLesson(lesson.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <h4 className="font-serif font-bold text-stone-800 text-lg mb-2 leading-tight">{lesson.subject}</h4>
                        <div className="flex items-center gap-2 text-stone-500 text-[10px] font-mono uppercase tracking-widest">
                          <MapPin className="h-3 w-3" /> {lesson.room}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="p-8 border-2 border-dashed border-stone-800/30 rounded-2xl text-center">
                  <p className="text-stone-600 text-[10px] font-serif italic uppercase tracking-widest">Nessuna lezione</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
