import Razorpay from "razorpay";
import crypto from 'crypto';
export const bookFlight = async (req, res) => {
    const { amount, currency, receipt, notes } = req.body;
    console.log('Booking request:', { amount, currency, receipt, notes });
    
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const order = await razorpay.orders.create({
            amount: amount * 100, // Convert to paise
            currency: currency || 'INR',
            receipt: receipt || `flight_${Date.now()}`,
            notes: notes || {}
        });

        // console.log('Razorpay order created:', order.id);
        
        res.status(200).json({ 
            success: true,
            order,
            message: 'Order created successfully'
        });
    } catch (error) {
        console.error('Razorpay order creation error:', error);
        res.status(500).json({ 
            success: false,
            message: error.message || 'Failed to create payment order'
        });
    }
};

// Handle payment verification
export const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    try {
        // Verify payment signature

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Payment is verified
            console.log('Payment verified successfully');
            
            // Here you can save booking details to database
            // For now, we'll just return success
            
            res.status(200).json({
                success: true,
                message: 'Payment verified successfully',
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid payment signature'
            });
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Payment verification failed'
        });
    }
};