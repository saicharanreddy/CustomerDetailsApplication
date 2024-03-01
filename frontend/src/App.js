import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date' or 'time'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/customers')
      .then(response => {
        setCustomers(response.data);
        setLoading(false);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleSearch = () => {
    axios.get(`/api/customers/search?term=${searchTerm}`)
      .then(response => {
        setCustomers(response.data);
      })
      .catch(error => console.error('Error searching:', error));
  };

  const handleSort = () => {
    const newSortBy = sortBy === 'date' ? 'time' : 'date';
    axios.get(`/api/customers?sortBy=${newSortBy}`)
      .then(response => {
        setSortBy(newSortBy);
        setCustomers(response.data);
      })
      .catch(error => console.error('Error sorting:', error));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <input type="text" placeholder="Search by Name or Location" onChange={(e) => setSearchTerm(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
      <button onClick={handleSort}>{`Sort by ${sortBy === 'date' ? 'Time' : 'Date'}`}</button>

      <table>
        <thead>
          <tr>
            <th>Sno</th>
            <th>Customer Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.sno}>
              <td>{customer.sno}</td>
              <td>{customer.customer_name}</td>
              <td>{customer.age}</td>
              <td>{customer.phone}</td>
              <td>{customer.location}</td>
              <td>{customer.created_at_date}</td>
              <td>{customer.created_at_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
