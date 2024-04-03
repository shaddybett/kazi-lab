import React from 'react'
import { useEffect,useState } from 'react'

function ServiceProviders() {
  const [data,setData] = useState('')
  const [error,setError] = useState('')
  useEffect(()=>{
    const handleData = async()=>{
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('/service-provider',{
          method:'GET',
          headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
          }
        })
        if (response.ok){
          const responseData = await response.json()
          setData(responseData)
        }
      }
    }
  },[])
  return (
    <div>ServiceProviders</div>
  )
}

export default ServiceProviders