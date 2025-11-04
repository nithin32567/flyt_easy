import * as React from "react";
import { createPortal } from "react-dom";
import { Calendar } from "../ui/calendar";

export function CalanderModal({ isOpen, setIsOpen, setDate }) {
  // Handle click outside to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  // Disable dates before today
  const disabled = (date) => {
    return date < new Date(new Date().setHours(0, 0, 0, 0));
  };

  function handleSelectAndClose(date) {
    setDate(date);
    setIsOpen(false);
  }

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4"
      style={{ zIndex: 999999 }}
      onClick={handleBackdropClick}
    >
      <div 
        className="relative bg-white rounded-lg border max-w-sm w-full mx-4"
        onClick={handleModalContentClick}
        style={{ zIndex: 999999 }}
      >
        <div className="p-3">
          <Calendar
            mode="single"
            onSelect={handleSelectAndClose}
            disabled={disabled}
            className="rounded-md w-full"
            captionLayout="dropdown"
          />
        </div>
      </div>
    </div>
  );

  return isOpen ? createPortal(modalContent, document.body) : null;
}
