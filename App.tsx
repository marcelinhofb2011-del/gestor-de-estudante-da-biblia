
import React, { useState, useEffect } from 'react';
import { Student, StudySession } from './types';
import { DEFAULT_BOOK } from './data/bibleData';
import StudentCard from './components/StudentCard';
import AddStudentModal from './components/AddStudentModal';
import UpdateProgressModal from './components/UpdateProgressModal';
import EditStudentModal from './components/EditStudentModal';
import EditHistoryModal from './components/EditHistoryModal';

const App: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    // Modals state
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    
    // State for editing a specific history entry
    const [editingHistorySession, setEditingHistorySession] = useState<{studentId: string, session: StudySession} | null>(null);

    // Load from LocalStorage with migration for new fields
    useEffect(() => {
        try {
            const saved = localStorage.getItem('bibleStudents');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Data migration: ensure history items have IDs and time fields
                const migrated = parsed.map((s: Student) => ({
                    ...s,
                    history: s.history.map((h: any) => ({
                        ...h,
                        id: h.id || crypto.randomUUID(),
                        hours: h.hours || 0,
                        minutes: h.minutes || 0
                    }))
                }));
                setStudents(migrated);
            }
        } catch (error) {
            console.error("Failed to load data", error);
        }
    }, []);

    // Save to LocalStorage
    useEffect(() => {
        try {
            localStorage.setItem('bibleStudents', JSON.stringify(students));
        } catch (error) {
            console.error("Failed to save data", error);
        }
    }, [students]);

    const handleAddStudent = (name: string, contact: string, startDate: string) => {
        const newStudent: Student = {
            id: crypto.randomUUID(),
            name,
            contact,
            bookName: DEFAULT_BOOK.name,
            startDate,
            currentLesson: 1,
            currentParagraph: 0,
            totalLessons: DEFAULT_BOOK.totalLessons,
            history: []
        };
        setStudents(prev => [...prev, newStudent]);
    };

    const handleEditStudent = (id: string, name: string, contact: string, startDate: string) => {
        setStudents(prev => prev.map(s => 
            s.id === id 
            ? { ...s, name, contact, startDate }
            : s
        ));
        setEditingStudent(null);
    };

    const handleUpdateProgress = (lesson: number, paragraph: number, date: string, hours: number, minutes: number) => {
        if (!selectedStudent) return;

        setStudents(prev => prev.map(s => {
            if (s.id !== selectedStudent.id) return s;

            const newSession: StudySession = { 
                id: crypto.randomUUID(),
                lesson, 
                paragraph, 
                date,
                hours,
                minutes
            };
            
            return {
                ...s,
                currentLesson: lesson,
                currentParagraph: paragraph,
                history: [...s.history, newSession]
            };
        }));
        
        setSelectedStudent(null);
    };

    const handleSaveHistoryEdit = (updatedSession: StudySession) => {
        if (!editingHistorySession) return;

        setStudents(prev => prev.map(s => {
            if (s.id !== editingHistorySession.studentId) return s;

            // Update the specific session in history
            const updatedHistory = s.history.map(h => 
                h.id === updatedSession.id ? updatedSession : h
            );

            // Determine if we need to update the "current" progress based on the latest history entry
            // Sort history by date (or simply trust the order if appended) to find the "latest" state
            // For simplicity, if we edit the LAST entry, we update the main state.
            const isLastEntry = s.history.length > 0 && s.history[s.history.length - 1].id === updatedSession.id;
            
            let newCurrentLesson = s.currentLesson;
            let newCurrentParagraph = s.currentParagraph;

            if (isLastEntry) {
                newCurrentLesson = updatedSession.lesson;
                newCurrentParagraph = updatedSession.paragraph;
            }

            return {
                ...s,
                currentLesson: newCurrentLesson,
                currentParagraph: newCurrentParagraph,
                history: updatedHistory
            };
        }));

        setEditingHistorySession(null);
    };

    const handleDeleteHistoryEntry = (sessionId: string) => {
        if (!editingHistorySession) return;
        
        if(window.confirm("Tem certeza que deseja apagar este registro do histórico?")) {
             setStudents(prev => prev.map(s => {
                if (s.id !== editingHistorySession.studentId) return s;

                const updatedHistory = s.history.filter(h => h.id !== sessionId);
                
                // If we deleted the last entry, revert "current" to the new last entry
                const lastSession = updatedHistory.length > 0 ? updatedHistory[updatedHistory.length - 1] : null;
                
                return {
                    ...s,
                    currentLesson: lastSession ? lastSession.lesson : 1,
                    currentParagraph: lastSession ? lastSession.paragraph : 0,
                    history: updatedHistory
                };
            }));
            setEditingHistorySession(null);
        }
    }

    const handleDeleteStudent = (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir este estudante?")) {
            setStudents(prev => prev.filter(s => s.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-lg text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold text-slate-800 hidden sm:block">Estudantes da Bíblia</h1>
                        <h1 className="text-xl font-bold text-slate-800 sm:hidden">Estudantes</h1>
                    </div>
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Novo Estudante
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8">
                {students.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-slate-300">
                        <div className="text-slate-300 mb-4 flex justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-slate-700 mb-2">Nenhum estudante cadastrado</h2>
                        <p className="text-slate-500 mb-6">Comece adicionando seu primeiro estudante da Bíblia.</p>
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="text-blue-600 font-medium hover:underline"
                        >
                            Adicionar Estudante Agora
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {students.map(student => (
                            <StudentCard 
                                key={student.id} 
                                student={student}
                                onUpdate={setSelectedStudent}
                                onEdit={setEditingStudent}
                                onDelete={handleDeleteStudent}
                                onEditHistory={(session) => setEditingHistorySession({ studentId: student.id, session })}
                            />
                        ))}
                    </div>
                )}
            </main>

            {isAddModalOpen && (
                <AddStudentModal 
                    onClose={() => setIsAddModalOpen(false)} 
                    onSave={handleAddStudent} 
                />
            )}

            {editingStudent && (
                <EditStudentModal
                    student={editingStudent}
                    onClose={() => setEditingStudent(null)}
                    onSave={handleEditStudent}
                />
            )}

            {selectedStudent && (
                <UpdateProgressModal
                    student={selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                    onSave={handleUpdateProgress}
                />
            )}

            {editingHistorySession && (
                <EditHistoryModal
                    session={editingHistorySession.session}
                    onClose={() => setEditingHistorySession(null)}
                    onSave={handleSaveHistoryEdit}
                    onDelete={handleDeleteHistoryEntry}
                />
            )}

            <footer className="text-center text-slate-400 text-sm py-8">
                <p>Focado no livro "Seja Feliz Para Sempre!"</p>
            </footer>
        </div>
    );
};

export default App;
