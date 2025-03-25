import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button } from '../ui/Button';
import { UserCard } from '../UserCard';
import { Filter } from 'lucide-react';

export function SearchUser({ onEditUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [filters, setFilters] = useState({ isManager: '', role: '' });
  const [loading, setLoading] = useState(false);
  const filterButtonRef = useRef(null);
  const filterDropdownRef = useRef(null);

  // Fetch all users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        filterDropdownRef.current && 
        !filterDropdownRef.current.contains(event.target) &&
        filterButtonRef.current && 
        !filterButtonRef.current.contains(event.target)
      ) {
        setShowFilterDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Apply search and filters whenever they change
  useEffect(() => {
    applyFiltersAndSearch();
  }, [searchTerm, filters, users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/users/');
      console.log(response.data);
      setUsers(response.data);
      setFilteredUsers(response.data);
      console.log('Fetched users:', response.data); // Log the fetched users
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSearch = () => {
    let result = [...users];
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        (user.name && user.name.toLowerCase().includes(term)) ||
        (user.email && user.email.toLowerCase().includes(term)) ||
        (user.role && user.role.toLowerCase().includes(term)) ||
        (user.id && user.id.toString().toLowerCase().includes(term)) // Convert user.id to string
      );
    }
    
    // Apply isManager filter
    if (filters.isManager) {
      if (filters.isManager === 'Yes') {
        result = result.filter(user => user.isManager === true);
      } else if (filters.isManager === 'No') {
        result = result.filter(user => user.isManager === false);
      }
    }
    
    // Apply role filter
    if (filters.role) {
      result = result.filter(user => 
        user.role && user.role.toLowerCase() === filters.role.toLowerCase()
      );
    }
    
    setFilteredUsers(result);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        console.log('Deleting user with ID:', userId);
        await axios.delete(`http://localhost:8080/api/users/${userId}`);
        // Remove the deleted user from state
        // setUsers(users.filter(user => user.id !== userId));
        // setFilteredUsers(filteredUsers.filter(user => user.id !== userId));
        fetchUsers(); // Refetch users to update the list
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  // Function to fetch subordinates for a user
  const fetchSubordinates = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/users/${userId}/subordinates`);
      return response.data;
    } catch (error) {
      console.error('Error fetching subordinates:', error);
      return [];
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-4">
          <input
            type="text"
            placeholder="Search users by name, email, role, or ID"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="relative">
          <Button 
            ref={filterButtonRef}
            variant="secondary" 
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          {showFilterDropdown && (
            <div 
              ref={filterDropdownRef}
              className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200 p-4"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Is Manager
                  </label>
                  <select
                    name="isManager"
                    value={filters.isManager}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    placeholder="Filter by role"
                    value={filters.role}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setFilters({ isManager: '', role: '' });
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-10">No users found. Try adjusting your search criteria.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => {
  return (
    <UserCard
      key={user.wissenID} // Use wissenId as the key
      user={{
        id: user.wissenID,
        name: user.name,
        email: user.email,
        role: user.role,
        managerId: user.managerId,
        joiningDate: user.dateOfJoining,
        isManager: user.isManager,
        wissenID: user.wissenID // Ensure wissenId is passed to UserCard
      }}
      reportees={user.reportees || []}
      onEdit={() => onEditUser(user)}
      onDelete={() => handleDeleteUser(user.wissenID)}
    />
  );
})}
        </div>
      )}
    </div>
  );
}