import React, { useState } from 'react';
import ContactInfoForm from '../components/ContactInfoForm';
import TravelersList from '../components/TravelersList';
import { User, Users, CheckCircle } from 'lucide-react';
import { validateItinerary } from '../utils/validation';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PaymentButton from '../components/PaymentButton';

const Createitenary = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [contactInfo, setContactInfo] = useState(null);
  const [travelers, setTravelers] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const pricerTUI = localStorage.getItem("pricerTUI");
  const pricerData = JSON.parse(localStorage.getItem("pricerData"));
  // const reviewData = JSON.parse(localStorage.getItem("oneWayReviewData"));
  const netAmount = localStorage.getItem("netamount") // Use the exact value without parsing
  const [itenarySuccess, setItenarySuccess] = useState(false);
  const navigate = useNavigate();

  // Debug logging
  console.log('PricerData:', pricerData);
  console.log('NetAmount from pricerData:', netAmount, 'Type:', typeof netAmount);

  // proper date validation with current date should be added 

  // Sample data for testing


  const steps = [
    { id: 1, title: 'Contact Information', icon: User },
    { id: 2, title: 'Travelers', icon: Users },
    { id: 3, title: 'Review & Submit', icon: CheckCircle }
  ];

  const handleContactInfoSave = (data) => {
    setContactInfo(data);
    setCurrentStep(2);
  };

  const handleTravelersChange = (newTravelers) => {
    setTravelers(newTravelers);
  };

  const handleNextToReview = () => {
    setCurrentStep(3);
  };

  const handleSubmit = async () => {
    // Validate the complete itinerary
    const validation = validateItinerary(contactInfo, travelers);
    setValidationErrors(validation.errors);

    if (validation.isValid) {
      // Additional validation for required data
      if (!pricerTUI) {
        alert('Missing pricing data. Please try searching for flights again.');
        return;
      }
      
      if (!netAmount || netAmount <= 0) {
        alert('Invalid pricing data. Please try searching for flights again.');
        return;
      }

      const itineraryData = {
        ContactInfo: contactInfo,
        Travellers: travelers
      };

      console.log('Itinerary Data:', itineraryData);
      try {
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
        const payload = {
          TUI: pricerTUI,
          ContactInfo: contactInfo,
          Travellers: travelers,
          NetAmount: netAmount,
          ClientID: localStorage.getItem("ClientID")
        }

        console.log('Sending payload with NetAmount:', netAmount, 'Type:', typeof netAmount);
        console.log('Full payload:', payload);
        console.log('Original pricerData NetAmount:', pricerData.NetAmount, 'Type:', typeof pricerData.NetAmount);
        console.log('TUI being sent:', pricerTUI);
        
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/flights/create-itinerary`, payload, { headers });
        console.log(response.data, '================================= response');
        
        if (response.data.success) {
          localStorage.setItem("TransactionID", response.data.data.TransactionID);
          setItenarySuccess(true);
        } else {
          console.error('API Error:', response.data.message);
          console.error('Error Code:', response.data.errorCode);
          console.error('Full Error Response:', response.data);
          alert(`Failed to create itinerary: ${response.data.message}`);
        }

      } catch (error) {
        console.log(error, '================================= error');
        console.log('Error response:', error.response?.data);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to create itinerary';
        alert(`Error: ${errorMessage}`);
      }
    } else {
      // Show validation errors
      console.log('Validation Errors:', validation.errors);
      alert('Please fix the validation errors before submitting.');
    }
  };


  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="w-full">
            <ContactInfoForm
              contactData={contactInfo}
              onSave={handleContactInfoSave}
            />
   
          </div>
        );
      case 2:
        return (
          <div className="w-full">
            <TravelersList
              travelers={travelers}
              onTravelersChange={handleTravelersChange}
            />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-6 rounded-md font-semibold transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNextToReview}
                  disabled={travelers.length === 0}
                  className="w-full sm:w-auto bg-[#f48f22] hover:bg-[#16437c] text-white py-2 px-6 rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Review Itinerary</h2>

              {/* Validation Errors Display */}
              {(() => {
                const hasGeneralError = validationErrors.general;
                const hasContactErrors = validationErrors.contactInfo && Object.keys(validationErrors.contactInfo).length > 0;
                const hasTravelerErrors = validationErrors.travelers && validationErrors.travelers.some(travelerErrors =>
                  Object.keys(travelerErrors).length > 0
                );

                const hasAnyErrors = hasGeneralError || hasContactErrors || hasTravelerErrors;

                return hasAnyErrors ? (
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="text-base sm:text-lg font-semibold text-red-800 mb-2">Please fix the following errors:</h3>
                    <ul className="space-y-1">
                      {hasGeneralError && (
                        <li className="text-red-700">• {validationErrors.general}</li>
                      )}
                      {hasContactErrors && (
                        <li className="text-red-700">• Contact Information has errors</li>
                      )}
                      {hasTravelerErrors && (
                        <li className="text-red-700">• Traveler information has errors</li>
                      )}
                    </ul>
                  </div>
                ) : null;
              })()}

              {/* Contact Information Review */}
              <div className="border-b border-gray-200 pb-4 sm:pb-6 mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">Contact Information</h3>
                {contactInfo && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                    <div className="break-words">
                      <span className="font-medium">Name:</span> {contactInfo.Title} {contactInfo.FName} {contactInfo.LName}
                    </div>
                    <div className="break-words">
                      <span className="font-medium">Mobile:</span> {contactInfo.Mobile}
                    </div>
                    <div className="break-words">
                      <span className="font-medium">Email:</span> {contactInfo.Email}
                    </div>
                    <div className="break-words">
                      <span className="font-medium">Address:</span> {contactInfo.Address}
                    </div>
                    <div className="break-words">
                      <span className="font-medium">City:</span> {contactInfo.City}, {contactInfo.State}
                    </div>
                    <div className="break-words">
                      <span className="font-medium">PIN:</span> {contactInfo.PIN}
                    </div>
                  </div>
                )}
              </div>

              {/* Travelers Review */}
              <div className="border-b border-gray-200 pb-4 sm:pb-6 mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">Travelers ({travelers.length})</h3>
                <div className="space-y-3">
                  {travelers.map((traveler, index) => (
                    <div key={traveler.ID} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-[#f48f22] text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="font-medium break-words">{traveler.Title} {traveler.FName} {traveler.LName}</span>
                          <span className="text-gray-500 ml-2">({traveler.PTC})</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-6 rounded-md font-semibold transition-colors"
                >
                  Back
                </button>
                {!itenarySuccess ? (
                  <button
                    onClick={handleSubmit}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md font-semibold transition-colors"
                  >
                    Create Itinerary
                  </button>
                ) : (
                  <div className="w-full sm:w-auto">
                    <PaymentButton
                      TUI={pricerTUI}
                      amount={netAmount}
                      name={contactInfo.FName}
                      email={contactInfo.Email}
                      contact={contactInfo.Mobile}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-40">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Create Itinerary</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Enter contact information and add travelers for your trip</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex flex-col sm:flex-row items-center ${isActive ? 'text-[#f48f22]' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 ${isActive ? 'border-[#f48f22] bg-[#f48f22] text-white' :
                      isCompleted ? 'border-green-600 bg-green-600 text-white' :
                        'border-gray-300 bg-white'
                      }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </div>
                    <span className="ml-2 font-medium text-xs sm:text-sm mt-1 sm:mt-0">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden sm:block w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 ${isCompleted ? 'bg-green-600' : 'bg-gray-300'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="py-4 sm:py-6">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default Createitenary;