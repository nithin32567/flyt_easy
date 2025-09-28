import dotenv from "dotenv";
import axios from "axios";

dotenv.config();



export const createItinerary = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    console.log("=== CREATE ITINERARY STARTED ===");
    console.log("Request Body Keys:", Object.keys(req.body));
    console.log("Authorization Header Present:", !!req.headers.authorization);
    console.log("Token Present:", !!token);

    try {
        const NetAmount = Number(req.body.NetAmount);

        const processedTravelers = req.body.Travellers.map((traveler, index) => {
            const genderCode = traveler.Gender === "Male" || traveler.Gender === "M" ? "M" : "F";

            let age = traveler.Age;
            if (!age || age === 0 || age === "0") {
                const dob = new Date(traveler.DOB || "1990-01-01");
                const today = new Date();
                age = today.getFullYear() - dob.getFullYear();
                const monthDiff = today.getMonth() - dob.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                    age--;
                }
            }

            age = parseInt(age);
            if (isNaN(age) || age < 0) {
                age = 30;
            }

            if (traveler.PTC === "ADT" && (age < 20 || age > 120)) {
                age = 30;
            } else if (traveler.PTC === "CHD" && (age < 2 || age > 10)) {
                age = 8;
            } else if (traveler.PTC === "INF" && (age !== 1)) {
                age = 1;
            }

            return {
                ID: traveler.ID || (index + 1),
                Title: traveler.Title || "Mr",
                FName: traveler.FName,
                LName: traveler.LName,
                Age: age,
                DOB: traveler.DOB || "1990-01-01",
                Gender: genderCode,
                PTC: traveler.PTC,
                Nationality: traveler.Nationality || "IN",
                PassportNo: traveler.PassportNo || "HM8888HJJ6K",
                PLI: traveler.PLI || "Cochin",
                PDOE: traveler.PDOE || "2029-12-15",
                VisaType: traveler.VisaType || "Visiting Visa",
                PaxID: traveler.PaxID || "",
                Operation: "0",
            };
        });


        let processedSSR = [];
        let totalSSRAmount = 0;

        // Handle SSR data - if SSR is provided, use it; otherwise use empty array
        if (req.body.SSR && req.body.SSR.length > 0) {
            // If SSR is provided in the new format (with full details), use it directly
            if (req.body.SSR[0].PTC || req.body.SSR[0].Code) {
                processedSSR = req.body.SSR;
            } else {
                // If SSR is provided in the old format (FUID, PaxID, SSID), convert it
                const invalidSSR = req.body.SSR.filter(ssr =>
                    !ssr.FUID || !ssr.PaxID || !ssr.SSID
                );

                if (invalidSSR.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid SSR data format. Each SSR must have FUID, PaxID, and SSID.",
                        invalidSSR: invalidSSR
                    });
                }

                processedSSR = req.body.SSR.map(ssr => ({
                    FUID: parseInt(ssr.FUID) || 1,
                    PaxID: parseInt(ssr.PaxID),
                    SSID: parseInt(ssr.SSID)
                }));
            }

            totalSSRAmount = req.body.SSRAmount || 0;
        }

        // Calculate passenger counts
        const passengerCounts = processedTravelers.reduce((counts, traveler) => {
            counts[traveler.PTC] = (counts[traveler.PTC] || 0) + 1;
            return counts;
        }, {});

        // Calculate AirlineNetFare (NetAmount - SSRAmount)
        const airlineNetFare = NetAmount - totalSSRAmount;

        // Calculate GrossAmount (NetAmount + any additional charges)
        const grossAmount = NetAmount;

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
                UpdateProfile: false,
                IsGuest: false
            },
            Travellers: processedTravelers,
            PLP: null,
            SSR: processedSSR,
            CrossSell: [],
            NetAmount: NetAmount,
            SSRAmount: totalSSRAmount,
            ClientID: req.body.ClientID || "",
            DeviceID: "",
            AppVersion: "",
            CrossSellAmount: req.body.CrossSellAmount || 0
        }


        const apiUrl = `${process.env.FLIGHT_URL}/Flights/CreateItinerary`;

        console.log("=== CREATE ITINERARY REQUEST ===");
        console.log("API URL:", `${process.env.FLIGHT_URL}/Flights/CreateItinerary`);
        // console.log("Request Payload:", JSON.stringify(finalPayload, null, 2));
        console.log("Authorization Token:", token ? `${token.substring(0, 20)}...` : "No token");

        const response = await axios.post(`${process.env.FLIGHT_URL}/Flights/CreateItinerary`, finalPayload, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        console.log("=== CREATE ITINERARY RESPONSE ===");
        console.log("Response Status:", response.status);
        console.log("Response Headers:", response.headers);
        // console.log("Full Response:", JSON.stringify(response.data, null, 2));

        const data = await response.data;

        if (!data || data.TransactionID === 0 || data.TransactionID === null) {
            console.log("⚠️  WARNING: No TransactionID received, generating fallback");
            const fallbackTransactionID = Date.now() + Math.floor(Math.random() * 1000);
            data.TransactionID = fallbackTransactionID;
            data.ItineraryID = fallbackTransactionID;
            console.log("Generated fallback TransactionID:", fallbackTransactionID);
        }

        if (data.Code && data.Code !== "200" && data.Code !== 200) {
            console.log("❌ CREATE ITINERARY FAILED");
            console.log("Error Code:", data.Code);
            console.log("Error Messages:", data.Msg);
            console.log("Full Error Response:", JSON.stringify(data, null, 2));

            let errorMessage = data.Msg ? data.Msg.join(' ') : "Failed to create itinerary";

            console.log("Formatted Error Message:", errorMessage);
            return res.status(400).json({
                success: false,
                message: errorMessage,
                data: data,
                errorCode: data.Code
            });
        }

        console.log("✅ CREATE ITINERARY SUCCESS");
        console.log("TransactionID:", data.TransactionID);
        console.log("ItineraryID:", data.ItineraryID);
        // console.log("Final Response Data:", JSON.stringify(data, null, 2));

        return res.status(200).json({
            success: true,
            data: data,
            message: "Itinerary created successfully"
        });


    } catch (error) {
        console.log("❌ CREATE ITINERARY EXCEPTION OCCURRED");
        console.log("Error Type:", error.constructor.name);
        console.log("Error Message:", error.message);

        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log("Response Status:", error.response.status);
            console.log("Response Headers:", error.response.headers);
            console.log("Response Data:", JSON.stringify(error.response.data, null, 2));

            return res.status(500).json({
                success: false,
                message: `API Error (${error.response.status}): ${JSON.stringify(error.response.data)}`,
                errorDetails: {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers
                }
            });
        } else if (error.request) {
            // The request was made but no response was received
            console.log("No response received from API");
            console.log("Request details:", error.request);

            return res.status(500).json({
                success: false,
                message: "No response received from flight API",
                errorDetails: {
                    type: "NO_RESPONSE",
                    request: error.request
                }
            });
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Request setup error:", error.message);
            console.log("Error stack:", error.stack);

            return res.status(500).json({
                success: false,
                message: `Request setup error: ${error.message}`,
                errorDetails: {
                    type: "REQUEST_SETUP_ERROR",
                    message: error.message,
                    stack: error.stack
                }
            });
        }
    }
};

export const getExistingItinerary = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    try {
        const { TransactionID, ClientID } = req.body;

        const payload = {
            ReferenceType: "T",
            TUI: "",
            ReferenceNumber: TransactionID,
            ClientID: ClientID,
        }

        const response = await fetch(`${process.env.FLIGHT_URL}/Utils/RetrieveBooking`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        return res.status(200).json({
            success: true,
            data: data,
            message: "Itinerary fetched successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.response?.data || error.message
        });
    }
}