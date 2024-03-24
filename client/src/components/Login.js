import React,{useState} from "react";
import {Link} from 'react-router-dom'

const[email,setEmail] = useState('')
const[password,setPassword] = useState('')
const[error,setError] = useState('')

const handleLogin = async(e)=>{
    e.preventDefault()
}

try {
    const handleLogin = await fetch('/login',{
        method:'POST',
        'Content-Type':'application/json',
        headers: {
            body:JSON.stringify({email,password})
        }

    })
    const data = await response()
    if (response.ok){
        localStorage.setItem({'token':data.access_token}),
        <Link to='/'/>
    }
    else{
        setError('An error occurred')
    }
}
catch{
    setError('An error occurred please try again later')
}

return (
    <div>
        <form onSubmit={handleLogin}>

        <input type="email" placeholder="example@gmail.com" value={email} onChange={setEmail}/>
        <input type="password" placeholder="*********" value={password} onChange={setPassword}/>
        <button type="submit">submit</button>
        </form>
    </div>
)