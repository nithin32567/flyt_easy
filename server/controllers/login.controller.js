

export const googleLogin = async (req, res) => {
    try {

        passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next)
        res.status(200).json({
            success: true,
            message: "Google login successful",
            user: req.user
        })

        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        })
    }
}


export const googleCallback = async (req, res) => {
    try {
        passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next)

        res.status(200).json({
            success: true,
            message: "Google login successful",
            user: req.user
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        })
    }
}