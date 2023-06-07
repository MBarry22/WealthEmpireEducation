import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AssignRoleToUser() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    // Fetch the list of users and roles
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      // Send a GET request to fetch the list of users
      const response = await axios.get('/api/user/get-users');

      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRoles = async () => {
    try {
      // Send a GET request to fetch the list of roles
      const response = await axios.get('/api/user/get-roles');

      setRoles(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to assign the selected role to the user
      const response = await axios.post('/api/user/assign-role', {
        userId: selectedUser,
        roleId: selectedRole,
      });

      console.log(response.data); // Log the response

      // Reset the form
      setSelectedUser('');
      setSelectedRole('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Assign Role to User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="user">User:</label>
          <select id="user" value={selectedUser} onChange={handleUserChange} required>
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id} className='text-black'>{user.username}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="role">Role:</label>
          <select id="role" value={selectedRole} onChange={handleRoleChange} required>
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role._id} value={role._id} className='text-black'>{role.name}</option>
            ))}
          </select>
        </div>
        <button type="submit">Assign Role</button>
      </form>
    </div>
  );
}

export default AssignRoleToUser;
