import axios from 'axios';

export const getSSRServices = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    
    try {
        const { TUI, PaidSSR = true, ClientID = "bitest", Source = "SF", FareType } = req.body;

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
                    Amount: 0, // This will be filled by the API
                    Index: "",
                    OrderID: 1,
                    TUI: TUI
                }
            ]
        };

        console.log('SSR Request Payload:', payload);
        console.log('Making SSR request to:', `${process.env.FLIGHT_URL}/Flights/SSR`);
        console.log('FareType being used:', FareType, 'for TUI:', TUI);

        const response = await axios.post(`${process.env.FLIGHT_URL}/Flights/SSR`, payload, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        const data = response.data;
        console.log('SSR Response:', data);

        if (data.Code === "200") {
            // Extract SSR services from the response
            const ssrServices = [];
            
            if (data.Trips && data.Trips.length > 0) {
                data.Trips.forEach(trip => {
                    if (trip.Journey && trip.Journey.length > 0) {
                        trip.Journey.forEach(journey => {
                            if (journey.Segments && journey.Segments.length > 0) {
                                journey.Segments.forEach(segment => {
                                    if (segment.SSR && segment.SSR.length > 0) {
                                        ssrServices.push(...segment.SSR);
                                    }
                                });
                            }
                        });
                    }
                });
            }

            // Filter out free services (Charge: 0) - only return paid services
            const paidServices = ssrServices.filter(service => service.Charge > 0);
            
            // Deduplicate services by Code and Description
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
        console.error("SSR Services Error:", error?.response?.data || error.message);
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

        // Validate selected services
        if (!Array.isArray(selectedServices)) {
            return res.status(400).json({
                success: false,
                message: "Selected services must be an array"
            });
        }

        // Calculate total SSR amount
        const totalSSRAmount = selectedServices.reduce((total, service) => {
            return total + (service.Charge || 0);
        }, 0);

        // Validate service compatibility
        const validationErrors = [];
        
        selectedServices.forEach(service => {
            // Check if service is valid
            if (!service.ID || !service.Code) {
                validationErrors.push(`Invalid service: ${service.Description || 'Unknown'}`);
            }
            
            // Check for duplicate services
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
        console.error("SSR Validation Error:", error?.response?.data || error.message);
        return res.status(500).json({
            success: false,
            message: error?.response?.data || error.message || "Failed to validate SSR selection"
        });
    }
}; 