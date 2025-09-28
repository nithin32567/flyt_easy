import axios from 'axios';

export const getSSRServices = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    
    try {
        const { TUI, PaidSSR = true, ClientID, Source = "SF", FareType } = req.body;

        if (!TUI) {
            return res.status(400).json({
                success: false,
                message: "TUI is required"
            });
        }

        if (!FareType) {
            return res.status(400).json({
                success: false,
                message: "FareType is required (ON for one-way, RT for round trip)"
            });
        }

        const payload = {
            PaidSSR: PaidSSR,
            ClientID: ClientID,
            Source: Source,
            FareType: FareType,
            Trips: [
                {
                    Amount: req.body.Amount || 0, // Use the NetAmount from GetSPricer
                    Index: "",
                    OrderID: 1,
                    TUI: TUI
                }
            ]
        };


        const response = await axios.post(`${process.env.FLIGHT_URL}/Flights/SSR`, payload, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        const data = response.data;
        console.log("[SSR] Payload:", JSON.stringify(payload, null, 2));
        console.log("[SSR] Response.data:", JSON.stringify(data, null, 2));

        if (data.Code === "200") {
            const ssrServices = [];
            
            
            if (data.Trips && data.Trips.length > 0) {
                data.Trips.forEach((trip, tripIndex) => {
                    
                    if (trip.Journey && trip.Journey.length > 0) {
                        trip.Journey.forEach((journey, journeyIndex) => {
                            
                            if (journey.Segments && journey.Segments.length > 0) {
                                journey.Segments.forEach((segment, segmentIndex) => {
                                    
                                    if (segment.SSR && segment.SSR.length > 0) {
                                        ssrServices.push(...segment.SSR);
                                    }
                                });
                            }
                        });
                    }
                });
            }
            

            const paidServices = ssrServices.filter(service => service.Charge > 0);
            
            const uniqueServices = paidServices.filter((service, index, self) => 
                index === self.findIndex(s => 
                    s.Code === service.Code && 
                    s.Description === service.Description &&
                    s.Charge === service.Charge
                )
            );

            return res.status(200).json({
                success: true,
                data: {
                    services: uniqueServices,
                    currencyCode: data.CurrencyCode,
                    paidSSR: data.PaidSSR,
                    trips: data.Trips,
                    hasPaidServices: uniqueServices.length > 0
                },
                message: uniqueServices.length > 0 ? "SSR services retrieved successfully" : "No paid SSR services available"
            });
        } else {
            return res.status(400).json({
                success: false,
                message: data.Msg?.[0] || "Failed to retrieve SSR services"
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.response?.data?.Msg?.[0] || error.message || "Failed to retrieve SSR services"
        });
    }
};

export const validateSSRSelection = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    
    try {
        const { TUI, selectedServices = [], travelers = [] } = req.body;

        if (!TUI) {
            return res.status(400).json({
                success: false,
                message: "TUI is required"
            });
        }

        if (!Array.isArray(selectedServices)) {
            return res.status(400).json({
                success: false,
                message: "Selected services must be an array"
            });
        }

        const totalSSRAmount = selectedServices.reduce((total, service) => {
            const amount = service.SSRNetAmount || service.Charge || 0;
            return total + amount;
        }, 0);
        

        const validationErrors = [];
        
        selectedServices.forEach(service => {
            if (!service.ID || !service.Code) {
                validationErrors.push(`Invalid service: ${service.Description || 'Unknown'}`);
            }
            
            const duplicates = selectedServices.filter(s => s.Code === service.Code);
            if (duplicates.length > 1) {
                validationErrors.push(`Duplicate service: ${service.Description}`);
            }
        });

        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "SSR validation failed",
                errors: validationErrors
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                totalSSRAmount,
                selectedServicesCount: selectedServices.length,
                validationPassed: true
            },
            message: "SSR selection validated successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.response?.data || error.message || "Failed to validate SSR selection"
        });
    }
}; 