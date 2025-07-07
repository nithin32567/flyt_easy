import axios from "axios";

export const getHotelsSignature = async (req, res) => {
    try {
        const payload = {
            MerchantID: "300",
            ApiKey: "kXAY9yHARK",
            ClientID: "bitest",
            Password: "staging@1",
            AgentCode: "",
            BrowserKey: "caecd3cd30225512c1811070dce615c1",
            Key: "ef20-925c-4489-bfeb-236c8b406f7e"
        }
        console.log(payload, 'payload in signature controller');

        try {
            const response = await fetch(`${process.env.HOTEL_SIGNATURE_API}/Utils/Signature`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            return res.status(200).json({
                success: true,
                message: "Signature generated successfully",
                data: data,
            });

        } catch (error) {
            console.log(error, 'error in signature controller');
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    } catch (error) {
        console.log(error, 'error in signature controller');
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}