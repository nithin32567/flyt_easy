import React from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

const TravelCheckListDisplay = ({ travelCheckListData }) => {
  if (!travelCheckListData) {
    return null;
  }

  const { TravellerCheckList, FnuLnuSettings, IsHRMSMandatory } = travelCheckListData;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Info className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-blue-800">Travel Requirements</h3>
      </div>
      
      {TravellerCheckList && TravellerCheckList.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Required Information:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(TravellerCheckList[0]).map(([field, required]) => (
              <div key={field} className="flex items-center gap-2">
                {required ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-gray-400" />
                )}
                <span className={required ? "text-green-700" : "text-gray-500"}>
                  {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  {required ? " (Required)" : " (Optional)"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {FnuLnuSettings && FnuLnuSettings.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Name Requirements:</h4>
          {FnuLnuSettings.map((setting, index) => (
            <div key={index} className="bg-white p-3 rounded border mb-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-sm">Airline: {setting.AirlineCode}</span>
                {setting.TitleMandatory && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Title Required</span>
                )}
              </div>
              {setting.Fnumessage && (
                <p className="text-sm text-gray-600 mb-1">
                  <strong>First Name:</strong> {setting.Fnumessage}
                </p>
              )}
              {setting.Lnumessage && (
                <p className="text-sm text-gray-600">
                  <strong>Last Name:</strong> {setting.Lnumessage}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {IsHRMSMandatory && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800 font-medium">
              HRMS (Hotel Reservation Management System) is mandatory for this booking.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelCheckListDisplay;
