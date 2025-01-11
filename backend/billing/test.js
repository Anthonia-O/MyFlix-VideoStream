const stripe = require("stripe")(STRIPE_SECRET_KEY); // Replace with your Stripe Secret Key

const createPaymentMethod = async () => {
    try {
        const paymentMethod = await stripe.paymentMethods.create({
            type: "card",
            card: {
                number: "4242424242424242", // Test card number
                exp_month: 12,
                exp_year: 2025,
                cvc: "123",
            },
        });

        console.log("Payment Method Created:", paymentMethod);
    } catch (error) {
        console.error("Error creating payment method:", error);
    }
};

createPaymentMethod();
