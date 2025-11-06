import dotenv from "dotenv";

dotenv.config();

export const retrieveBooking = async (req, res) => {
    console.log('=== BACKEND: FLIGHT RETRIEVE BOOKING REQUEST ===');
    console.log('Flight Retrieve Booking Payload ===>');
    console.log(JSON.stringify(req.body, null, 2));
    console.log('=== END FLIGHT RETRIEVE BOOKING PAYLOAD ===');
    
    const token = req.headers.authorization?.split(" ")[1];

    try {
        const { ReferenceType, TUI, ReferenceNumber, ClientID } = req.body;
        
        if (!ReferenceType || !TUI || !ReferenceNumber || !ClientID) {
            return res.status(400).json({
                success: false,
                message: "Missing required parameters"
            });
        }

        const payload = {
            ReferenceType,
            TUI,
            ReferenceNumber,
            ClientID
        };

        const response = await fetch(`${process.env.FLIGHT_URL}/Utils/RetrieveBooking`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorResponse = {
                success: false,
                message: errorData?.Message || "Failed to retrieve booking",
                error: errorData
            };
            console.log('=== BACKEND: FLIGHT RETRIEVE BOOKING ERROR RESPONSE TO CLIENT ===');
            console.log('Flight Retrieve Booking Error Response to Client JSON ===>');
            console.log(JSON.stringify(errorResponse, null, 2));
            console.log('=== END FLIGHT RETRIEVE BOOKING ERROR RESPONSE TO CLIENT ===');
            return res.status(response.status).json(errorResponse);
        }

        const data = await response.json();
        
        console.log('=== BACKEND: FLIGHT RETRIEVE BOOKING RESPONSE ===');
        console.log('Flight Retrieve Booking Response JSON ===>');
        console.log(JSON.stringify(data, null, 2));
        console.log('=== END FLIGHT RETRIEVE BOOKING RESPONSE ===');
        
        // Check if the response contains the expected booking data
        // Handle different response formats
        const responseCode = data.Code || data.code;
        const transactionId = data.TransactionID || data.transactionID;
        
        if (responseCode === "200" && transactionId) {
            const responseToSend = {
                success: true,
                message: "Booking retrieved successfully",
                data: data
            };
            console.log('=== BACKEND: FLIGHT RETRIEVE BOOKING RESPONSE TO CLIENT ===');
            console.log('Flight Retrieve Booking Response to Client JSON ===>');
            console.log(JSON.stringify(responseToSend, null, 2));
            console.log('=== END FLIGHT RETRIEVE BOOKING RESPONSE TO CLIENT ===');
            return res.status(200).json(responseToSend);
        } else {
            const responseToSend = {
                success: false,
                message: data.Msg?.[0] || data.msg?.[0] || "Failed to retrieve booking - incomplete response",
                data: data
            };
            console.log('=== BACKEND: FLIGHT RETRIEVE BOOKING ERROR RESPONSE TO CLIENT ===');
            console.log('Flight Retrieve Booking Error Response to Client JSON ===>');
            console.log(JSON.stringify(responseToSend, null, 2));
            console.log('=== END FLIGHT RETRIEVE BOOKING ERROR RESPONSE TO CLIENT ===');
            return res.status(400).json(responseToSend);
        }

    } catch (error) {
        console.error('Retrieve Booking Error:', error);
        
        
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}; 