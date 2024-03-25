import React from 'react'

function Signup() {
  const formData = 
  const handleSignup = async(e)=>{
    e.preventDefault()
    const response = await fetch ('/signup',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({formData})
    })
  }
  return (
    <div>Signup</div>
  )
}

export default Signup