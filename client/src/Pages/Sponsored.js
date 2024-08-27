import React, { useState } from 'react'

function Sponsored() {
  const [bankCode,setBankCode] = useState('')
  const [bankAccount,setBankAccount] = useState('')
  const [amount,setAmount] = useState('')
  const [message,setMessage] = useState('')
  const [error,setError] = useState('')

  const validateInput = ()=>{
    if (!bankCode.match(/^\d{6}$/)) {
      setError('Invalid bank code');
      return false;
    }
    if (!bankAccount.match(/^\d{12}$/)) {
      setError('Invalid bank account number');
      return false;
    }
    return true
  };
  
  return (
    <div>Sponsored</div>
  )
}

export default Sponsored