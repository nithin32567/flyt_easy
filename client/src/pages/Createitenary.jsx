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
  const netAmount = pricerData.NetAmount;
  const [itenarySuccess, setItenarySuccess] = useState(false);
  const navigate = useNavigate();

  // proper date validation with current date should be added 

  // Sample data for testing
  const sampleContactInfo = {
    Title: "Mr",
    FName: "John",
    LName: "Doe",
    Mobile: "9876543210",
    Phone: "0484123456",
    Email: "john.doe@example.com",
    Address: "123, MG Road",
    CountryCode: "IN",
    State: "Kerala",
    City: "Kochi",
    PIN: "682001",
    GSTCompanyName: "Doe Enterprises",
    GSTTIN: "32ABCDE1234F1Z5",
    GSTMobile: "9876543210",
    GSTEmail: "gst@example.com",
    UpdateProfile: false,
    IsGuest: false
  };

  const sampleTraveler = {
    ID: 1,
    Title: "Mr",
    FName: "Alex",
    LName: "Mason",
    Age: 30,
    DOB: "1994-01-15",
    Gender: "M",
    PTC: "ADT",
    Nationality: "IN",
    PassportNo: "M1234567",
    PLI: "Kochi",
    PDOE: "2027-12-15",
    VisaType: "Tourist Visa"
  };

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

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/flights/create-itinerary`, payload, { headers });
        console.log(response.data, '================================= response');
        localStorage.setItem("TransactionID", response.data.data.TransactionID);
        setItenarySuccess(true);

      } catch (error) {
        console.log(error, '================================= error');
      }
    } else {
      // Show validation errors
      console.log('Validation Errors:', validation.errors);
      alert('Please fix the validation errors before submitting.');
    }
  };

  const loadSampleData = () => {
    setContactInfo(sampleContactInfo);
    setTravelers([sampleTraveler]);
    setCurrentStep(2);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <ContactInfoForm
              contactData={contactInfo}
              onSave={handleContactInfoSave}
            />
            <div className="max-w-4xl mx-auto p-6">
              <div className="text-center">
                <button
                  onClick={loadSampleData}
                  className="text-[#f48f22] hover:text-[#16437c] text-sm underline"
                >
                  Load Sample Data
                </button>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <TravelersList
              travelers={travelers}
              onTravelersChange={handleTravelersChange}
            />
            <div className="max-w-6xl mx-auto p-6">
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-6 rounded-md font-semibold transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNextToReview}
                  disabled={travelers.length === 0}
                  className="bg-[#f48f22] hover:bg-[#16437c] text-white py-2 px-6 rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="max-w-6xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Review Itinerary</h2>

              {/* Validation Errors Display */}
              {(() => {
                const hasGeneralError = validationErrors.general;
                const hasContactErrors = validationErrors.contactInfo && Object.keys(validationErrors.contactInfo).length > 0;
                const hasTravelerErrors = validationErrors.travelers && validationErrors.travelers.some(travelerErrors =>
                  Object.keys(travelerErrors).length > 0
                );

                const hasAnyErrors = hasGeneralError || hasContactErrors || hasTravelerErrors;

                return hasAnyErrors ? (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Please fix the following errors:</h3>
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
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Contact Information</h3>
                {contactInfo && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {contactInfo.Title} {contactInfo.FName} {contactInfo.LName}
                    </div>
                    <div>
                      <span className="font-medium">Mobile:</span> {contactInfo.Mobile}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {contactInfo.Email}
                    </div>
                    <div>
                      <span className="font-medium">Address:</span> {contactInfo.Address}
                    </div>
                    <div>
                      <span className="font-medium">City:</span> {contactInfo.City}, {contactInfo.State}
                    </div>
                    <div>
                      <span className="font-medium">PIN:</span> {contactInfo.PIN}
                    </div>
                  </div>
                )}
              </div>

              {/* Travelers Review */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Travelers ({travelers.length})</h3>
                <div className="space-y-3">
                  {travelers.map((traveler, index) => (
                    <div key={traveler.ID} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-[#f48f22] text-white rounded-full flex items-center justify-center text-xs font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <span className="font-medium">{traveler.Title} {traveler.FName} {traveler.LName}</span>
                          <span className="text-gray-500 ml-2">({traveler.PTC})</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-6 rounded-md font-semibold transition-colors"
                >
                  Back
                </button>
                {!itenarySuccess ? (
                  <button
                    onClick={handleSubmit}
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md font-semibold transition-colors"
                  >
                    Create Itinerary
                  </button>
                ) : (
                  <PaymentButton
                    TUI={pricerTUI}
                    amount={netAmount}
                    name={contactInfo.FName}
                    email={contactInfo.Email}
                    contact={contactInfo.Mobile}
                  />
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-3xl font-bold text-gray-800">Create Itinerary</h1>
          <p className="text-gray-600 mt-2">Enter contact information and add travelers for your trip</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center ${isActive ? 'text-[#f48f22]' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${isActive ? 'border-[#f48f22] bg-[#f48f22] text-white' :
                      isCompleted ? 'border-green-600 bg-green-600 text-white' :
                        'border-gray-300 bg-white'
                      }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className="ml-2 font-medium">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${isCompleted ? 'bg-green-600' : 'bg-gray-300'
                      }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="py-6">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default Createitenary;