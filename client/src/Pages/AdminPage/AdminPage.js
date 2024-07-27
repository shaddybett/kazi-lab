import React,{useState} from 'react'

function AdminPage() {
    const handleUsers = async (e)=>{
        const token = localStorage.getItem("token")
        e.preventDefault()
        const response = await fetch('/all_users',{
            method:"GET",
            headers:{
                Authorization:`Bearer {token}`
            }
        })
        if (response.ok){

        }
    }
  return (
    <div></div>
  )
}

export default AdminPage