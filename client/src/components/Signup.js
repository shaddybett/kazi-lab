import React,{useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import { Label, Checkbox } from "flowbite-react";


function Signup() {
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [first_name,setFirstName] = useState('')
  const [last_name,setLastName] = useState('')
  const [error,setError] = useState('')
  const [role,setRole] = useState('')
  const navigate = useNavigate()
  const handleSignup = async(e)=>{
    e.preventDefault()
    try {
      const response = await fetch ('/signup',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({first_name,last_name,email,password})
      })
      if (response.ok){
        navigate('/login')
      }
      else {
        const errorMessage = await response.json()
        setError(errorMessage.error)
      }
    }
    catch{
      setError('An error occurred please try again later!')
    }

  }
  return (
    <div>
      <form onSubmit={handleSignup}>
        <div className="flex items-center gap-2">
          <Checkbox id="promotion" />
          <Label htmlFor="promotion">Client</Label>
          <Checkbox id="promotion" />
          <Label htmlFor="promotion">Service Provider</Label>
        </div>
        <input type='text' placeholder='Enter your first name' value={first_name} onChange={(e)=>setFirstName(e.target.value)}/>
        <input type='text' placeholder='Enter your last name' value={last_name} onChange={(e)=>setLastName(e.target.value)}/>
        <input type='email' placeholder='Enter your email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
        <input type='password' placeholder='Enter your password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
        <button type='submit'>Submit</button>
        {error && <p>{error}</p>}

      </form>
      <p>Have an account? <Link to='/login'>Login</Link></p>
    </div>
  )
}

export default Signup