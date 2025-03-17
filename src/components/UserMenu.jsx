import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { LogOut, User as UserIcon } from 'lucide-react';

export function UserMenu({ user, onLogout, onViewProfile }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="flex items-center space-x-2 rounded-lg p-2 hover:bg-gray-100">
        <UserIcon className="h-5 w-5" />
        <span>{user.name}</span>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content className="mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
        <DropdownMenu.Item
          className="flex cursor-pointer items-center space-x-2 rounded-md p-2 outline-none hover:bg-gray-100"
          onClick={onViewProfile}
        >
          <UserIcon className="h-4 w-4" />
          <span>My Profile</span>
        </DropdownMenu.Item>

        <DropdownMenu.Item
          className="flex cursor-pointer items-center space-x-2 rounded-md p-2 text-red-600 outline-none hover:bg-red-50"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}