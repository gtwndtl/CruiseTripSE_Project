import { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
// import { useOrder } from "../../../food_service/context/OrderContext";
import "./TripCheckoutForm.css";
import { StripePaymentElementOptions } from "@stripe/stripe-js";

interface CheckoutFormProps {
  // total: number;
  VAT: number;
}

export default function TripCheckoutForm({ VAT }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  // const navigate = useNavigate();
  const [message, setMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  // const { filteredOrderDetails } = useOrder();

  // console.log("total", total);
  // console.log("VAT", VAT);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url:
          `http://localhost:5173${location.pathname}/complete`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
    // navigate("/login/food-service/order/order-summary/checkout/complete", {state: { VAT: VAT }});
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: "accordion",
  };

  useEffect(() => {
    localStorage.setItem("BookingCabinID", (1).toString())
    localStorage.setItem("BookingTripID", (1).toString())
    localStorage.setItem("VATTrip", VAT.toString())
  }, []);

  return (
    <>
      <form className="payment-form" id="payment-form" onSubmit={handleSubmit}>
        <div className="payment-form-input">
          <PaymentElement
            id="payment-element"
            options={paymentElementOptions}
          />
          <button disabled={isLoading || !stripe || !elements} id="submit">
            <span id="button-text">
              {isLoading ? <div className="spinner" id="spinner"></div> : "Confirm Payment"}
            </span>
          </button>
          {message && <div id="payment-message">{message}</div>}
        </div>
      </form>
    </>
  );
}
