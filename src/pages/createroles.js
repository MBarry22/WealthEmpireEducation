import React, { useState } from 'react';
import axios from 'axios';

function CreateRoles() {
  const [name, setName] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to create a new role
      const response = await axios.post('/api/user/create-roles', {
        name
      });

      console.log(response.data); // Log the response

      // Reset the form
      setName('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Create Role</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Role Name:</label>
          <input type="text" id="name" value={name} onChange={handleNameChange} required />
        </div>
        <button type="submit">Create Role</button>
      </form>
    </div>
  );
}

export default CreateRoles;
