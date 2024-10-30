import React from "react";
import TrialSVG from "@/assets/trial.svg";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  onConfirm?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1F222A] rounded-lg p-8 max-w-sm w-full text-center relative">
        <div className="size-48 mx-auto mb-4">
          <TrialSVG className="w-full h-full" />
        </div>
        <h2 className="text-2xl font-bold text-primary-900 mb-2">{title}</h2>
        <p className="text-white mb-6 whitespace-pre-line">{message}</p>
        <button
          onClick={onConfirm ? onConfirm : onClose}
          className="px-6 py-3 bg-primary-900 text-[#1F222A] rounded-full w-full font-bold"
        >
          Charge
        </button>
      </div>
    </div>
  );
};

export default Modal;
