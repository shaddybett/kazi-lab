import React, { useEffect, useState } from 'react'
import {Link,useNavigate} from 'react-router-dom'

function Login() {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [error,setError] = useState('')
    const [data,setData] = useState([])

    const navigate = useNavigate()

    const handleLogin = async(e)=>{
        e.preventDefault()
        try{
            const response = await fetch('/login',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({email,password})
            })
            if (response.ok){
                const data = await response.json()
                localStorage.setItem('token',data.access_token)
                navigate('/dashboard')
            }else{
                const errorMessage = await response.json()
                setError(errorMessage.error)
            }
        } 
        catch (error){
            setError('An error occurred.Please try again later')
        }
    }
    useEffect(()=>{
        const fetchData = async ()=>{
          try {
            const token = localStorage.getItem('token')
            if (!token){
              throw new Error('Token not found');
            }
            const response = await fetch('/dashboard',{
              method:'GET',
              headers:{
                'Content-Type':'application/json',
                'Authorization': `Bearer ${token}`
              }
            })
            if (response.ok){
              const responseData = await response.json()
              console.log(responseData)
              setData(responseData)
            }
            else{
              const errorMessage = await response.json()
              console.log(errorMessage)
              setError(errorMessage.error || 'An error occurred')
            }
          }
          catch(error){
          setError('An error occurred. Please try again later.')
          }
        }
        fetchData();
    },[])
    if (data.role_id === 2){
        navigate()
    }
  return (
    <div>
        <form onSubmit={handleLogin}>
            <input type='email' value={email} placeholder='Enter your email' onChange={(e)=>setEmail(e.target.value)}/>
            <input type='password' value={password} placeholder='*********' onChange={(e)=>setPassword(e.target.value)}/>
            <button type='submit'>Submit</button>
            {error && <p>{error}</p>}
        </form>
        <p>Don't have an account? <Link to='/signup'>Signup</Link> </p>
    </div>
  )
}

export default Login