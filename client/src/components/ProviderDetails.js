import React,{useEffect, useState} from 'react'
import { FileInput, Label,Dropdown } from "flowbite-react";


function ProviderDetails() {
    const [data,setData] = useState([])
    const [error,setError] = useState('')
    const [entry,setEntry] = useState('')
    const [errors,setErrors] = useState('')
    const [phoneNumber,setPhoneNumber] = useState('')
    const [nationalId,setNationalId] = useState('')
    const [image,setImage] = useState('')
    const [service,setService] = useState('')
    const [location,setLocation] = useState('')

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

const handleForm = async()=>{
    try{
        const response = await fetch ('/signup',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({phoneNumber,nationalId,image,service,location})
        })
        if (response.ok){
            const responseData = await response.json()
            setEntry(responseData)
        }else{
            const errors = await response.json()
            setErrors(errors)
        }
    }   
    catch(errors){
        setErrors('An error occurred. Please try again later.')
    } 
}
    
  return (
    <div>
        <h3>Hello {data.first_name} Complete your signup by filling the form below</h3>
        <form onSubmit={handleForm}>
            <input type='text' value={phoneNumber} placeholder='0712345678' onChange={(e)=>setPhoneNumber(e.target.value)}/>
            <input type='text' value={nationalId} placeholder='Enter your I.d number' onChange={(e)=>setPhoneNumber(e.target.value)}/>
            <input type='text' value={service} placeholder='Additional services' onChange={(e)=>setService(e.target.value)}/>
            <input type='text' value={location} placeholder='Enter your location' onChange={(e)=>setLocation(e.target.value)}/>
            <Dropdown label="Services" inline>
                <Dropdown.Item>Laundry</Dropdown.Item>
                <Dropdown.Item>BodaBoda</Dropdown.Item>
                <Dropdown.Item>Transport</Dropdown.Item>
                <Dropdown.Item>Tailor</Dropdown.Item>
                <Dropdown.Item>Gardening</Dropdown.Item>
                <Dropdown.Item>House Keeping</Dropdown.Item>
            </Dropdown>
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="file-upload" value="image" />
                </div>
                <FileInput id="file-upload" />
            </div>


        </form>
        {error && <p>{error}</p>}
    </div>
  )
}

export default ProviderDetails