import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import BookingSummaryCard from './BookingSummaryCard';
import BookingFullDetails from './BookingFullDetails';

interface BookingAccordionProps {
  booking: any;
  isActive?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

const BookingAccordion: React.FC<BookingAccordionProps> = ({ 
  booking, 
  isActive = false, 
  isOpen = false, 
  onToggle 
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  
  // Use external isOpen if provided, otherwise use internal state
  const isExpanded = onToggle ? isOpen : internalIsOpen;

  const toggleOpen = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  return (
    <motion.div
      layout
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${
        isActive ? 'shadow-lg border-blue-200' : 'hover:shadow-md'
      }`}
      whileHover={{ scale: 1.01 }}
    >
      {/* Accordion Trigger */}
      <button
        onClick={toggleOpen}
        className="w-full p-4 md:p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-200"
      >
        <div className="flex-1">
          <BookingSummaryCard booking={booking} isActive={isActive} />
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-4 flex-shrink-0"
        >
          <ChevronDown className="h-5 w-5 text-gray-500" />
        </motion.div>
      </button>

      {/* Accordion Content */}
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="px-4 md:px-6 pb-4 md:pb-6 border-t border-gray-100">
          <BookingFullDetails booking={booking} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BookingAccordion;
