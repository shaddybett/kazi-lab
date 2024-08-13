import React from 'react'
function ProviderUpdates({senderId}) {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const handleRecentCustomers = async()=>{
    const response = await fetch(`${backendUrl}/assigned_resource/{senderId}`,{
      method:'GET',
      headers:{
        
      }
    })
  }
  const handleCustomerDetails = async()=>{
    const response = await fetch(`${backendUrl}/{senderIds}`)
  }
  return (
    <div>
      <h4 className='text-white' >Recent Customers</h4>
      <p></p>
    </div>
  )
}

export default ProviderUpdates