import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const [name,setName] = useState('')
  const [error,setError] = useState('')
  const navigate = useNavigate()

  const handleEntry = async (e)=>{
    e.preventDefault()
    try {
      const response = await response.json()
      if (response.ok){
        navigate('/login')

      }else{
        const errorMessage = await response.json()
        setError(errorMessage.error)
      }
    }
    catch (error){
      setError('An error occurred please try again later')
    }
  }
  
  return (
    <div>
        <p></p>
    </div>
  )
}

export default Dashboard