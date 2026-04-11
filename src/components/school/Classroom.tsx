import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Classroom as ClassroomType } from '@/types';
import { Monitor, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ClassroomProps {
  classroom: ClassroomType;
}

export const Classroom: React.FC<ClassroomProps> = ({ classroom }) => {
  return (
    <div className="h-full flex flex-col p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800/20 pb-6">
        <div className="flex items-center gap-4">
          <div className="bg-campus-accent p-3 rounded-2xl text-white shadow-lg border border-stone-700">
            <Monitor className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-3xl font-serif font-bold text-stone-200">{classroom.name}</h2>
            <p className="text-stone-500 text-sm font-serif italic">Sessione di apprendimento interattivo</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="rounded-xl border-stone-700 text-stone-300 hover:bg-stone-800 hover:text-white"
          onClick={() => window.open(classroom.appUrl, '_blank')}
        >
          <ExternalLink className="mr-2 h-4 w-4" /> Apri in nuova scheda
        </Button>
      </div>

      <Card className="flex-1 border-none shadow-2xl overflow-hidden wood-texture border border-stone-800 rounded-3xl relative">
        <iframe
          src={classroom.appUrl}
          className="w-full h-full border-none bg-white rounded-2xl"
          title={classroom.name}
          referrerPolicy="no-referrer"
        />
      </Card>
    </div>
  );
};
