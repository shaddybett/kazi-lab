import React, {useState} from 'react'
import { Table } from 'flowbite-react'

function AdminPage() {
    const [providers,setProviders] = useState([]);
    const [clients,setClients] = useState([]);
    const [error,setError] = useState(null);

    const handleUsers = async (e) => {
        e.preventDefault();

        

    }
  return (
    <div>AdminPage</div>
  )
}

export default AdminPage