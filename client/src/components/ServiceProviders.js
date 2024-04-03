import React, { useState, useEffect } from 'react';

function ServiceProviders() {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/service-provider', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const responseData = await response.json();
          setData(responseData);
        } else {
          const errorMessage = await response.json();
          setError(errorMessage.error);
        }
      } catch (error) {
        setError('An error occurred. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {!loading && error && <p>{error}</p>}
      {/* {!loading && data.map(provider => (
        <div key={provider.id}>
          {provider.first_name}
        </div>
      ))} */}
      {!loading && <p>{data.first_name}</p>}
    </div>
  );
}

export default ServiceProviders;
