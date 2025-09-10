import dotenv from "dotenv";

dotenv.config();

export const testGetItineraryStatus = async (req, res) => {
    try {
        const { TUI, TransactionID } = req.body;
        
        console.log('Test GetItineraryStatus called with:', { TUI, TransactionID });
        
        // Return a test response
        return res.status(200).json({
            success: true,
            data: {
                TUI: TUI,
                TransactionID: TransactionID,
                CurrentStatus: "Success",
                PaymentStatus: "Success",
                Code: "200",
                Msg: ["Success"]
            },
            message: "Test GetItineraryStatus response",
            status: "SUCCESS",
            shouldPoll: false
        });
    } catch (error) {
        console.error('Test GetItineraryStatus Error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const testRetrieveBooking = async (req, res) => {
    try {
        const { ReferenceType, TUI, ReferenceNumber, ClientID } = req.body;
        
        console.log('Test RetrieveBooking called with:', { ReferenceType, TUI, ReferenceNumber, ClientID });
        
        // Return a test response
        return res.status(200).json({
            success: true,
            message: "Test RetrieveBooking response",
            data: {
                TUI: TUI,
                TransactionID: ReferenceNumber,
                NetAmount: 39590.00,
                GrossAmount: 41220.0,
                From: "DEL",
                To: "BLR",
                FromName: "Indira Gandhi International |New Delhi",
                ToName: "Bengaluru International Airport |Bangalore",
                OnwardDate: "2025-05-14",
                PaymentStatus: "I8",
                Status: "TO0",
                PGDescription: "Payment Success",
                CustomerFare: 41220.0,
                Pax: [
                    {
                        ID: 20014,
                        PaxID: 1,
                        Title: "MR",
                        FName: "SADIK",
                        LName: "DEMO",
                        Age: "29",
                        DOB: "06/16/1995",
                        Gender: "F",
                        PTC: "ADT",
                        Nationality: "IN",
                        PassportNo: "RWEWEQ"
                    }
                ],
                ContactInfo: [
                    {
                        Title: "MR",
                        FName: "Benzy",
                        LName: "Infotech",
                        Mobile: "9999999999",
                        Email: "test@example.com",
                        Address: "Test Address",
                        City: "Test City",
                        State: "Test State",
                        PIN: "123456",
                        CountryCode: "IN"
                    }
                ],
                Code: "200",
                Msg: ["Success"]
            }
        });
    } catch (error) {
        console.error('Test RetrieveBooking Error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
