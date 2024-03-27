import React from "react";
import { useState,useEffect } from "react";


function ProviderDashboard() {
  const [data,setData] = useState('')
  const [error,setError] = useState('')
  useEffect(()=>{
    const handleEntry = async()=>{
      const token = localStorage.getItem('token')
      try{
        const responseData = await fetch('/dashboard',{
          method:'GET',
          headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
      }catch(error){

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
