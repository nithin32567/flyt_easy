export const getHotelsSearch = async (req, res) => {
    const location=req.query.term;
    const token = req.headers.authorization;
    try {

        const response=await fetch(`${process.env.HOTEL_SEARCH_API}/Hotels/Search?term=${location}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.split(" ")[1]}`,
            },
        });
        const data = await response.json();
        console.log(data, "data in getHotelsSearch");
        return res.status(200).json({
            success: true,
            message: "Hotels search successful",
            data: data,
        });
    } catch (error) {
        console.log("error in getHotelsSearch", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}