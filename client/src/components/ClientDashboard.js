import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

function ClientDashboard() {
  const [data,setData] = useState('')
  const [error,setError] = useState('')
  useEffect(()=>{
    const handleEntry = async(e)=>{
      token = localStorage.getItem('token')
      try{
        const response = await fetch('/dashboard',{
          method:'GET',
          headers:{
            "Content-Type":"application/json",
            "Authorization": `Bearer ${token}`
          }
        });if (response.ok){
          setData(response)
        }
        else{}
      }
      catch (error){

      }
    }
  },[])
  return (
    <div>Hi client</div>
  )
}

export default ClientDashboard