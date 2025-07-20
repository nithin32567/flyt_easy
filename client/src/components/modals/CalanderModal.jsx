import * as React from "react";
import { Calendar } from "../ui/calendar";
import { X } from "lucide-react";

export function CalanderModal({ isOpen, setIsOpen, setDate }) {
  const handleClose = () => {
    setIsOpen(false);
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
    <div className="fixed inset-0 w-[400px]   mx-auto bg-black/90  rounded-md bg-opacity-30 flex items-center justify-center z-50">
      <Calendar
        mode="single"
        onSelect={handleSelectAndClose}
        disabled={disabled}
        className="rounded-md border shadow-2xl shadow-black  max-w-md relative w-full h-full "
        captionLayout="dropdown"
      />
      <X
        onClick={handleClose}
        className="absolute top-0 w-10 h-10 right-0 shadow-md rounded-full  text-black p-2"
      />
    </div>
  );
}
