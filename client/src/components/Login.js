import React, {useState} from 'react';
import { Link } from 'react-router-dom';

function Login() {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [error,setError] = useState('');
    // const history = useHistory();

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
                // history.push('/dashboard');
                <Link to='/signup'/>
            }else{
                setError('Invalid credentials. Please try again later.');
            }
        } catch (error){
            setError('An error occurred. Please try again later.');
        }
    }
  return (
    <div>
        <form onSubmit={handleLogin}>
            <input type='email' placeholder='local-part@domain.tld' value={email} onChange={(e)=>setEmail(e.target.value)} title='Enter a avalid email address' required/>
            <input type='password' placeholder='*********' value={password} onChange={(e)=>setPassword(e.target.value)} title='Enter a valid Password' required/>
            <button type='submit'>Submit</button>
        </form>
        {error && <p>{error}</p>}
        <p>Don't have an account? <Link to='/signup'>Signup</Link></p>
    </div>
  )
}

export default Login