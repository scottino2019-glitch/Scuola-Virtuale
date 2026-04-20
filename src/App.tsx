import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { BulletinBoard } from '@/components/school/BulletinBoard';
import { Classroom } from '@/components/school/Classroom';
import { Schedule } from '@/components/school/Schedule';
import { ChatGemini } from '@/components/school/ChatGemini';
import { Notepad } from '@/components/school/Notepad';
import { Note, Lesson, Classroom as ClassroomType } from '@/types';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui-components/Sheet';
import { Button } from '@/components/ui-components/Button';
import { Menu, School, LayoutDashboard, Calendar, Monitor, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

const INITIAL_NOTES: Note[] = [
  { id: '1', content: 'Ricordarsi di studiare per il test di Storia di lunedì!', color: 'bg-yellow-100', x: 0, y: 0 },
  { id: '2', content: 'Consegnare il progetto di Informatica entro venerdì.', color: 'bg-blue-100', x: 0, y: 0 },
  { id: '3', content: 'Portare i moduli per la gita scolastica firmati.', color: 'bg-green-100', x: 0, y: 0 },
];

const INITIAL_LESSONS: Lesson[] = [
  { id: '1', subject: 'Cinese', time: '08:00 - 09:00', day: 'Lunedì', room: 'Aula 102' },
  { id: '2', subject: 'Convesazione', time: '09:00 - 10:00', day: 'Lunedì', room: 'Laboratorio' },
  { id: '3', subject: 'Coreano', time: '10:00 - 11:00', day: 'Lunedì', room: 'Aula 102' },
  { id: '4', subject: 'Russo', time: '08:00 - 09:00', day: 'Martedì', room: 'Aula 105' },
  { id: '5', subject: 'Informatica', time: '09:00 - 11:00', day: 'Mercoledì', room: 'Lab Info 1' },
];

const CLASSROOMS: ClassroomType[] = [
  { id: 'math', name: 'Aula di Coreano', icon: 'languages', appUrl: 'https://www.learnkoreantools.com/it' },
  { id: 'coding', name: 'Laboratorio Coding', icon: 'code', appUrl: 'https://play.tailwindcss.com/' },
  { id: 'languages', name: 'Aula di Cinese', icon: 'languages', appUrl: 'https://www.chineseconverter.com/it' },
  { id: 'library', name: 'Biblioteca Digitale', icon: 'book', appUrl: 'https://archive.org/details/books' },
  { id: 'whiteboard', name: 'Aula di Russo', icon: 'languages', appUrl: 'https://www.russiantools.com/it' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('bacheca');
  const [selectedClassroomId, setSelectedClassroomId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('school-notes');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const saved = localStorage.getItem('school-lessons');
    return saved ? JSON.parse(saved) : INITIAL_LESSONS;
  });

  useEffect(() => {
    localStorage.setItem('school-notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('school-lessons', JSON.stringify(lessons));
  }, [lessons]);

  const handleAddNote = () => {
    const colors = ['bg-yellow-100', 'bg-blue-100', 'bg-green-100', 'bg-pink-100', 'bg-purple-100'];
    const newNote: Note = {
      id: Date.now().toString(),
      content: '',
      color: colors[Math.floor(Math.random() * colors.length)],
      x: 0,
      y: 0
    };
    setNotes([newNote, ...notes]);
  };

  const handleUpdateNote = (id: string, content: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, content } : n));
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const handleAddLesson = (lesson: Lesson) => {
    setLessons([...lessons, lesson]);
  };

  const handleDeleteLesson = (id: string) => {
    setLessons(lessons.filter(l => l.id !== id));
  };

  const selectedClassroom = CLASSROOMS.find(c => c.id === selectedClassroomId);

  const renderContent = () => {
    switch (activeTab) {
      case 'bacheca':
        return <BulletinBoard notes={notes} onAddNote={handleAddNote} onUpdateNote={handleUpdateNote} onDeleteNote={handleDeleteNote} />;
      case 'orario':
        return <Schedule lessons={lessons} onAddLesson={handleAddLesson} onDeleteLesson={handleDeleteLesson} />;
      case 'chat':
        return <ChatGemini />;
      case 'aula':
        return selectedClassroom ? <Classroom classroom={selectedClassroom} /> : <div className="p-10 text-center text-stone-400 font-serif italic">Seleziona un'aula dalla barra laterale per iniziare la lezione</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-[100dvh] bg-campus-dark text-stone-900 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          classrooms={CLASSROOMS}
          selectedClassroom={selectedClassroomId}
          setSelectedClassroom={setSelectedClassroomId}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden h-16 wood-texture border-b border-stone-800 flex items-center justify-between px-6 z-40 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bg-campus-accent p-1.5 rounded-xl text-white shadow-md border border-stone-700">
              <School className="h-5 w-5" />
            </div>
            <span className="font-serif font-bold text-stone-200 tracking-tight">Virtual <span className="text-campus-gold">Campus</span></span>
          </div>
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="text-stone-400">
                  <Menu className="h-6 w-6" />
                </Button>
              }
            />
            <SheetContent side="left" className="p-0 w-64 border-none">
              <Sidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                classrooms={CLASSROOMS}
                selectedClassroom={selectedClassroomId}
                setSelectedClassroom={setSelectedClassroomId}
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* Content Viewport */}
        <div className={cn(
          "flex-1 relative bg-campus-dark flex flex-col min-h-0",
          activeTab !== 'chat' && "overflow-y-auto no-scrollbar"
        )}>
          {/* Background Decoration */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 bg-campus-gold rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-campus-accent rounded-full blur-3xl" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (selectedClassroomId || '')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full relative z-10"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden h-20 wood-texture border-t border-stone-800 flex items-center justify-around px-2 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
          {[
            { id: 'bacheca', icon: LayoutDashboard, label: 'Bacheca' },
            { id: 'orario', icon: Calendar, label: 'Orario' },
            { id: 'aula', icon: Monitor, label: 'Aule' },
            { id: 'chat', icon: MessageSquare, label: 'Tutor' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (item.id !== 'aula') setSelectedClassroomId(null);
              }}
              className={cn(
                "flex flex-col items-center gap-1.5 transition-all duration-300 px-4 py-2 rounded-2xl",
                activeTab === item.id 
                  ? "text-campus-gold bg-campus-accent/20 scale-110" 
                  : "text-stone-500 hover:text-stone-300"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
            </button>
          ))}
        </div>
      </main>

      {/* Floating Notepad */}
      <Notepad />
    </div>
  );
}
