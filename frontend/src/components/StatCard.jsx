import React from 'react';

const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="glass glass-hover rounded-2xl p-6 border border-slate-800/80 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="text-3xl font-extrabold text-slate-100 mt-2 tracking-tight">
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${color.bg} ${color.text} border ${color.border}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
