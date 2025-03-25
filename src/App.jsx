import { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Sidebar } from './components/SideBar';
import { UserMenu } from './components/UserMenu';
import { ExpenseCard } from './components/ExpenseCard';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from './components/ui/Dialog';
import { Button } from './components/ui/Button';
import { PlusCircle, Filter } from 'lucide-react';
import { ExpenseForm } from './components/ExpenseForm';
import { NotificationIcon } from './components/NotificationIcon';
import { NotificationList } from './components/NotificationList';
import { ExpenseFilter } from './components/ExpenseFilter';
import { Login } from './Components/Login';
import { AdminApp } from './Components/Admin/AdminPage'; // Import the AdminApp component

// Authentication check function
const isAuthenticated = () => {
  return localStorage.getItem('user') !== null;
};

// Admin check function
const isAdmin = () => {
  const user = localStorage.getItem('user');
  if (!user) return false;
  return JSON.parse(user).role === "ADMIN";
};

// Protected route component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Admin route component
const AdminRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  if (!isAdmin()) {
    return <Navigate to="/home" />;
  }
  return children;
};

// Public route component (accessible only when NOT logged in)
const PublicRoute = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to={isAdmin() ? "/admin" : "/home"} />;
  }
  return children;
};

function Dashboard() {
  const [activeTab, setActiveTab] = useState('requests');
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState(null);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [filters, setFilters] = useState({ status: '', dateOrder: '', category: '' });
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const filterButtonRef = useRef(null);
  const filterDropdownRef = useRef(null);
  const [approveRequests, setApproveRequests] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  // Fetch expenses from the backend
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/expenses/user?userId=${user.wissenID}`);
        setExpenses(Array.isArray(response.data) ? response.data : []);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching expenses:', error);
        setExpenses([]);
      }
    };

    fetchExpenses();
  }, [user.wissenID]);

  useEffect(() => {
    if (user?.wissenID) {
        fetchNotifications();
    }
  }, [user]);

  useEffect(() => {
    if (user.isManager) {
      fetchApproveRequests();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/notifications/user/${user.wissenID}`);
      setNotifications(response.data);
      console.log("notifications",response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchApproveRequests = async () => {
    if (!user.isManager) return;
  
    try {
      console.log("reportees", user.reportees);
      const approveRequestsPromises = user.reportees.map(reporteeWissenId =>
        axios.get(`http://localhost:8080/api/expenses/user?userId=${reporteeWissenId}`)
      );
      const responses = await Promise.all(approveRequestsPromises);
      const approveRequests = responses.flatMap(response => response.data);
      setApproveRequests(approveRequests);
    } catch (error) {
      console.error('Error fetching approve requests:', error);
    }
  };

  // Close filter dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target) &&
          filterButtonRef.current && !filterButtonRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleApprove = async (id) => {
    try {
      const targetExpense = approveRequests.find(expense => expense.id === id);
      console.log(targetExpense);
      let response = await axios.put(`http://localhost:8080/api/expenses/${id}/status/approve?userId=${targetExpense.wissenID}&status=APPROVED&approvedBy=${user.wissenID}`);
      
      if(response.status == 200){
        await axios.post(`http://localhost:8080/api/notifications/`, {
          message: `Your expense request for ${targetExpense.category}. And amount ${targetExpense.amount} has been approved.`,
          status: 'APPROVED',
          userId: targetExpense.user.wissenID,
              managerId: user.wissenID,
              expenseId: id
      });
      
      }
      const updatedExpenses = expenses.map(expense =>
        expense.id === id ? { ...expense, status: 'APPROVED'} : expense
      );
      setExpenses(updatedExpenses);

      const newNotification = {
        message: `Your expense request for ${targetExpense.category}. And amount ${targetExpense.amount} has been approved.`,
        status: 'APPROVED',
        userId: targetExpense.user.wissenID,
        managerId: user.wissenID,
        expenseId: id,
        createdAt: new Date().toISOString(),
      };
      setNotifications([newNotification, ...notifications]);
    } catch (error) {
      console.error('Error approving expense:', error);
    }
  };

  const handleReject = async (id, reason) => {
    try {
      const targetExpense = approveRequests.find(expense => expense.id === id);
      let response = await axios.put(`http://localhost:8080/api/expenses/${id}/status/reject?userId=${targetExpense.wissenID}&status=REJECTED&reason=${reason}&rejectedBy=${user.wissenID}`);

      if(response.status == 200){
        await axios.post(`http://localhost:8080/api/notifications/`, {
          message: `Your expense request for ${targetExpense.category}. And amount ${targetExpense.amount} has been rejected. Due to ${reason}. By ${user.name}`,
          status: 'REJECTED',
          userId: targetExpense.user.wissenID,
          managerId: user.wissenID,
          expenseId: id
      });
      
      const updatedExpenses = expenses.map(expense =>
        expense.id === id ? { ...expense, status: 'REJECTED' } : expense
      );
      setExpenses(updatedExpenses);

      const newNotification = {
        message: `Your expense request for ${targetExpense.category}. And amount ${targetExpense.amount} has been rejected. Due to ${reason}. By ${user.name}`,
        status: 'REJECTED',
        userId: targetExpense.user.wissenID,
        managerId: user.wissenID,
        expenseId: id,
        createdAt: new Date().toISOString(),
      };
      setNotifications([newNotification, ...notifications]);
  
      
    }
    } catch (error) {
      console.error('Error rejecting expense:', error);
    }
  };
  

  const handleExpenseSubmit = async (formData) => {
    try {
        // Upload the receipt file first
        const receiptFormData = new FormData();
        receiptFormData.append('file', formData.receipt);

        const uploadResponse = await axios.post(
            `http://localhost:8080/api/upload/pdf`,
            receiptFormData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        console.log(uploadResponse.data);
        const receiptUrl = uploadResponse.data;

        // Now submit the expense with the receipt URL
        const expenseData = {
            userId: user.wissenID,
            category: formData.category.toUpperCase(),
            amount: parseFloat(formData.amount),
            description: formData.description,
            receipt: receiptUrl, //! URL Idahr he
        };
        console.log(expenseData);
        


        const response = await axios.post(
            `http://localhost:8080/api/expenses/`,
            expenseData,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const newExpense = response.data;
        setExpenses([newExpense, ...expenses]);
        setShowExpenseForm(false);
    } catch (error) {
        console.error("Error submitting expense:", error);
    }
};


  

  const handleEdit = (id) => {
    const expenseToEdit = expenses.find(expense => expense.id === id);
    setEditingExpense(expenseToEdit);
    setShowExpenseForm(true);
  };

  const handleDelete = (id) => {
    setDeletingExpenseId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/expenses/${deletingExpenseId}`, {
        params: { userId: user.wissenID }
      });
      setExpenses(expenses.filter(expense => expense.id !== deletingExpenseId));
      setShowDeleteConfirm(false);
      setDeletingExpenseId(null);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleExpenseUpdate = async (formData) => {
    try {
        const response = await axios.put(
            `http://localhost:8080/api/expenses/${editingExpense.id}?userId=${user.wissenID}`, // Add userId here
            { 
              "expense":{
                category: formData.category.toUpperCase(),
                amount: parseFloat(formData.amount),
                description: formData.description,
                receipt: 'string',  // Ensure correct handling of receipt
                status: formData.status || 'PENDING' // Default status if missing
            }},
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        const updatedExpense = response.data;
        setExpenses(expenses.map(expense => 
            expense.id === editingExpense.id ? updatedExpense : expense
        ));
        setEditingExpense(null);
        setShowExpenseForm(false);
    } catch (error) {
        console.error('Error updating expense:', error);
    }
};


  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setShowFilterDropdown(false);
  };

  const filteredExpenses = expenses.filter((expense) => {
    const statusMatch = filters.status ? expense.status === filters.status.toUpperCase() : true;
    const categoryMatch = filters.category ? expense.category === filters.category.toUpperCase() : true;
    return statusMatch && categoryMatch;
  });

  if (filters.dateOrder === 'Old to new') {
    filteredExpenses.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (filters.dateOrder === 'New to old') {
    filteredExpenses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  console.log(user);
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isManager={user.isManager}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="flex-1 overflow-hidden">
        <header className="flex items-center justify-between border-b bg-white px-6 py-4">
          <h1 className="text-xl font-semibold">
            {activeTab === 'requests' ? 'My Requests' : 'Approve Requests'}
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
            <h2 className="text-2xl font-semibold">Welcome {user.name},</h2>
            <div className="flex items-center space-x-4">
              {activeTab === 'requests' && (
                <Button variant="primary" onClick={() => setShowExpenseForm(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Expense Request
                </Button>
              )}
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
                    className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                  >
                    <ExpenseFilter 
                      filters={filters}
                      onFilterChange={handleFilterChange}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        
          <Dialog open={showExpenseForm} onOpenChange={setShowExpenseForm}>
            <DialogContent>
              <ExpenseForm
                onSubmit={editingExpense ? handleExpenseUpdate : handleExpenseSubmit}
                editingExpense={editingExpense}
              />
            </DialogContent>
          </Dialog>
        
          <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
            <DialogContent>
              <DialogTitle className="text-lg font-semibold">
                My Profile
              </DialogTitle>
              <div className="mt-4 space-y-2">
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Department:</strong> {user.department}
                </p>
                <p>
                  <strong>Position:</strong> {user.position}
                </p>
                <p>
                  <strong>Role:</strong> {user.role || 'User'}
                </p>
              </div>
            </DialogContent>
          </Dialog>
        
          <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogTitle>Confirm Deletion</DialogTitle>
              <div className="mt-4 space-y-4">
                <p>Are you sure you want to delete this expense request?</p>
                <div className="flex justify-end space-x-2">
                  <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                    Cancel
                  </Button>
                  <Button variant="danger" onClick={confirmDelete}>
                    Delete
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        
          <Dialog open={showAllNotifications} onOpenChange={setShowAllNotifications}>
            <DialogContent>
              <NotificationList
                notifications={notifications}
                onClose={() => setShowAllNotifications(false)}
              />
            </DialogContent>
          </Dialog>
        
          {activeTab === 'requests' && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredExpenses.map((expense) => (
                <ExpenseCard
                  key={expense.id}
                  expense={expense}
                  isApprovalView={false}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        
          {activeTab === 'approvals' && user.isManager && (
            <div className="mt-8">
              {/* <h2 className="text-2xl font-semibold mb-4">Approve Requests</h2> */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {approveRequests.map((expense) => (
                  <ExpenseCard
                    key={expense.id}
                    expense={expense}
                    isApprovalView={true}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/home" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/*" element={
          <AdminRoute>
            <AdminApp />
          </AdminRoute>
        } />
        <Route path="*" element={<Navigate to={isAuthenticated() ? (isAdmin() ? "/admin" : "/home") : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;