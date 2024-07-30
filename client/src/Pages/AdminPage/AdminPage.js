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
            if (response.ok){
                const responseData = await response.json();
                const fetchedProviders = responseData.filter(user => user.role_id === 2);
                const fetchedClients = responseData.filter(user => user.role_id === 3);
            }
        }

    }
  return (
    <div>AdminPage</div>
  )
}

export default AdminPage