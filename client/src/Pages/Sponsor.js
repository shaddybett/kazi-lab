import React, { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PayPopup from "./PayPopup";

const stripePromise = loadStripe(
  "pk_live_51PpWVz2LNaBLa9OHujPAFFVNHonHKiydkK5BTWeIIDfSfsTX6nOOXlfYZ57dRV6hzOVNwQW4Q7V9SWZAq6DNi1AG00me1GFA0D"
);
function Sponsor() {
  const [showPopup, setShowPopup] = useState(false);
  const handlePay = () => {
    setShowPopup(true);
  };
  return (
    <div>
      <button onClick={handlePay}>Pay</button>
      {showPopup && (
        <Elements stripe={stripePromise}>
          <PayPopup onClose={() => setShowPopup(false)} />
        </Elements>
      )}
    </div>
  );
}

export default Sponsor;
