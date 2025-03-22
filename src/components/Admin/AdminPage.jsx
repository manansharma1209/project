import { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { AddUser } from './AddUser';
import { SearchUser } from './SearchUser';
import { Dialog, DialogContent } from '../ui/Dialog';
import { NotificationIcon } from '../NotificationIcon';
import { UserMenu } from '../UserMenu';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('addUser');
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleEditUser = (userToEdit) => {
    setEditingUser(userToEdit);
    setActiveTab('addUser');
  };

  // Custom sidebar for admin
  const AdminSidebar = ({ activeTab, onTabChange }) => {
    return (
      <div className="w-64 bg-gray-900 text-white h-screen flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold">ERS Admin</h1>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeTab === 'addUser' ? 'bg-gray-700' : 'hover:bg-gray-800'
                }`}
                onClick={() => onTabChange('addUser')}
              >
                Add User
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeTab === 'searchUser' ? 'bg-gray-700' : 'hover:bg-gray-800'
                }`}
                onClick={() => onTabChange('searchUser')}
              >
                Search User
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="flex-1 overflow-hidden">
        <header className="flex items-center justify-between border-b bg-white px-6 py-4">
          <h1 className="text-xl font-semibold">
            {activeTab === 'addUser' ? 'Add User' : 'Search User'}
          </h1>
          <div className="flex items-center space-x-4">
            <NotificationIcon notifications={notifications} onClick={() => setShowAllNotifications(true)} />
            <UserMenu
              user={user}
              onLogout={handleLogout}
              onViewProfile={() => setShowProfileDialog(true)}
            />
          </div>
        </header>

        <main className="h-[calc(100vh-4rem)] overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Admin Panel</h2>
          </div>

          {activeTab === 'addUser' ? (
            <AddUser editingUser={editingUser} setEditingUser={setEditingUser} />
          ) : (
            <SearchUser onEditUser={handleEditUser} />
          )}

          <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
            <DialogContent>
              <div className="mt-4 space-y-2">
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Role:</strong> {user.role || 'Admin'}
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}

// Export the component without internal Routes
export function AdminApp() {
  return <AdminDashboard />;
}