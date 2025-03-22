import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export function AddUser({ editingUser, setEditingUser }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    joiningDate: '',
    role: '',
    managerId: '',
    isManager: 'No',
    subordinates: '',
    password: ''  // Only for new users
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Update form when editing user changes
  useEffect(() => {
    if (editingUser) {
      setFormData({
        fullName: editingUser.name || '',
        email: editingUser.email || '',
        joiningDate: editingUser.joiningDate ? new Date(editingUser.joiningDate).toISOString().split('T')[0] : '',
        role: editingUser.role || '',
        managerId: editingUser.managerId || '',
        isManager: editingUser.isManager ? 'Yes' : 'No',
        subordinates: editingUser.subordinateIds ? editingUser.subordinateIds.join(', ') : '',
        // No password field when editing
      });
    }
  }, [editingUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    // Transform form data to API format
    const userData = {
      name: formData.fullName,
      email: formData.email,
      date_of_joining: formData.joiningDate,
      role: formData.role,
      manager_id: formData.managerId || null,
      is_Manager: formData.isManager === 'Yes',
      subordinate_ids: formData.subordinates ? formData.subordinates.split(',').map(id => id.trim()) : []
    };
    console.log(editingUser);

    if (editingUser == null || !editingUser) {
      userData.password = formData.password; // Only include password for new users
    }
    console.log(userData);

    try {
      if (editingUser) {
        // Update existing user
        await axios.put(`http://localhost:8080/api/users/${editingUser.id}`, userData);
        setSuccess(true);
        setError('');
        // Reset form after 3 seconds
        setTimeout(() => {
          setSuccess(false);
          setEditingUser(null);
          resetForm();
        }, 3000);
      } else {
        // Create new user
        console.log(userData);
        await axios.post('http://localhost:8080/api/users', userData);
        setSuccess(true);
        setError('');
        // Reset form after 3 seconds
        setTimeout(() => {
          setSuccess(false);
          resetForm();
        }, 3000);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      setError(error.response?.data?.message || 'An error occurred while saving the user.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      joiningDate: '',
      role: '',
      managerId: '',
      isManager: 'No',
      subordinates: '',
      password: ''
    });
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        {editingUser ? 'Edit User' : 'Add New User'}
      </h2>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          User {editingUser ? 'updated' : 'created'} successfully!
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {!editingUser && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required={!editingUser}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Joining
          </label>
          <input
            type="date"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Manager ID
          </label>
          <input
            type="text"
            name="managerId"
            value={formData.managerId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Leave blank if no manager"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Is Manager
          </label>
          <select
            name="isManager"
            value={formData.isManager}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subordinates (Comma separated IDs)
          </label>
          <textarea
            name="subordinates"
            value={formData.subordinates}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="e.g. user123, user456, user789"
            rows="3"
          />
        </div>

        <div className="flex justify-end space-x-3">
          {editingUser && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setEditingUser(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : editingUser ? 'Update User' : 'Create User'}
          </Button>
        </div>
      </form>
    </Card>
  );
}