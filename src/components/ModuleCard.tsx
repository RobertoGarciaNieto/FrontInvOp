import React from 'react';
import { Link } from 'react-router-dom';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ title, description, icon, path, color }) => {
  return (
    <Link to={path} className="block">
      <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border-t-4 ${color}`}>
        <div className="flex items-center mb-4">
          <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
            {icon}
          </div>
          <h3 className="text-xl font-semibold text-gray-800 ml-4">{title}</h3>
        </div>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
};

export default ModuleCard; 