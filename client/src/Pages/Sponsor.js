import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PayPopup from "./PayPopup";

const stripePromise = loadStripe(
  "pk_live_51PpWVz2LNaBLa9OHujPAFFVNHonHKiydkK5BTWeIIDfSfsTX6nOOXlfYZ57dRV6hzOVNwQW4Q7V9SWZAq6DNi1AG00me1GFA0D"
);
function Sponsor() {
  const [showPopup, setShowPopup] = useState(false);
  const [students,setStudents] = useState([]);
  const [selectedStudent,setSelectedStudent] = useState(null);
  const [message,setMessage] = useState('');
  const [error,setError] = useState('');

  const handleNeedyStudents = async()=>{
    try{
      const response = await fetch('/fetch_needy',{
        method:'GET',
        headers:{
          "Content-Type":"application/json",
        },
      });
      if (response.ok){
        const responseData = await response.json();
        setStudents(responseData.users)
        setMessage(responseData.message)
      }
      else{
        const errorMessage = await response.json();
        setError(errorMessage.error);
      }
    }catch (error){
      setError('An error occurred, please try again later');
    }
  };

  useEffect(()=>{
    handleNeedyStudents();
  },[]);

  const handlePay = (student)=>{
    setSelectedStudent(student);
    setShowPopup(true);
  }

  return (
    <div>
      {students && <div id="students.id"><button onClick={handlePay} >{students}</button></div>}

      {showPopup && (
        <Elements stripe={stripePromise}>
          <PayPopup onClose={() => setShowPopup(false)} bankCode={students.bank_code} bankAccount={students.bank_account} amount={students.amount} stripe_id={students.stripe_id} />
        </Elements>
      )}
      {error && <p style={{color:'red'}} >{error}</p>}
      {message && <p style={{color:'green'}} >{message}</p>}
    </div>
  );
}

export default Sponsor;
