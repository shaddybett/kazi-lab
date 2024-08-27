import React, { useState } from 'react'

function Sponsored() {
  const [bankCode,setBankCode] = useState('')
  const [bankAccount,setBankAccount] = useState('')
  const [amount,setAmount] = useState('')
  const [message,setMessage] = useState('')
  const [error,setError] = useState('')
  
  return (
    <div>Sponsored</div>
  )
}

export default Sponsored