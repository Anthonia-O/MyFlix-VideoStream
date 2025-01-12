
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement } from "@stripe/react-stripe-js";
import "../PaymentForm.css";


const stripePromise = loadStripe(`${import.meta.env.VITE_STRIPE_PUBLIC_KEY}`);


const PaymentForm = () => {
    return (
      <Elements stripe={stripePromise}>
        <form>
          <label htmlFor="card-element">Card Details:</label>
          <CardElement id="card-element" />
          <button type="submit">Pay Now</button>
        </form>
      </Elements>
    );
  };
  
  export default PaymentForm;