import { useState } from 'react';
import { Menu, PenSquare, ClipboardCheck } from 'lucide-react';
import { cn } from '../lib/utils';

export function Sidebar({ isManager, activeTab, onTabChange }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        'h-screen bg-gray-900 text-white transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex items-center justify-between p-4">
        <div className={cn('flex items-center space-x-2', isCollapsed && 'hidden')}>
          <PenSquare className="h-6 w-6" />
          <span className="text-xl font-bold">ERS</span>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-lg p-2 hover:bg-gray-800"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <nav className="mt-8 space-y-2 px-2">
        <button
          onClick={() => onTabChange('requests')}
          className={cn(
            'flex w-full items-center space-x-2 rounded-lg p-3 transition-colors',
            activeTab === 'requests' ? 'bg-gray-800' : 'hover:bg-gray-800'
          )}
        >
          <PenSquare className="h-5 w-5" />
          {!isCollapsed && <span>My Requests</span>}
        </button>

        {isManager && (
          <button
            onClick={() => onTabChange('approvals')}
            className={cn(
              'flex w-full items-center space-x-2 rounded-lg p-3 transition-colors',
              activeTab === 'approvals' ? 'bg-gray-800' : 'hover:bg-gray-800'
            )}
          >
            <ClipboardCheck className="h-5 w-5" />
            {!isCollapsed && <span>Approve Requests</span>}
          </button>
        )}
      </nav>
    </div>
  );
}