import React,{useState,useEffect} from 'react'

function Dashboard() {
  const [data,setData] = useState([])
  const [error,setError] = useState('')
  const backendUrl = process.env.REACT_APP_BACKEND_URL;


  useEffect(()=>{
    const fetchData = async ()=>{
      try {
        const token = localStorage.getItem('token')
        if (!token){
          throw new Error('Token not found');
        }
        const response = await fetch(`${backendUrl}/dashboard`,{
          method:'GET',
          headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok){
          const responseData = await response.json()
          console.log(responseData)
          setData(responseData)
        }
        else{
          const errorMessage = await response.json()
          console.log(errorMessage)
          setError(errorMessage.error || 'An error occurred')
        }
      }
      catch(error){
      setError('An error occurred. Please try again later.')
      }
    }
    fetchData();

  },[])
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer); // Cleanup the timer on component unmount or error change
    }
  }, [error]);
  return (
    <div>
      {data && (
        <p>Hello {data.first_name} {data.last_name}, welcome!</p>
      )}
      {error && <p className="text-red-500">{error}</p>}
      
    </div>
  )
}

export default Dashboard