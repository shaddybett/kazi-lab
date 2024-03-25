import React,{useState,useEffect} from 'react'

function Dashboard() {
  const [data,setData] = useState('')
  const [error,setError] = useState('')


  useEffect(()=>{
    const fetchData = async ()=>{
      try {
        const response = await fetch('/dashboard',{
          method:'GET',
          headers:{
            'Content-Type':'application/json'
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
      setError('Invalid email or password')
      }
    }

  },[])
  return (
    <div>
      {data && (
        <p>Hello {data.first_name}</p>
      )}
      {error && <p>{error}</p>}
    </div>
  )
}

export default Dashboard