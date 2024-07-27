import React,{useState} from 'react'

function AdminPage() {
    const [users,setUsers] = useState([])
    const [error,setError] = useState([])
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
            const responseData = response.json()
            setUsers(responseData)
        }
        else{
            const errorMessage = response.json()
            setError(errorMessage.error)
        }
    }
  return (
    <div>
        
    </div>
  )
}

export default AdminPage