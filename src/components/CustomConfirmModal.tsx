import React from 'react';
import { CustomModal, ModalTheme } from './CustomModal';
import { AlertTriangle, Trash2, RotateCcw, XCircle } from 'lucide-react';
import { audio } from '../utils/audio';

interface CustomConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  theme?: ModalTheme;
  iconType?: 'trash' | 'warning' | 'reset';
  isLoading?: boolean;
}

export const CustomConfirmModal: React.FC<CustomConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = true,
  theme = danger ? 'rose' : 'yellow',
  iconType = 'trash',
  isLoading = false,
}) => {
  const handleConfirm = () => {
    audio.playSelect();
    onConfirm();
  };

  const handleCancel = () => {
    audio.playPass();
    onClose();
  };

  const renderIcon = () => {
    if (iconType === 'trash') {
      return <Trash2 className="w-5 h-5 text-rose-400" />;
    }
    if (iconType === 'reset') {
      return <RotateCcw className="w-5 h-5 text-cyan-400" />;
    }
    return <AlertTriangle className="w-5 h-5 text-amber-400" />;
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleCancel}
      title={title}
      icon={renderIcon()}
      badge={danger ? 'ACTION REQUIRES CONFIRMATION' : 'ATTENTION'}
      theme={theme}
      maxWidth="md"
      footer={
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="w-full sm:w-auto min-h-[44px] px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-retro text-xs rounded-xl border border-slate-700 transition-colors active:scale-95"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={`w-full sm:w-auto min-h-[44px] px-5 py-2 font-pixel text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
              danger
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 ring-2 ring-rose-500/40'
                : 'bg-yellow-400 hover:bg-yellow-300 text-slate-950 shadow-yellow-400/30'
            }`}
          >
            {danger && <Trash2 className="w-3.5 h-3.5" />}
            {iconType === 'reset' && <RotateCcw className="w-3.5 h-3.5" />}
            <span>{confirmLabel}</span>
          </button>
        </div>
      }
    >
      <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
        <p className="text-xs sm:text-sm font-retro text-slate-200 leading-relaxed">
          {message}
        </p>
      </div>
    </CustomModal>
  );
};
