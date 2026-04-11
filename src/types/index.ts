export interface Note {
  id: string;
  content: string;
  color: string;
  x: number;
  y: number;
}

export interface Lesson {
  id: string;
  subject: string;
  time: string;
  day: string;
  room: string;
}

export interface Classroom {
  id: string;
  name: string;
  icon: string;
  appUrl: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
