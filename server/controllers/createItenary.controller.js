export const createItinerary = async (req, res) => {
    try {
        const gender = req.body.Travellers[0].Gender;
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
                    Title: "Mr",
                    FName: req.body.Travellers[0].FName,
                    LName: req.body.Travellers[0].LName,
                    Age: req.body.Travellers[0].Age, // Do not convert to Number
                    DOB: req.body.Travellers[0].DOB,
                    Gender: genderCode,
                    PTC: req.body.Travellers[0].PTC,
                    Nationality: req.body.Travellers[0].Nationality || "IN",
                    PassportNo: req.body.Travellers[0].PassportNo || "HM8888HJJ6K",
                    PLI: "Cochin",
                    PDOE: "2029-12-15",
                    VisaType: "Visiting Visa",
                    PaxID: "",
                    Operation: "0",
                }
            ],
            PLP: req.body.PLP,
            SSR: req.body.SSR,
            CrossSell: req.body.CrossSell,
            NetAmount: req.body.NetAmount,
            SSRAmount: req.body.SSRAmount || 0,
            ClientID: req.body.ClientID,
            DeviceID: "",
            AppVersion: "",
            CrossSellAmount: req.body.CrossSellAmount || 0
        }

        console.log(finalPayload, '================================= finalPayload');

        const response = await fetch(`https://b2bapiflights.benzyinfotech.com/Flights/CreateItinerary`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${req.headers.authorization?.split(" ")[1]}`
            },
            body: JSON.stringify(finalPayload)
        });

        const contentType = response.headers.get('content-type');
        const status = response.status;
        const raw = await response.text();
        console.log('Raw response from external API:', raw);
        if (!raw || !contentType || !contentType.includes('application/json')) {
            console.error('No JSON response or empty response from external API:', raw);
            return res.status(500).json({
                success: false,
                message: 'No JSON response or empty response from external API',
                status,
                raw
            });
        }
        let data;
        try {
            data = JSON.parse(raw);
        } catch (e) {
            console.error('Failed to parse JSON from external API:', e, raw);
            return res.status(500).json({
                success: false,
                message: 'Invalid JSON from external API',
                error: e.message,
                raw
            });
        }
        console.log(data, '================================= create itenary data');
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