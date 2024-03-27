import React from "react";
import { useState,useEffect } from "react";


function ProviderDashboard() {
  const [data,setData] = useState('')
  const [error,setError] = useState('')
  useEffect(()=>{
    const handleEntry = async()=>{
      const token = localStorage.getItem('token')
      try{
        const response = await fetch('/dashboard',{
          method:'GET',
          headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok){
          const responseData = await response.json()
          setData(responseData)
        }
        else{
          const errorMessage = await response.json()
          setError(errorMessage.error || 'An error occurred')
        }
      }catch(error){
        setError('An error occurred. Please try again later')

      }

    };
    handleEntry();
  },[]);
  return (

    <div>
      <p> Hello Provider</p>

    </div>
  );
}

export default ProviderDashboard;
