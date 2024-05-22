import React,{useEffect, useState} from 'react'
import { Card,Avatar } from "flowbite-react";

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
        <Card className="max-w-sm ml-80 mt-20">
            <div className="flex items-center gap-5 mt-10 ml-5">
                <Avatar img={data.image} size="xl" />
                <div>
                <h3 className="text-l font-bold tracking-tight text-gray-900 dark:text-white">
                   Name: <p className="font-normal text-gray-700 dark:text-gray-400">{data.first_name} {data.middle_name} {data.last_name}</p>
                </h3>
                <h3 className="text-l font-bold tracking-tight text-gray-900 dark:text-white">
                   Email: <p className="font-normal text-gray-700 dark:text-gray-400">{data.email}</p>
                </h3>
                <h3 className="text-l font-bold tracking-tight text-gray-900 dark:text-white">
                   Phone Number: <p className="font-normal text-gray-700 dark:text-gray-400">{data.phone_number}</p>
                </h3>
                <h3 className="text-l font-bold tracking-tight text-gray-900 dark:text-white">
                   National Id: <p className="font-normal text-gray-700 dark:text-gray-400">{data.national_id}</p>
                </h3>
                </div>
            </div>
        </Card>
        {error && <p>{error}</p>}
    </div>
  )
}

export default Profile