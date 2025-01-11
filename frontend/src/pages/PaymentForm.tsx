import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

interface PaymentFormProps {
  onPaymentMethodCreated: (paymentMethodId: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onPaymentMethodCreated }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      setError("Payment method creation failed. Please try again.");
    } else if (paymentMethod) {
      onPaymentMethodCreated(paymentMethod.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <CardElement className="card-element" />
      {error && <p className="error-message">{error}</p>}
      <button
        type="submit"
        className="form-button"
        disabled={!stripe}
      >
        Submit Payment
      </button>
    </form>
  );
};

export default PaymentForm;
