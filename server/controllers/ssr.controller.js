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
                    Amount: req.body.Amount || 0, // Use the NetAmount from GetSPricer
                    Index: "",
                    OrderID: 1,
                    TUI: TUI
                }
            ]
        };

        console.log('SSR Request Payload:', payload);
        console.log('Making SSR request to:', `${process.env.FLIGHT_URL}/Flights/SSR`);
        console.log('FareType being used:', FareType, 'for TUI:', TUI);
        console.log('Request body received:', req.body);

        const response = await axios.post(`${process.env.FLIGHT_URL}/Flights/SSR`, payload, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        const data = response.data;
        console.log('SSR Response:', data);
        console.log('SSR Response structure check:');
        console.log('- Code:', data.Code);
        console.log('- PaidSSR:', data.PaidSSR);
        console.log('- Trips exists:', !!data.Trips);
        console.log('- Trips length:', data.Trips?.length);
        if (data.Trips && data.Trips.length > 0) {
            console.log('- First trip Journey length:', data.Trips[0].Journey?.length);
            if (data.Trips[0].Journey && data.Trips[0].Journey.length > 0) {
                console.log('- First journey Segments length:', data.Trips[0].Journey[0].Segments?.length);
                if (data.Trips[0].Journey[0].Segments && data.Trips[0].Journey[0].Segments.length > 0) {
                    console.log('- First segment SSR length:', data.Trips[0].Journey[0].Segments[0].SSR?.length);
                }
            }
        }

        if (data.Code === "200") {
            // Extract SSR services from the response
            const ssrServices = [];
            
            console.log('Processing SSR response structure:');
            console.log('Trips length:', data.Trips?.length);
            
            if (data.Trips && data.Trips.length > 0) {
                data.Trips.forEach((trip, tripIndex) => {
                    console.log(`Trip ${tripIndex}:`, {
                        From: trip.From,
                        To: trip.To,
                        JourneyLength: trip.Journey?.length
                    });
                    
                    if (trip.Journey && trip.Journey.length > 0) {
                        trip.Journey.forEach((journey, journeyIndex) => {
                            console.log(`Journey ${journeyIndex}:`, {
                                Provider: journey.Provider,
                                SegmentsLength: journey.Segments?.length
                            });
                            
                            if (journey.Segments && journey.Segments.length > 0) {
                                journey.Segments.forEach((segment, segmentIndex) => {
                                    console.log(`Segment ${segmentIndex}:`, {
                                        VAC: segment.VAC,
                                        SSRLength: segment.SSR?.length,
                                        SSR: segment.SSR
                                    });
                                    
                                    if (segment.SSR && segment.SSR.length > 0) {
                                        console.log(`Found ${segment.SSR.length} SSR services in segment ${segmentIndex}`);
                                        ssrServices.push(...segment.SSR);
                                    }
                                });
                            }
                        });
                    }
                });
            }
            
            console.log('Total SSR services found:', ssrServices.length);

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
            const amount = service.SSRNetAmount || service.Charge || 0;
            console.log(`SSR Service ${service.Code}: Charge=${service.Charge}, SSRNetAmount=${service.SSRNetAmount}, Using=${amount}`);
            return total + amount;
        }, 0);
        
        console.log('Total SSR Amount calculated:', totalSSRAmount);

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