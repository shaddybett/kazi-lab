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
                setError(errorMessage)
            }
        }
        catch(error){
            setError('An error occurred.Please try again later')
        }

    }
  return (
    <div>
        {data && data(
            <p>{data.first_name} {data.last_name}</p>
        )}
    </div>
  )
}

export default Profile