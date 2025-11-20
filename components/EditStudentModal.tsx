
import React, { useState, useEffect } from 'react';
import { Student } from '../types';

interface EditStudentModalProps {
    student: Student;
    onClose: () => void;
    onSave: (id: string, name: string, contact: string, startDate: string) => void;
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({ student, onClose, onSave }) => {
    const [name, setName] = useState(student.name);
    const [contact, setContact] = useState(student.contact);
    const [startDate, setStartDate] = useState(student.startDate);

    useEffect(() => {
        setName(student.name);
        setContact(student.contact);
        setStartDate(student.startDate);
    }, [student]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSave(student.id, name, contact, startDate);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800">Editar Registro</h3>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Estudante</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Contato (WhatsApp/Tel)</label>
                        <input
                            type="text"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Data de Início</label>
                        <input
                            type="date"
                            required
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                    </div>

                    <div className="flex gap-3 mt-6">
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
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditStudentModal;
