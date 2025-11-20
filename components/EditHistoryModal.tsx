
import React, { useState } from 'react';
import { StudySession } from '../types';

interface EditHistoryModalProps {
    session: StudySession;
    onClose: () => void;
    onSave: (session: StudySession) => void;
    onDelete: (id: string) => void;
}

const EditHistoryModal: React.FC<EditHistoryModalProps> = ({ session, onClose, onSave, onDelete }) => {
    const [lesson, setLesson] = useState(session.lesson);
    const [paragraph, setParagraph] = useState(session.paragraph);
    const [date, setDate] = useState(session.date);
    const [hours, setHours] = useState(session.hours || 0);
    const [minutes, setMinutes] = useState(session.minutes || 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...session,
            lesson,
            paragraph,
            date,
            hours,
            minutes
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800">Corrigir Registro</h3>
                    <button 
                        type="button"
                        onClick={() => onDelete(session.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium px-2 py-1 rounded hover:bg-red-50"
                    >
                        Excluir
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Lição Nº</label>
                            <input
                                type="number"
                                min="1"
                                value={lesson}
                                onChange={(e) => setLesson(Number(e.target.value))}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Parágrafo</label>
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
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tempo de Estudo</label>
                        <div className="flex gap-2 items-center">
                            <div className="relative flex-1">
                                <input 
                                    type="number" 
                                    min="0"
                                    value={hours}
                                    onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-8"
                                />
                                <span className="absolute right-3 top-2 text-slate-400 text-sm">h</span>
                            </div>
                            <span className="text-slate-400">:</span>
                            <div className="relative flex-1">
                                <input 
                                    type="number" 
                                    min="0" 
                                    max="59"
                                    value={minutes}
                                    onChange={(e) => setMinutes(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10"
                                />
                                <span className="absolute right-3 top-2 text-slate-400 text-sm">min</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Data Realizada</label>
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
                            Atualizar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditHistoryModal;
