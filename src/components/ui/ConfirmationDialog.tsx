import React from 'react';

interface ConfirmationDialogProps {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  title = 'Confirmar acción',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        {title && <h2 className="text-lg font-semibold mb-2 text-zinc-800">{title}</h2>}
        <p className="mb-6 text-zinc-600">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-zinc-200 text-zinc-700 hover:bg-zinc-300 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-zinc-700 text-white hover:bg-zinc-800 transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}; 