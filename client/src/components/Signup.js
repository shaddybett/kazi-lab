import React,{useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'

function Signup() {
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [firstName,setFirstName] = useState('')
  const [lastName,setLastName] = useState('')
  const [error,setError] = useState('')
  const navigate = useNavigate()
  const handleSignup = async(e)=>{
    e.preventDefault()
    try {
      const response = await fetch ('/signup',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({firstName,lastName,email,password})
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
        <input type='text' placeholder='Enter your first name' value={firstName} onChange={(e)=>setFirstName(e.target.value)}/>
        <input type='text' placeholder='Enter your last name' value={lastName} onChange={(e)=>setLastName(e.target.value)}/>
        <input type='email' placeholder='Enter your email'/>
        <input type='password' placeholder='Enter your password'/>
        <button type='submit'>Submit</button>
        {error && <p>{error}</p>}
      </form>
      <p>Have an account? <Link to='/login'>Login</Link></p>
    </div>
  )
}

export default Signup