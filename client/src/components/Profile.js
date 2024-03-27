import React,{useEffect, useState} from 'react'
import { Card } from "flowbite-react";

function Profile() {
    const [data,setData] = useState([])
    const [error,setError] = useState('')

    useEffect(()=>{
        const handleEntry = async()=>{
            try {
                const token = localStorage.getItem('token')
                if (!token){
                    throw new error ('Token not found');
                }
                const response = await fetch('/dashboard',{
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
                    setError(errorMessage || 'An error occurred')
                }
            }
            catch(error){
                setError('An error occurred.Please try again later')
            }
    
        }
        handleEntry();
    })

  return (
    <div>
        {data && (
            <p>{data.first_name} {data.last_name}</p>
        )}
    <Card className="max-w-sm" imgSrc="/images/blog/image-4.jpg" horizontal>
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Noteworthy technology acquisitions 2021
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
      </p>
    </Card>
        {error && <p>{error}</p>}
    </div>
  )
}

export default Profile