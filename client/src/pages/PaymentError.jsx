import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentError = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const errorData = location.state?.errorData || {};

  const handleRetryPayment = () => {
    // Navigate back to passenger details to retry payment
    navigate('/pax-details');
  };

  const handleGoToSearch = () => {
    // Clear any stored data and go back to search
    localStorage.removeItem('oneWayReviewData');
    navigate('/search');
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto pt-8 px-4">
        {/* Error Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
            <p className="text-gray-600">We couldn't process your payment. Please try again.</p>
          </div>

          {/* Error Details */}
          {errorData.message && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Details</h3>
              <p className="text-red-700">{errorData.message}</p>
            </div>
          )}

          {/* Common Payment Issues */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">Common Payment Issues</h3>
            <ul className="text-sm text-yellow-700 space-y-2">
              <li>• Insufficient funds in your account</li>
              <li>• Card has expired or is invalid</li>
              <li>• Bank has declined the transaction</li>
              <li>• Network connectivity issues</li>
              <li>• Payment gateway timeout</li>
            </ul>
          </div>

          {/* What You Can Do */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">What You Can Do</h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• Check your payment method and try again</li>
              <li>• Ensure you have sufficient funds</li>
              <li>• Try using a different payment method</li>
              <li>• Contact your bank if the issue persists</li>
              <li>• Contact our support team for assistance</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleRetryPayment}
              className="flex-1 bg-blue-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleGoToSearch}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Search New Flight
            </button>
          </div>
        </div>

        {/* Support Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-700">Customer Support</p>
              <p className="text-gray-600">+91 98765 43210</p>
              <p className="text-gray-600">support@flyteasy.com</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Available Hours</p>
              <p className="text-gray-600">24/7 Support</p>
              <p className="text-gray-600">Live Chat Available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentError; 