import { useState, useRef, useEffect } from 'react';
import { User } from 'lucide-react';

export function UserMenu({ user, onLogout, onViewProfile }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center space-x-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <User className="h-5 w-5" />
        <span>{user.name}</span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
          <div className="py-1">
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                onViewProfile();
                setIsOpen(false);
              }}
            >
              My Profile
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}