import React, {useState,useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom';

function Login() {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [error,setError] = useState('')

    const handleLogin = async(e) => {
        e.preventDefault();
        try{
            const response = await fetch('/login',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({email,password})
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.access_token);
                history.push('/dashboard');
            }else{
                setError('Invalid credentials. Please try again later.');
            }
        } catch (error){
            setError('An error occurred. Please try again later.');
        }
    }
  return (
    <div>
        <form>
            <input type='email' placeholder='local-part@domain.tld' value={email} onChange={(e)=>setEmail(e.target.value)} pattern = "/>
            <input/>
        </form>
    </div>
  )
}

export default Login