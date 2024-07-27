import React,{useState} from 'react'

function AdminPage() {
    const [users,setUsers] = useState([])
    const [error,setError] = useState([])
    const [provider, setProvider] = useState([])
    const [client, setClient] = useState([])
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
            if (responseData.role_id === 2){
                const role = provider
            }
            else if (responseData.role_id === 3){
                const role = client
            }
            setUsers(responseData)
        }
        else{
            const errorMessage = response.json()
            setError(errorMessage.error)
        }
    }
  return (
    <div>
        {users > 0 ? (<li key={users.id} >{users.first_name} {users.last_name}</li>):(<p>No usersfound</p>)}
    </div>
  )
}

export default AdminPage