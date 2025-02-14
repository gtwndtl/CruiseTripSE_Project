import { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { useOrder } from "../../../food_service/context/OrderContext";
import "./FoodCheckoutForm.css"
import { StripePaymentElementOptions } from "@stripe/stripe-js";


interface CheckoutFormProps {
  dpmCheckerLink: string;
  total: number;
  VAT: number;
}

export default function FoodCheckoutForm({ dpmCheckerLink, total, VAT }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  // const navigate = useNavigate();
  const [message, setMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const { filteredOrderDetails, formatPriceWithTwoDecimals } = useOrder();

  // console.log("filteredOrderDetails", filteredOrderDetails)


  const handleSubmit = async (e: { preventDefault: () => void; }) => {
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
        return_url: `http://localhost:5173${location.pathname}/complete`,
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
    localStorage.setItem("VATFood", VAT.toString())
  }, []);

  return (
    <>
      <form className="payment-form" id="payment-form" onSubmit={handleSubmit}>
        <div className="payment-form-order">
          {(filteredOrderDetails.length > 0)  ? (
            <>
              <div className="total-price">
                <p>Total Price (VAT & Promo Code)</p>
                <h1>฿ {formatPriceWithTwoDecimals(total)}</h1>
                <hr />
              </div>
              <div className="payment-form-order-detail-container">
                <table className="table-payment-form-order-detail">
                  <thead>
                    <tr>
                      <th style={{textAlign:"left"}}>Menu Name</th>
                      <th >Quantity</th>
                      <th >Unit Price</th>
                      <th >Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrderDetails.map((item) => {
                      return (
                        <tr key={item.ID}>
                          <td className="menu-name">{item.Menu?.MenuName}</td>
                          <td className="quantity">{formatPriceWithTwoDecimals(item.Quantity ?? 0)}</td>
                          <td className="unit-price">{formatPriceWithTwoDecimals((item.Amount ?? 0) / (item.Quantity ?? 0))}</td>
                          <td className="amount">{formatPriceWithTwoDecimals(item.Amount ?? 0)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="unavailable-order">
              <p>Your order is unavailable at the moment.</p>
            </div>
          ) }
          
        </div>
        <div className="payment-form-input">
          <PaymentElement id="payment-element" options={paymentElementOptions} />
          {filteredOrderDetails.length > 0 ? (
          <button disabled={isLoading || !stripe || !elements} id="submit">
            <span id="button-text">
              {isLoading ? <div className="spinner" id="spinner"></div> : "Confirm Payment"}
            </span>
          </button>
          ):(
            <button disabled={true} id="disable">
              Confirm Payment
            </button>
          )}
          {/* Show any error or success messages */}
          {message && <div id="payment-message" style={{color:"#df1b41"}}>{message}</div>}
        </div>
      </form>
      [DEV]: Display dynamic payment methods annotation and integration checker
      <div id="dpm-annotation">
        <p>
          Payment methods are dynamically displayed based on customer location, order amount, and currency.&nbsp;
          <a href={dpmCheckerLink} target="_blank" rel="noopener noreferrer" id="dpm-integration-checker">Preview payment methods by transaction</a>
        </p>
      </div>
    </>
  );
}