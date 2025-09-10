import dotenv from "dotenv";
import axios from "axios";

dotenv.config();


export const createItinerary = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    console.log(token, '================================= token');

    try {
        const gender = req.body.Travellers[0].Gender;
        // Use the exact NetAmount value without parsing to avoid precision issues
        const NetAmount = Number(req.body.NetAmount);
        console.log(NetAmount, '================================= netAmount');
        console.log('Original NetAmount from request:', req.body.NetAmount, 'Type:', typeof req.body.NetAmount);
        console.log('Converted NetAmount:', NetAmount, 'Type:', typeof NetAmount);
        console.log('Full request body:', JSON.stringify(req.body, null, 2));
        const genderCode = gender === "Male" ? "M" : "F";
        // console.log(req.body, '================================= req.body');
        const finalPayload = {
            TUI: req.body.TUI,
            ContactInfo: {
                Title: req.body.ContactInfo.Title || "Mr",
                FName: req.body.ContactInfo.FName,
                LName: req.body.ContactInfo.LName,
                Mobile: req.body.ContactInfo.Mobile,
                Phone: req.body.ContactInfo.Phone || "8899776655",
                Email: req.body.ContactInfo.Email,
                Address: req.body.ContactInfo.Address,
                CountryCode: req.body.ContactInfo.CountryCode || "IN",
                MobileCountryCode: req.body.ContactInfo.MobileCountryCode || "+91",
                State: req.body.ContactInfo.State,
                City: req.body.ContactInfo.City,
                PIN: req.body.ContactInfo.PIN,
                GSTCompanyName: req.body.ContactInfo.GSTCompanyName || "",
                GSTTIN: req.body.ContactInfo.GSTTIN || "",
                GSTMobile: "",
                GSTEmail: "",
                MobileCountryCode: req.body.ContactInfo.MobileCountryCode || "+91",
                UpdateProfile: false,
                IsGuest: false
            },
            Travellers: [
                {
                    ID: 1,
                    Title: req.body.Travellers[0].Title || "Mr",
                    FName: req.body.Travellers[0].FName,
                    LName: req.body.Travellers[0].LName,
                    Age: req.body.Travellers[0].Age || 25,
                    DOB: req.body.Travellers[0].DOB || "2000-07-27",
                    Gender: genderCode,
                    PTC: req.body.Travellers[0].PTC,
                    Nationality: req.body.Travellers[0].Nationality || "IN",
                    PassportNo: req.body.Travellers[0].PassportNo || "HM8888HJJ6K",
                    PLI: "Cochin",
                    PDOE: req.body.Travellers[0].PDOE || "2029-12-15",
                    VisaType: req.body.Travellers[0].VisaType || "Visiting Visa",
                    PaxID: "",
                    Operation: "0",
                }
            ],

            PLP: req.body.PLP || [],
            SSR: req.body.SSR || [],
            CrossSell: req.body.CrossSell || [],
            NetAmount: NetAmount,
            SSRAmount: req.body.SSRAmount || 0,
            ClientID: req.body.ClientID || "",
            DeviceID: "",
            AppVersion: "",
            CrossSellAmount: req.body.CrossSellAmount || 0
        }

        console.log(finalPayload, '================================= finalPayload');
        // console.log(process.env.FLIGHT_URL, '================================= process.env.FLIGHT_URL');

        const apiUrl = `${process.env.FLIGHT_URL}/Flights/CreateItinerary`;
        // console.log('Making request to:', apiUrl);
        // console.log('Request headers:', {
        //     "Content-Type": "application/json",
        //     "Authorization": `Bearer ${token}`
        // });
        // console.log('Request body:', JSON.stringify(finalPayload, null, 2));

        console.log('Making API call to:', `${process.env.FLIGHT_URL}/Flights/CreateItinerary`);
        console.log('Request payload:', JSON.stringify(finalPayload, null, 2));
        console.log('SSR Details:', {
            SSRCount: finalPayload.SSR?.length || 0,
            SSRAmount: finalPayload.SSRAmount,
            SSRDetails: finalPayload.SSR?.map(ssr => ({
                FUID: ssr.FUID,
                PaxID: ssr.PaxID,
                SSID: ssr.SSID,
                // Legacy fields (if present)
                Code: ssr.Code,
                Description: ssr.Description,
                Charge: ssr.Charge,
                SSRNetAmount: ssr.SSRNetAmount
            }))
        });

        // Validate SSR data format
        if (finalPayload.SSR && finalPayload.SSR.length > 0) {
            console.log('Validating SSR data format...');
            const invalidSSR = finalPayload.SSR.filter(ssr => 
                !ssr.FUID || !ssr.PaxID || !ssr.SSID
            );
            
            if (invalidSSR.length > 0) {
                console.error('Invalid SSR data found:', invalidSSR);
                return res.status(400).json({
                    success: false,
                    message: "Invalid SSR data format. Each SSR must have FUID, PaxID, and SSID.",
                    invalidSSR: invalidSSR
                });
            }
        }
        
        const response = await axios.post(`${process.env.FLIGHT_URL}/Flights/CreateItinerary`, finalPayload, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });
        console.log(response, '================================= response');
        const data = await response.data;
        console.log(data, '================================= data');
        return res.status(200).json({
            success: true,
            data: data,
            message: "Itinerary created successfully"
        });


    } catch (error) {
        console.error("Create Itinerary Error:", error?.response?.data || error.message);
        return res.status(500).json({
            success: false,
            message: error?.response?.data || error.message
        });
    }
};

export const getExistingItinerary = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    // console.log(token, '================================= token');

    try {
        const { TransactionID, ClientID } = req.body;
        console.log(TransactionID, ClientID, '================================= TransactionID,ClientID');

        const payload = {
            ReferenceType: "T",
            TUI: "",
            ReferenceNumber: TransactionID,
            ClientID: ClientID,
        }

        console.log(payload, '================================= payload getExistingItinerary');
        const response = await fetch(`${process.env.FLIGHT_URL}/Utils/RetrieveBooking`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log(data, '================================= data');
        return res.status(200).json({
            success: true,
            data: data,
            message: "Itinerary fetched successfully"
        });
    } catch (error) {
        console.error("Get Existing Itinerary Error:", error?.response?.data || error.message);
        return res.status(500).json({
            success: false,
            message: error?.response?.data || error.message
        });
    }
}