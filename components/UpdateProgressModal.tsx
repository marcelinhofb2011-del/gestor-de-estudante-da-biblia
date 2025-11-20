
import React, { useState, useEffect } from 'react';
import { Student } from '../types';

interface UpdateProgressModalProps {
    student: Student;
    onClose: () => void;
    onSave: (lesson: number, paragraph: number, date: string) => void;
}

const UpdateProgressModal: React.FC<UpdateProgressModalProps> = ({ student, onClose, onSave }) => {
    const [lesson, setLesson] = useState(student.currentLesson);
    const [paragraph, setParagraph] = useState(student.currentParagraph);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [mode, setMode] = useState<'continue' | 'new'>('continue');

    useEffect(() => {
        if (mode === 'new') {
            setLesson(prev => Math.min(student.totalLessons, prev + 1));
            setParagraph(0);
        } else {
            setLesson(student.currentLesson);
            setParagraph(student.currentParagraph);
        }
    }, [mode, student]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(lesson, paragraph, date);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800">Atualizar: {student.name}</h3>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    
                    <div className="flex p-1 bg-slate-100 rounded-lg">
                        <button
                            type="button"
                            onClick={() => setMode('continue')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'continue' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
                        >
                            Continuar Lição {student.currentLesson}
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('new')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'new' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
                        >
                            Nova Lição
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Lição Nº</label>
                            <input
                                type="number"
                                min="1"
                                max={student.totalLessons}
                                value={lesson}
                                onChange={(e) => setLesson(Number(e.target.value))}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Parágrafo (Opcional)</label>
                            <input
                                type="number"
                                min="0"
                                value={paragraph}
                                onChange={(e) => setParagraph(Number(e.target.value))}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Data de Conclusão</label>
                        <input
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 px-4 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Salvar Progresso
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProgressModal;
