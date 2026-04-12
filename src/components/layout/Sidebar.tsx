import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui-components/Button';
import { 
  LayoutDashboard, 
  Monitor, 
  Calendar, 
  MessageSquare, 
  School,
  ChevronRight,
  Calculator,
  Code,
  Book,
  Edit3,
  Languages,
  Globe
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  calculator: Calculator,
  code: Code,
  book: Book,
  edit: Edit3,
  languages: Languages,
  globe: Globe,
  monitor: Monitor
};

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  classrooms: { id: string, name: string }[];
  selectedClassroom: string | null;
  setSelectedClassroom: (id: string | null) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  classrooms,
  selectedClassroom,
  setSelectedClassroom
}) => {
  const navItems = [
    { id: 'bacheca', label: 'Bacheca', icon: LayoutDashboard },
    { id: 'orario', label: 'Orario', icon: Calendar },
    { id: 'chat', label: 'Tutor AI', icon: MessageSquare },
  ];

  return (
    <div className="w-64 wood-texture border-r border-stone-800 flex flex-col h-full shadow-2xl z-50">
      <div className="p-8 border-b border-stone-800/50">
        <div className="flex items-center gap-3 text-stone-200">
          <div className="bg-campus-accent p-2.5 rounded-2xl text-white shadow-lg border border-stone-700">
            <School className="h-6 w-6" />
          </div>
          <h1 className="font-serif font-bold text-xl leading-tight tracking-tight">Virtual<br/><span className="text-campus-gold">Campus</span></h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8 no-scrollbar">
        <nav className="space-y-2">
          <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 mb-3">Accademia</p>
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 rounded-xl py-6 transition-all duration-300",
                activeTab === item.id 
                  ? "bg-campus-accent/20 text-campus-gold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] border border-stone-700" 
                  : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/50"
              )}
              onClick={() => {
                setActiveTab(item.id);
                setSelectedClassroom(null);
              }}
            >
              <item.icon className={cn("h-5 w-5", activeTab === item.id ? "text-campus-gold" : "text-stone-500")} />
              <span className="font-medium tracking-wide">{item.label}</span>
            </Button>
          ))}
        </nav>

        <div className="space-y-2">
          <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 mb-3">Aule Studio</p>
          {classrooms.map((room) => {
            const IconComponent = ICON_MAP[room.icon] || Monitor;
            return (
              <Button
                key={room.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 rounded-xl py-6 transition-all duration-300 group",
                  selectedClassroom === room.id 
                    ? "bg-campus-accent/20 text-campus-gold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] border border-stone-700" 
                    : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/50"
                )}
                onClick={() => {
                  setSelectedClassroom(room.id);
                  setActiveTab('aula');
                }}
              >
                <IconComponent className={cn("h-5 w-5", selectedClassroom === room.id ? "text-campus-gold" : "text-stone-500")} />
                <span className="font-medium truncate tracking-wide">{room.name}</span>
                <ChevronRight className={cn(
                  "ml-auto h-4 w-4 opacity-0 transition-all",
                  selectedClassroom === room.id ? "opacity-100 translate-x-0" : "group-hover:opacity-100 -translate-x-1"
                )} />
              </Button>
            );
          })}
        </div>
      </div>

      <div className="p-6 border-t border-stone-800/50">
        <div className="bg-stone-900/50 p-4 rounded-2xl border border-stone-800">
          <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">Studente</p>
          <p className="text-sm font-bold text-stone-200">Silvy</p>
          <p className="text-[10px] text-stone-500 italic">Lingue</p>
        </div>
      </div>
    </div>
  );
};
