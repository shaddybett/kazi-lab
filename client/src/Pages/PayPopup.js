import React, { useRef, useEffect, useState, useCallback } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

function PayPopup( onClose ) {
  const popupRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const stripe = useStripe();
  const elements = useElements();

  const handleClickOutside = useCallback(
    (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  const handleSubmitPayment = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!stripe || !elements) {
      setError("Stripe has not loaded yet.");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card details not found. Please ensure the card element is correctly mounted.");
      setLoading(false);
      return;
    }

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem("token");
      const idd = localStorage.getItem("idid");

      const response = await fetch(`${backendUrl}/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiver_id: idd,
          amount: 100,
          bank_code: bankCode,
          account_number: accountNumber,
        }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(data.client_secret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent.status === "succeeded") {
        setSuccess("Payment processed successfully");
        onClose(); 
      } else {
        setError(`Payment failed with status: ${paymentIntent.status}`);
      }
    } catch (error) {
      setError(`Error processing payment: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={handleClickOutside}>
      <div ref={popupRef} className="bg-white rounded-lg p-6 w-full max-w-xs md:max-w-sm mx-4 md:mx-0" onClick={stopPropagation}>
        <div className="flex flex-col items-center gap-2 mt-10">
          <div className="text-center md:text-left">
          </div>
          <p className="text-black">Click the button below to pay 20 dollars to account 24235627829</p>
          <form onSubmit={handleSubmitPayment}>
            <div className="mb-4">
              <Label htmlFor="bank-code" value="Bank Code" />
              <TextInput id="bank-code" value={bankCode} onChange={(e) => setBankCode(e.target.value)} required />
            </div>
            <div className="mb-4">
              <Label htmlFor="account-number" value="Account Number" />
              <TextInput id="account-number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required />
            </div>
            <CardElement className="mb-4" />
            <Button gradientDuoTone="purpleToBlue" type="submit" disabled={loading}>
              {loading ? "Processing..." : "Submit Payment"}
            </Button>
          </form>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && <p className="text-green-500 mt-2">{success}</p>}
        </div>
      </div>
    </div>
  );
}

export default PayPopup
