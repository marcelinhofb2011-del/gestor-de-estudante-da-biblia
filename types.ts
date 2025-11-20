
export interface StudySession {
    lesson: number;
    paragraph: number;
    date: string; // ISO Date string
    notes?: string;
}

export interface Student {
    id: string;
    name: string;
    contact: string;
    bookName: string;
    startDate: string;
    currentLesson: number;
    currentParagraph: number;
    totalLessons: number;
    history: StudySession[];
}

export type ProgressColor = 'red' | 'yellow' | 'blue' | 'green';
