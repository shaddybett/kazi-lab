import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PayPopup from "./PayPopup";

const stripePromise = loadStripe(
  "pk_live_51PpWVz2LNaBLa9OHujPAFFVNHonHKiydkK5BTWeIIDfSfsTX6nOOXlfYZ57dRV6hzOVNwQW4Q7V9SWZAq6DNi1AG00me1GFA0D"
);

function Sponsor() {
  const [showPopup, setShowPopup] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleNeedyStudents = async () => {
    try {
      const response = await fetch("/fetch_needy", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const responseData = await response.json();
        setStudents(responseData.users);
        setMessage(responseData.message);
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.error);
      }
    } catch (error) {
      setError("An error occurred, please try again later");
    }
  };

  useEffect(() => {
    handleNeedyStudents();
  }, []);

  const handlePay = (student) => {
    setSelectedStudent(student);
    setShowPopup(true);
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      {message && <div className="message">{message}</div>}
      <div>
        {students.length > 0 ? (
          students.map((student) => (
            <div key={student.id}>
              <button onClick={() => handlePay(student)}>
                {student.bank_code} - {student.amount}
              </button>
            </div>
          ))
        ) : (
          <div>No needy students available.</div>
        )}
      </div>

      {showPopup && selectedStudent && (
        <Elements stripe={stripePromise}>
          <PayPopup
            onClose={() => setShowPopup(false)}
            bankCode={selectedStudent.bank_code}
            bankAccount={selectedStudent.bank_account}
            amount={selectedStudent.amount}
            stripe_id={selectedStudent.stripe_id}
          />
        </Elements>
      )}
    </div>
  );
}

export default Sponsor;
