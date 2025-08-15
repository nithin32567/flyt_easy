import dotenv from "dotenv";

dotenv.config();

export const retrieveBooking = async (req, res) => {
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

        console.log(payload, '================================= payload retrieveBooking');
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
            return res.status(response.status).json({
                success: false,
                message: errorData?.Message || "Failed to retrieve booking",
                error: errorData
            });
        }

        const data = await response.json();
        console.log(data, '================================= data retrieveBooking');
        
        // Check if the response contains the expected booking data
        if (data.Code === "200" && data.TransactionID) {
            return res.status(200).json({
                success: true,
                message: "Booking retrieved successfully",
                data: data
            });
        } else {
            return res.status(400).json({
                success: false,
                message: data.Msg?.[0] || "Failed to retrieve booking - incomplete response",
                data: data
            });
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