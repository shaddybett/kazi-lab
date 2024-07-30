import React, {useState} from 'react'
import { Table } from 'flowbite-react'

function AdminPage() {
    const [providers,setProviders] = useState([]);
    const [clients,setClients] = useState([]);
    const [error,setError] = useState(null);

    const backendUrl = process.env.REACT_APP_BACKEND_URL
    const handleUsers = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`{backendUrl}/all_users`,{
                method: 'GET',
                headers:{
                    Authorization: `Bearer ${token}`,
                },
            });
            
        }

    }
  return (
    <div>AdminPage</div>
  )
}

export default AdminPage