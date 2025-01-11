import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import "../App.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

const SubscriptionPage: React.FC = () => {
  const { email } = useUserContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handlePaymentMethodCreated = async (paymentMethodId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Send subscription request to backend
      await axios.post(`${import.meta.env.VITE_API_URL}/billing/create-subscription`, {
        email,
        payment_method_id: paymentMethodId,
      });

      setSuccess("Subscription successful! Redirecting to HomePage...");
      setTimeout(() => navigate("/home"), 2000); // Redirect after 2 seconds
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Subscription failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Subscribe to MyFlix</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <div className="subscription-details">
        <h2>MyFlix Plan</h2>
        <p>Enjoy unlimited access to movies, series, and documentaries.</p>
        <p>
          <strong>Price:</strong> $0.99/month
        </p>
      </div>

      <Elements stripe={stripePromise}>
        <PaymentForm
          onPaymentMethodCreated={handlePaymentMethodCreated}
        />
      </Elements>

      {loading && <p className="loading-message">Processing your payment...</p>}
    </div>
  );
};

export default SubscriptionPage;
