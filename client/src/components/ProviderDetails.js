import React,{useEffect, useState} from 'react'


function ProviderDetails() {
    const [data,setData] = useState([])
    const [error,setError] = useState('')
    const []

useEffect(()=>{
    const handleEntry = async()=>{
        try{
            const token = localStorage.getItem('token')
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
            }else {
                const errorMessage = await response.json()
                setError(errorMessage)
            }
        }
        catch(error){
            setError('An error occurred. Please try again later')
        }
    }
    handleEntry()
},[])
    
    

  return (
    <div>
        <h3>Hello {data.first_name} Complete your signup by filling in the form below</h3>
        {error && <p>{error}</p>}
    </div>
  )
}

export default ProviderDetails