import React, { useState } from 'react'

function Sponsored() {
  const [bankCode,setBankCode] = useState(null)
  const [bankAccount,setBankAccount] = useState(null)
  const [amount,setAmount] = useState(null)
  const [message,setMessage] = useState([])
  const [error,setError] = useState([])

  const handleBankCode = ()=>{
    setBankCode()
  }
  const handleBankAccount = ()=>{
    setBankAccount()
  }
  const handleAmount = ()=>{
    setAmount()
  }
  const handleUserDetails = async(e)=>{
    e.preventDefault()
    try{
      const response = await fetch('/needy',{
        method: 'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({amount,bankCode,bankAccount})
      })
      if (response.ok){
        const responseData= await response.json()
        setMessage(responseData.message)
      }
      else{
        const errorMessage = await response.json()
        setError(errorMessage.error)
      }
    }catch (error){
      setError('An error occurred please try again later')
    }
  }
  return (
    <div onSubmit={handleUserDetails} >
      <input type='text' value={bankCode} />
      <input type='text' value={bankAccount} />
      <input type='text' value={amount} />
      <button type='submit' >submit</button>
     
    </div>
  )
}

export default Sponsored