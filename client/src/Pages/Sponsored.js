import React, { useState } from "react";

function Sponsored() {
  const [bankCode, setBankCode] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const validateInput = () => {
    if (!bankCode.match(/^\d{6}$/)) {
      setError("Invalid bank code");
      return false;
    }
    if (!bankAccount.match(/^\d{13}$/)) {
      setError("Invalid bank account number");
      return false;
    }
    if (isNaN(amount) || Number(amount) <= 0) {
      setError("Amount should be a positive Number");
      return false;
    }
    return true;
  };

  const handleUserDetails = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!validateInput()) {
      return;
    }

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/needy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, bankCode, bankAccount,name }),
      });
      if (response.ok) {
        const responseData = await response.json();
        setMessage(responseData.message);
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.error);
      }
    } catch (error) {
      setError("An error occurred, please try again later.");
    }
  };
  return (
    <form onSubmit={handleUserDetails}>
      <label htmlFor="bankCode">Bank Code:</label>
      <input
        id="bankCode"
        type="text"
        value={bankCode}
        onChange={(e) => setBankCode(e.target.value)}
      />
      <label htmlFor="bankAccount">Bank Account:</label>
      <input
        id="bankAccount"
        type="text"
        value={bankAccount}
        onChange={(e) => setBankAccount(e.target.value)}
      />
      <label htmlFor="name">
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label htmlFor="amount"> Amount:</label>
      <input
        id="amount"
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button type="submit">Submit</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </form>
  );
}

export default Sponsored;
