import { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Dialog, DialogContent, DialogTitle } from './ui/Dialog';

const CATEGORIES = [
  'Travel',
  'Electronics',
  'Clothes',
  'Vehicle',
  'Accommodation'
];

export function ExpenseForm({ onSubmit, onCancel, initialData, showExpenseForm }) {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    receipt: null
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount,
        category: initialData.category,
        description: initialData.description,
        receipt: initialData.receipt || null // Prefill receipt if available
      });
    } else {
      setFormData({
        amount: '',
        category: '',
        description: '',
        receipt: null
      });
    }
  }, [initialData, showExpenseForm]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'receipt') {
      const file = files[0];
      if (file) {
        if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
          setError('Please upload a PDF, JPEG, or PNG file');
          return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          setError('File size must be less than 5MB');
          return;
        }
        setError('');
        setFormData(prev => ({ ...prev, receipt: file }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category || !formData.description || !formData.receipt) {
      setError('All fields are required');
      return;
    }
    setError('');
    setShowConfirm(true);
  };

  const confirmSubmit = () => {
    onSubmit(formData);
    setShowConfirm(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount ($)
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="Enter amount"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select a category</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="Enter description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Receipt
          </label>
          <input
            type="file"
            name="receipt"
            onChange={handleChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
          {formData.receipt && (
            <p className="mt-1 text-sm text-gray-500">
              Current file: {formData.receipt.name || 'Existing file'}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Accepted formats: PDF, JPEG, PNG (max 5MB)
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Submit Request
          </Button>
        </div>
      </form>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Confirm Submission</DialogTitle>
          <div className="mt-4 space-y-4">
            <p>Are you sure you want to submit this expense request?</p>
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button onClick={confirmSubmit}>
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}