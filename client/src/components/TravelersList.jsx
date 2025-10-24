import React, { useState } from 'react';
import { Plus, Edit, Trash2, User } from 'lucide-react';
import TravelerDetailsModal from './modals/TravelerDetailsModal';

const TravelersList = ({ travelers, onTravelersChange, searchPayload, requiredTravelers }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTraveler, setSelectedTraveler] = useState(null);

  const handleAddTraveler = (newTraveler) => {
    const travelerWithId = {
      ...newTraveler,
      ID: travelers.length + 1
    };
    onTravelersChange([...travelers, travelerWithId]);
  };

  const handleEditTraveler = (updatedTraveler) => {
    const updatedTravelers = travelers.map(traveler => 
      traveler.ID === updatedTraveler.ID ? updatedTraveler : traveler
    );
    onTravelersChange(updatedTravelers);
  };

  const handleDeleteTraveler = (travelerId) => {
    if (window.confirm('Are you sure you want to delete this traveler?')) {
      const updatedTravelers = travelers.filter(traveler => traveler.ID !== travelerId);
      onTravelersChange(updatedTravelers);
    }
  };

  const openEditModal = (traveler) => {
    setSelectedTraveler(traveler);
    setShowEditModal(true);
  };

  const validateTravelers = () => {
    if (!requiredTravelers) return true;
    
    const { adults, children, infants } = requiredTravelers;
    const totalRequired = adults + children + infants;
    
    if (travelers.length < totalRequired) {
      alert(`Please add ${totalRequired} travelers. Required: ${adults} adults, ${children} children, ${infants} infants`);
      return false;
    }
    
    const incompleteTravelers = travelers.filter(t => !t.FName || !t.LName || !t.DOB || !t.Gender || !t.Nationality);
    if (incompleteTravelers.length > 0) {
      alert('Please complete all traveler details. Click "Edit" on each traveler to fill in missing information.');
      return false;
    }
    
    return true;
  };


  const getGenderDisplay = (gender) => {
    switch (gender) {
      case 'M': return 'Male';
      case 'F': return 'Female';
      case 'O': return 'Other';
      default: return gender;
    }
  };

  const getPtcDisplay = (ptc) => {
    switch (ptc) {
      case 'ADT': return 'Adult';
      case 'CHD': return 'Child';
      case 'INF': return 'Infant';
      default: return ptc;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Travelers</h2>
            {travelers.length > 0 && travelers.some(t => !t.FName || !t.LName) && (
              <p className="text-sm text-gray-600 mt-1">
                Click "Add Traveler" to add travelers.
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#f48f22] hover:bg-[#16437c] text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Traveler
            </button>
          </div>
        </div>

        {travelers.length === 0 ? (
          <div className="text-center py-8">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No travelers added yet</h3>
            <p className="text-gray-500 mb-4">Click "Add Traveler" to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {travelers.map((traveler, index) => (
              <div
                key={traveler.ID}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-[#f48f22] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {traveler.Title} {traveler.FName} {traveler.LName}
                        {(!traveler.FName || !traveler.LName) && (
                          <span className="text-sm text-orange-600 ml-2">(Click Edit to fill details)</span>
                        )}
                      </h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {getPtcDisplay(traveler.PTC)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Age:</span> {traveler.Age} years
                      </div>
                      <div>
                        <span className="font-medium">Gender:</span> {getGenderDisplay(traveler.Gender)}
                      </div>
                      <div>
                        <span className="font-medium">Nationality:</span> {traveler.Nationality}
                      </div>
                      <div>
                        <span className="font-medium">DOB:</span> {traveler.DOB}
                      </div>
                      {traveler.PassportNo && (
                        <div>
                          <span className="font-medium">Passport:</span> {traveler.PassportNo}
                        </div>
                      )}
                      {traveler.PLI && (
                        <div>
                          <span className="font-medium">Issuing Location:</span> {traveler.PLI}
                        </div>
                      )}
                      {traveler.PDOE && (
                        <div>
                          <span className="font-medium">Expiry:</span> {traveler.PDOE}
                        </div>
                      )}
                      {traveler.VisaType && (
                        <div>
                          <span className="font-medium">Visa:</span> {traveler.VisaType}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => openEditModal(traveler)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Edit traveler"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTraveler(traveler.ID)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete traveler"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {travelers.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Traveler Summary</h4>
            <div className="flex gap-4 text-sm text-gray-600">
              <span>Total Travelers: {travelers.length}</span>
              <span>Adults: {travelers.filter(t => t.PTC === 'ADT').length}</span>
              <span>Children: {travelers.filter(t => t.PTC === 'CHD').length}</span>
              <span>Infants: {travelers.filter(t => t.PTC === 'INF').length}</span>
            </div>
            {requiredTravelers && (
              <div className="mt-2 text-sm">
                {(() => {
                  const { adults, children, infants } = requiredTravelers;
                  const totalRequired = adults + children + infants;
                  const isComplete = travelers.length >= totalRequired && 
                    travelers.every(t => t.FName && t.LName && t.DOB && t.Gender && t.Nationality);
                  
                  return (
                    <div className={`flex items-center gap-2 ${isComplete ? 'text-green-600' : 'text-orange-600'}`}>
                      <span className={`w-2 h-2 rounded-full ${isComplete ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                      {isComplete ? 'All required travelers added with complete details' : 'Please add all required travelers with complete details'}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Traveler Modal */}
      <TravelerDetailsModal
        isOpen={showAddModal}
        setIsOpen={setShowAddModal}
        onSave={handleAddTraveler}
        isEdit={false}
      />

      {/* Edit Traveler Modal */}
      <TravelerDetailsModal
        isOpen={showEditModal}
        setIsOpen={setShowEditModal}
        onSave={handleEditTraveler}
        traveler={selectedTraveler}
        isEdit={true}
      />
    </div>
  );
};

export default TravelersList;
export { TravelersList }; 