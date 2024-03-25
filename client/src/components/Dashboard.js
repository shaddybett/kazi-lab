import React,{useState,useEffect} from 'react'

function Dashboard() {
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

        }
      }
      catch(error){
      
      }
    }

  },[])
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard