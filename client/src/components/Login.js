import React,{useState} from 'react'

function Login() {
  const[email,setEmail] = useState('')
  const[password,setPassword] = useState('')
  const[error,setError] = useState('')

  const handleLogin= (e)=>{
    e.preventDefault()
  }
  if (!email || !password) {
    setError('All fields are required')
    return;
  }

  try {
    const response = await fetch('/login',)=>{}
  }


  

  return (
    <div></div>
  )
}

export default Login