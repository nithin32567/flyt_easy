import * as React from "react";
import { Calendar } from "../ui/calendar";

export function CalanderModal({ isOpen, setIsOpen, setDate }) {
  const handleClose = () => {
    setIsOpen(false);
  };

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

  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white rounded-lg border max-w-sm w-full mx-4">
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
}
