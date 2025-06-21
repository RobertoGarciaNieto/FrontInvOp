import React from 'react';

interface SuccessAlertProps {
  message: string;
}

interface ConfirmationAlertProps {
  message: string;
  onAccept: () => void;
  onDeny: () => void;
}

export const SuccessAlert: React.FC<SuccessAlertProps> = ({ message }) => {
  return (
    <div role="alert" className="alert alert-success alert-soft">
      <span>{message}</span>
    </div>
  );
};

export const ConfirmationAlert: React.FC<ConfirmationAlertProps> = ({ 
  message, 
  onAccept, 
  onDeny 
}) => {
  return (
    <div role="alert" className="alert alert-vertical sm:alert-horizontal">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        className="stroke-info h-6 w-6 shrink-0"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{message}</span>
      <div>
        <button className="btn btn-sm" onClick={onDeny}>Denegar</button>
        <button className="btn btn-sm btn-primary" onClick={onAccept}>Aceptar</button>
      </div>
    </div>
  );
}; 