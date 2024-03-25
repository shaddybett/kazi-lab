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
      }
    }
  },[])
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard