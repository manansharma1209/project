import { useState, useEffect } from 'react';
import { UserCircle, Edit, Trash, Users } from 'lucide-react';
import { Button } from './ui/Button';
import { Dialog, DialogContent, DialogTitle } from './ui/Dialog';

export function UserCard({
  user,
  onEdit,
  onDelete,
  subordinates = []
}) {
  const [showSubordinates, setShowSubordinates] = useState(false);

  // Hardcoded subordinate sample data
  const sampleSubordinates = [
    { id: 'WISSEN001', name: 'John Doe', email: 'john.doe@wissen.com' },
    { id: 'WISSEN002', name: 'Jane Smith', email: 'jane.smith@wissen.com' },
    { id: 'WISSEN003', name: 'Alice Johnson', email: 'alice.johnson@wissen.com' }
  ];

  useEffect(() => {
    console.log("Received User Data:", user);
  }, [user]);

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-gray-100 p-3">
            <UserCircle className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.role}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="primary" onClick={() => onEdit?.(user.id)} className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="danger" onClick={() => onDelete?.(user.id)} className="h-8 w-8 p-0">
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <div>
          <p className="text-sm text-gray-600">Manager ID: {user.managerId || 'N/A'}</p>
          <p className="text-sm text-gray-600 mt-1">Date of Joining: {new Date(user.dateOfJoining).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            onClick={() => setShowSubordinates(true)}
            className="flex items-center space-x-1 h-8 px-3 py-0"
          >
            <Users className="h-4 w-4" />
            <span>View Reportees</span>
          </Button>
        </div>
      </div>

      {/* Subordinates Dialog */}
      <Dialog open={showSubordinates} onOpenChange={setShowSubordinates}>
        <DialogContent className="sm:max-w-[600px]"> {/* Increased width */}
          <DialogTitle>Subordinates</DialogTitle>
          <div className="mt-4 space-y-4">
            {sampleSubordinates.length > 0 ? (
              <div className="max-h-60 overflow-y-auto">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-2 w-1/4">Wissen ID</th>
                      <th className="text-left pb-2 w-1/3">Name</th>
                      <th className="text-left pb-2 w-1/3">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleSubordinates.map((subordinate) => (
                      <tr key={subordinate.id} className="border-b">
                        <td className="py-2">{subordinate.id}</td>
                        <td className="py-2">{subordinate.name}</td>
                        <td className="py-2">{subordinate.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No subordinates found.</p>
            )}
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setShowSubordinates(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
