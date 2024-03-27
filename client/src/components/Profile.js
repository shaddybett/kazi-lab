import React,{useState} from 'react'

function Profile() {
    const [data,setData] = useState([])
    const [error,setError] = useState('')

    const handleEntry = async()=>{
        const token = localStorage.getItem('token')
        try {
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
                
            }
        }

    }
  return (
    <div>

    </div>
  )
}

export default Profile