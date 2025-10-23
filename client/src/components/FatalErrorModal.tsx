import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface FatalErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  primaryText?: string;
  secondaryText?: string;
  autoRedirect?: boolean;
  redirectDelay?: number;
}

const FatalErrorModal: React.FC<FatalErrorModalProps> = ({
  isOpen,
  onClose,
  title = "Session Expired",
  description = "We couldn't fetch the available rooms or price details for this hotel. Please search again.",
  onPrimary,
  onSecondary,
  primaryText = "Go to Search",
  secondaryText = "Reload Details",
  autoRedirect = true,
  redirectDelay = 3000
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && autoRedirect) {
      const timer = setTimeout(() => {
        handlePrimary();
      }, redirectDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoRedirect, redirectDelay]);

  const handlePrimary = () => {
    if (onPrimary) {
      onPrimary();
    } else {
      // Default: navigate to home search page
      navigate('/');
    }
    onClose();
  };

  const handleSecondary = () => {
    if (onSecondary) {
      onSecondary();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Icon */}
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
          {title}
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-center mb-6">
          {description}
        </p>

        {/* Auto-redirect countdown */}
        {autoRedirect && (
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500">
              Redirecting to search page in {Math.ceil(redirectDelay / 1000)} seconds...
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handlePrimary}
            className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            {primaryText}
          </button>
          
          {onSecondary && (
            <button
              onClick={handleSecondary}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {secondaryText}
            </button>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FatalErrorModal;
