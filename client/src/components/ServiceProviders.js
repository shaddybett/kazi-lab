
import React from 'react'

function ServiceProviders() {
  const [data,setData] = useState('')
  const [error,setError] = useState('')
  useEffect(()=>{
    const handleData = async()=>{
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('/service-provider',{
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
          setError(errorMessage.error)
        }
      }
      catch (error){
        setError('An error occurred. PLease try again later')
      }
    }
    handleData();
  },[]);
  return (
    <div>
      {data && data.map((provider)=>(
        <div key={provider.id}>
          {provider.first_name}
        </div>
      ))}
    </div>
  )
}

export default ServiceProviders