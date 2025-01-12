import React, { useEffect } from "react";
import PaymentForm from "./PaymentForm";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

import "../Sub.css";

const SubscriptionPage: React.FC = () => {
  const { email } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      console.warn("Email not found in UserContext.");
    }
  }, [email]);

  if (!email) {
    return (
      <div className="form-container">
        <p>Register to proceed to the subscription page.</p>
      </div>
    );
  }

  // Function to handle navigation to the login page after payment
  const handlePaymentSuccess = () => {
    navigate("/login");
  };

  return (
    <div className="form-containerl">
      <h1 className="form-titlel">Subscribe to MyFlix</h1>

      <div className="subscription-details">
        <h2>MyFlix Plan</h2>
        <p>Enjoy unlimited access to movies, series, and documentaries.</p>
        <p>
          <strong>Price:</strong> $5/month
        </p>
        {/* Wrap PaymentForm with navigation handler */}
        <div
          onClick={() => handlePaymentSuccess()}
          style={{ cursor: "pointer" }}
        >
          <PaymentForm />
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
