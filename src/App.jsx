import { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { UserMenu } from './components/UserMenu';
import { ExpenseCard } from './components/ExpenseCard';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from './components/ui/Dialog';
import { Button } from './components/ui/Button';
import { PlusCircle, Filter } from 'lucide-react';
import { ExpenseForm } from './components/ExpenseForm';
import { NotificationIcon } from './components/NotificationIcon';
import { NotificationList } from './components/NotificationList';
import { ExpenseFilter } from './components/ExpenseFilter';

// Mock data - replace with actual API calls
const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  isManager: true,
  department: 'Engineering',
  position: 'Senior Developer',
};

const mockExpenses = [
  {
    id: '1',
    userId: '1',
    userName: 'Jane Smith',
    category: 'TRAVEL',
    amount: 1200,
    description: 'Flight tickets for conference',
    status: 'PENDING',
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z',
    receipt: new Blob(), // Mock receipt file
  },
  // Add more mock expenses as needed
];

const mockNotifications = [
  {
    id: '1',
    userId: '1',
    message: 'Your expense request has been approved.',
    createdAt: '2024-03-11T10:00:00Z',
  },
  {
    id: '2',
    userId: '1',
    message: 'Your expense request has been rejected. Reason: Insufficient funds.',
    createdAt: '2024-03-12T10:00:00Z',
  }
  // Add more mock notifications as needed
];

function App() {
  const [activeTab, setActiveTab] = useState('requests');
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expenses, setExpenses] = useState(mockExpenses);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState(null);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [filters, setFilters] = useState({ status: '', dateOrder: '', category: '' });
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const filterButtonRef = useRef(null);
  const filterDropdownRef = useRef(null);

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
    // Implement logout logic
    console.log('Logging out...');
  };

  const handleApprove = async (id) => {
    // Implement approve logic
    console.log('Approving request:', id);
    // Mock API call to update expense status
    const updatedExpenses = expenses.map(expense =>
      expense.id === id ? { ...expense, status: 'APPROVED' } : expense
    );
    setExpenses(updatedExpenses);

    // Mock API call to add notification
    const newNotification = {
      id: String(Date.now()),
      userId: id,
      message: 'Your expense request has been approved.',
      createdAt: new Date().toISOString(),
    };
    setNotifications([newNotification, ...notifications]);
  };

  const handleReject = async (id, reason) => {
    // Implement reject logic
    console.log('Rejecting request:', id, 'Reason:', reason);
    // Mock API call to update expense status
    const updatedExpenses = expenses.map(expense =>
      expense.id === id ? { ...expense, status: 'REJECTED' } : expense
    );
    setExpenses(updatedExpenses);

    // Mock API call to add notification
    const newNotification = {
      id: String(Date.now()),
      userId: id,
      message: `Your expense request has been rejected. Reason: ${reason}`,
      createdAt: new Date().toISOString(),
    };
    setNotifications([newNotification, ...notifications]);
  };

  const handleExpenseSubmit = (formData) => {
    // Here you would typically make an API call to submit the expense
    const newExpense = {
      id: String(Date.now()),
      userId: mockUser.id,
      userName: mockUser.name,
      category: formData.category.toUpperCase(),
      amount: parseFloat(formData.amount),
      description: formData.description,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      receipt: formData.receipt,
    };

    setExpenses([newExpense, ...expenses]);
    setShowExpenseForm(false);
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

  const confirmDelete = () => {
    setExpenses(expenses.filter(expense => expense.id !== deletingExpenseId));
    setShowDeleteConfirm(false);
    setDeletingExpenseId(null);
  };

  const handleExpenseUpdate = (formData) => {
    setExpenses(expenses.map(expense => 
      expense.id === editingExpense.id ? { ...expense, ...formData } : expense
    ));
    setEditingExpense(null);
    setShowExpenseForm(false);
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

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isManager={mockUser.isManager}
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
              user={mockUser}
              onLogout={handleLogout}
              onViewProfile={() => setShowProfileDialog(true)}
            />
          </div>
        </header>

        <main className="h-[calc(100vh-4rem)] overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Welcome {mockUser.name},</h2>
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
                onSubmit={handleExpenseSubmit}
                onUpdate={handleExpenseUpdate}
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
                  <strong>Name:</strong> {mockUser.name}
                </p>
                <p>
                  <strong>Email:</strong> {mockUser.email}
                </p>
                <p>
                  <strong>Department:</strong> {mockUser.department}
                </p>
                <p>
                  <strong>Position:</strong> {mockUser.position}
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

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredExpenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                userName={expense.userName}
                isApprovalView={activeTab === 'approvals'}
                onApprove={handleApprove}
                onReject={handleReject}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;