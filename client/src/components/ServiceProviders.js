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
        else{
          const errorMessage = await response.json()
          setError(errorMessage.error)
        }
      }
      catch (error){
        setError('An error occurred. PLease try again later')
      }
    }
  },[])
  return (
    <div>{data && data.map((service,index)=>{

    })}
    {error && <p>{error}</p>}
    </div>
  )
}

export default ServiceProviders