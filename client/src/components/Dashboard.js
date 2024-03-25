import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const handleEntry= async (e)=>{
    try{
      const response = await fetch('/dashboard',{
        method:'GET',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify
      })
    }catch (error){
      setError('An error occurred.Please try again later')
    }
  }
  
  return (
    <div>
        <p></p>
    </div>
  )
}

export default Dashboard