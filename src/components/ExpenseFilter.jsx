import { useState, useEffect } from 'react';

const STATUS_OPTIONS = ['Pending', 'Approved', 'Rejected'];
const DATE_ORDER_OPTIONS = ['Old to new', 'New to old'];
const CATEGORY_OPTIONS = ['Travel', 'Electronics', 'Clothes', 'Vehicle', 'Accommodation'];

export function ExpenseFilter({ filters, onFilterChange }) {
  const [status, setStatus] = useState(filters?.status || '');
  const [dateOrder, setDateOrder] = useState(filters?.dateOrder || '');
  const [category, setCategory] = useState(filters?.category || '');

  // Update local state when filters prop changes
  useEffect(() => {
    setStatus(filters?.status || '');
    setDateOrder(filters?.dateOrder || '');
    setCategory(filters?.category || '');
  }, [filters]);

  const handleApplyFilters = () => {
    onFilterChange({ status, dateOrder, category });
  };

  const handleClearFilters = () => {
    setStatus('');
    setDateOrder('');
    setCategory('');
    onFilterChange({ status: '', dateOrder: '', category: '' });
  };

  return (
    <div className="flex flex-col space-y-3 p-4 bg-white rounded-md shadow-sm">
      <h3 className="font-semibold text-gray-800 border-b pb-2">Filter Options</h3>
      
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Date Order</label>
        <select
          value={dateOrder}
          onChange={(e) => setDateOrder(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Default</option>
          {DATE_ORDER_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All</option>
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="flex space-x-2 pt-2">
        <button
          onClick={handleApplyFilters}
          className="flex-1 rounded-md bg-black text-white px-3 py-2 text-sm font-medium hover:bg-gray-800 focus:outline-none"
        >
          Apply
        </button>
        <button
          onClick={handleClearFilters}
          className="flex-1 rounded-md bg-gray-200 text-gray-700 px-3 py-2 text-sm font-medium hover:bg-gray-300 focus:outline-none"
        >
          Clear
        </button>
      </div>
    </div>
  );
}