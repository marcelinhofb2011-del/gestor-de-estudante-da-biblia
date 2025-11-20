
import React from 'react';

interface ProgressBarProps {
    current: number;
    total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
    const percentage = Math.min(100, Math.max(0, (current / total) * 100));

    let colorClass = 'bg-red-500';
    if (percentage >= 25) colorClass = 'bg-amber-500';
    if (percentage >= 50) colorClass = 'bg-blue-500';
    if (percentage >= 75) colorClass = 'bg-emerald-500';
    if (percentage >= 100) colorClass = 'bg-emerald-600';

    return (
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
            <div
                className={`h-full transition-all duration-700 ease-out ${colorClass}`}
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;
