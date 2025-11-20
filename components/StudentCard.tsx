
import React, { useState } from 'react';
import { Student } from '../types';
import ProgressBar from './ProgressBar';
import { getTeachingTips } from '../services/geminiService';

interface StudentCardProps {
    student: Student;
    onUpdate: (student: Student) => void;
    onEdit: (student: Student) => void;
    onDelete: (id: string) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onUpdate, onEdit, onDelete }) => {
    const [showHistory, setShowHistory] = useState(false);
    const [aiTips, setAiTips] = useState<string | null>(null);
    const [loadingAi, setLoadingAi] = useState(false);

    // Função para formatar data sem problemas de fuso horário
    const formatDate = (dateString: string) => {
        if (!dateString) return 'Data inválida';
        // Divide a string "YYYY-MM-DD" manualmente
        const parts = dateString.split('-');
        if (parts.length !== 3) return dateString;
        // Retorna DD/MM/YYYY
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    };

    const handleGetTips = async () => {
        setLoadingAi(true);
        const tips = await getTeachingTips(student.currentLesson);
        setAiTips(tips);
        setLoadingAi(false);
    };

    const lastSession = student.history.length > 0 ? student.history[student.history.length - 1] : null;

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100 hover:shadow-lg transition-all">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">{student.name}</h3>
                        <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>{student.contact}</span>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <button 
                            onClick={() => onEdit(student)}
                            className="text-blue-400 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50"
                            title="Editar dados"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button 
                            onClick={() => onDelete(student.id)}
                            className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50"
                            title="Excluir estudante"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="flex justify-between text-sm font-medium text-slate-700 mb-1">
                        <span>Progresso: Lição {student.currentLesson} de {student.totalLessons}</span>
                        <span>{Math.round((student.currentLesson / student.totalLessons) * 100)}%</span>
                    </div>
                    <ProgressBar current={student.currentLesson} total={student.totalLessons} />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 bg-slate-50 p-3 rounded-lg">
                    <div>
                        <p className="text-xs text-slate-500 uppercase font-semibold">Último Estudo</p>
                        <p className="text-slate-800 font-medium">
                            {lastSession ? formatDate(lastSession.date) : 'Não iniciado'}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 uppercase font-semibold">Parágrafo Atual</p>
                        <p className="text-slate-800 font-medium">
                            {student.currentParagraph > 0 ? `§ ${student.currentParagraph}` : '-'}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button 
                        onClick={() => onUpdate(student)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Atualizar Progresso
                    </button>
                    <button
                        onClick={handleGetTips}
                        disabled={loadingAi}
                        className="bg-amber-100 hover:bg-amber-200 text-amber-700 py-2 px-3 rounded-lg transition-colors"
                        title="Dicas de Ensino com IA"
                    >
                        {loadingAi ? (
                            <div className="animate-spin h-5 w-5 border-2 border-amber-600 border-t-transparent rounded-full"></div>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        )}
                    </button>
                </div>
                
                {aiTips && (
                    <div className="mt-4 bg-amber-50 p-4 rounded-lg border border-amber-200 animate-fade-in">
                        <div className="flex justify-between items-center mb-2">
                             <h4 className="font-bold text-amber-800 text-sm">Dicas para Lição {student.currentLesson}</h4>
                             <button onClick={() => setAiTips(null)} className="text-amber-600 hover:text-amber-800">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                             </button>
                        </div>
                        <div className="prose prose-sm prose-amber max-w-none" dangerouslySetInnerHTML={{ 
                            __html: aiTips.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') 
                        }} />
                    </div>
                )}

                <button 
                    onClick={() => setShowHistory(!showHistory)}
                    className="w-full mt-4 text-xs text-slate-500 hover:text-blue-600 flex items-center justify-center gap-1"
                >
                    {showHistory ? 'Ocultar Histórico' : 'Ver Histórico Completo'}
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-transform ${showHistory ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {showHistory && (
                    <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border-t pt-2">
                        {student.history.length === 0 ? (
                            <p className="text-xs text-center text-slate-400 py-2">Nenhum registro ainda.</p>
                        ) : (
                            [...student.history].reverse().map((h, idx) => (
                                <div key={idx} className="flex justify-between text-xs text-slate-600 bg-slate-50 p-2 rounded">
                                    <span>{formatDate(h.date)}</span>
                                    <span className="font-medium">Lição {h.lesson} {h.paragraph > 0 ? `(§ ${h.paragraph})` : ''}</span>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentCard;
