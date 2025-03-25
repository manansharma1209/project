import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserCircle, Edit, Trash, Users } from 'lucide-react';
import { Button } from './ui/Button';
import { Dialog, DialogContent, DialogTitle } from './ui/Dialog';

export function UserCard({
  user,
  onEdit,
  onDelete,
  reportees = []
}) {
  const [showReportees, setShowReportees] = useState(false);
  const [reporteeDetails, setReporteeDetails] = useState([]);

  const fetchReporteeDetails = async () => {
    try {
      const loggedInUserWissenID = JSON.parse(localStorage.getItem('user')).wissenID;
      const reporteeDetailsPromises = reportees.map(reporteeWissenId =>
        axios.get('http://localhost:8080/api/users/getReporteeInfo', {
          params: {
            reporteeWissenId: reporteeWissenId
          }
        })
      );
      const responses = await Promise.all(reporteeDetailsPromises);
      const reporteeDetails = responses.map(response => response.data);
      setReporteeDetails(reporteeDetails);
      setShowReportees(true);
    } catch (error) {
      console.error('Error fetching reportee details:', error);
    }
  };

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
            <h3 className="text-lg font-medium">{user.name} {user.wissenID}</h3>
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
          <p className="text-sm text-gray-600 mt-1">Date of Joining: {user.joiningDate}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            onClick={fetchReporteeDetails} // Trigger the fetch function
            className="flex items-center space-x-1 h-8 px-3 py-0"
          >
            <Users className="h-4 w-4" />
            <span>View Reportees</span>
          </Button>
        </div>
      </div>

      <Dialog open={showReportees} onOpenChange={setShowReportees}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Reportees</DialogTitle>
          <div className="mt-4 space-y-4">
            {reporteeDetails.length > 0 ? (
              <div className="max-h-60 overflow-y-auto">
                <table className="w-full table-fixed">
                  <thead>
                    <tr>
                      <th className="text-left pb-2">Name</th>
                      <th className="text-left pb-2">Wissen ID</th>
                      <th className="text-left pb-2">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reporteeDetails.map((reportee) => (
                      <tr key={reportee.wissenID}>
                        <td className="py-2">{reportee.name}</td>
                        <td className="py-2">{reportee.wissenID}</td>
                        <td className="py-2">{reportee.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No reportees found.</p>
            )}
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setShowReportees(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
