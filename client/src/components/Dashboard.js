import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const handleEntry= async (e)=>{
    try{
      const response = await fetch('/dashboard',{
        method:'GET',
        headers:{
          'Content-Type':'application/json'
        }
      })
      if (response.ok){
        const data = await response.json()

      }
    }catch (error){
      setError('An error occurred.Please try again later')
    }
  }
  
  return (
    <div>
      <p>Hello {data.first_name} welcome</p>
    </div>
  )
}

export default Dashboard