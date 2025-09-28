// Dummy traveler data for testing and development
// Dummy traveler data for testing and development
export const dummyTravelerData = {
  // Adult travelers (age >= 18)
  adults: [
    {
      Title: 'Mr',
      FName: 'John',
      LName: 'Smith',
      PTC: 'ADT',
      Age: 25,
      Gender: 'M',
      Nationality: 'IN',
      DOB: '2000-05-15',
      PassportNo: 'M1234567',
      PLI: 'Mumbai',
      PDOE: '2030-05-15',
      VisaType: 'Tourist'
    },
    {
      Title: 'Mrs',
      FName: 'Sarah',
      LName: 'Johnson',
      PTC: 'ADT',
      Age: 28,
      Gender: 'F',
      Nationality: 'IN',
      DOB: '1997-08-22',
      PassportNo: 'F2345678',
      PLI: 'Delhi',
      PDOE: '2031-08-22',
      VisaType: 'Tourist' 
    },
    {
      Title: 'Mr',
      FName: 'Michael',
      LName: 'Brown',
      PTC: 'ADT',
      Age: 35,
      Gender: 'M',
      Nationality: 'IN',
      DOB: '1990-12-10',
      PassportNo: 'M3456789',
      PLI: 'Bangalore',
      PDOE: '2032-12-10',
      VisaType: 'Business'
    },
    {
      Title: 'Mrs',
      FName: 'Emily',
      LName: 'Davis',
      PTC: 'ADT',
      Age: 30,
      Gender: 'F',
      Nationality: 'IN',
      DOB: '1995-03-18',
      PassportNo: 'F4567890',
      PLI: 'Chennai',
      PDOE: '2033-03-18',
      VisaType: 'Tourist'
    }
  ],

  // Child travelers (age 2–9)
  children: [
    {
      Title: 'Mr',
      FName: 'Alex',
      LName: 'Smith',
      PTC: 'CHD',
      Age: 8,
      Gender: 'M',
      Nationality: 'IN',
      DOB: '2017-09-14',
      PassportNo: 'C1234567',
      PLI: 'Mumbai',
      PDOE: '2026-09-14',
      VisaType: 'Tourist'
    },
    {
      Title: 'Mrs',
      FName: 'Emma',
      LName: 'Johnson',
      PTC: 'CHD',
      Age: 6,
      Gender: 'F',
      Nationality: 'IN',
      DOB: '2019-09-14',
      PassportNo: 'C2345678',
      PLI: 'Delhi',
      PDOE: '2027-09-14',
      VisaType: 'Tourist'
    },
    {
      Title: 'Mr',
      FName: 'Liam',
      LName: 'Brown',
      PTC: 'CHD',
      Age: 4,
      Gender: 'M',
      Nationality: 'IN',
      DOB: '2021-09-14',
      PassportNo: 'C3456789',
      PLI: 'Bangalore',
      PDOE: '2028-09-14',
      VisaType: 'Tourist'
    }
  ],  

  // Infant travelers (exactly 1 year old)
  infants: [
    {
      Title: 'Mr',
      FName: 'Noah',
      LName: 'Smith',
      PTC: 'INF',
      Age: 1,
      Gender: 'M',
      Nationality: 'IN',
      DOB: '2024-09-14',
      PassportNo: 'I1234567',
      PLI: 'Mumbai',
      PDOE: '2029-09-14',
      VisaType: 'Tourist'
    },
    {
      Title: 'Mrs',
      FName: 'Sophia',
      LName: 'Johnson',
      PTC: 'INF',
      Age: 1,
      Gender: 'F',
      Nationality: 'IN',
      DOB: '2024-09-14',
      PassportNo: 'I2345678',
      PLI: 'Delhi',
      PDOE: '2029-09-14',
      VisaType: 'Tourist'
    }
  ]
};

// Function to generate dummy travelers based on search payload
export const generateDummyTravelers = (searchPayload) => {
  if (!searchPayload) return [];
  
  const generatedTravelers = [];
  let travelerId = 1;
  
  // Add adults
  for (let i = 0; i < searchPayload.ADT; i++) {
    const adultData = dummyTravelerData.adults[i % dummyTravelerData.adults.length];
    generatedTravelers.push({
      ID: travelerId++,
      ...adultData
    });
  }
  
  // Add children
  for (let i = 0; i < searchPayload.CHD; i++) {
    const childData = dummyTravelerData.children[i % dummyTravelerData.children.length];
    generatedTravelers.push({
      ID: travelerId++,
      ...childData
    });
  }
  
  // Add infants
  for (let i = 0; i < searchPayload.INF; i++) {
    const infantData = dummyTravelerData.infants[i % dummyTravelerData.infants.length];
    generatedTravelers.push({
      ID: travelerId++,
      ...infantData
    });
  }
  
  return generatedTravelers;
};

// Function to generate random dummy travelers (for testing without search payload)
export const generateRandomDummyTravelers = (adultCount = 1, childCount = 0, infantCount = 0) => {
  const generatedTravelers = [];
  let travelerId = 1;
  
  // Add adults
  for (let i = 0; i < adultCount; i++) {
    const adultData = dummyTravelerData.adults[i % dummyTravelerData.adults.length];
    generatedTravelers.push({
      ID: travelerId++,
      ...adultData
    });
  }
  
  // Add children
  for (let i = 0; i < childCount; i++) {
    const childData = dummyTravelerData.children[i % dummyTravelerData.children.length];
    generatedTravelers.push({
      ID: travelerId++,
      ...childData
    });
  }
  
  // Add infants
  for (let i = 0; i < infantCount; i++) {
    const infantData = dummyTravelerData.infants[i % dummyTravelerData.infants.length];
    generatedTravelers.push({
      ID: travelerId++,
      ...infantData
    });
  }
  
  return generatedTravelers;
};
