import { useState } from 'react';
import { Check, X, Edit, Trash, Eye } from 'lucide-react';
import { getCategoryIcon } from '../lib/utils';
import { Button } from './ui/Button';
import { Dialog, DialogContent, DialogTitle } from './ui/Dialog';

export function ExpenseCard({
  expense,
  userName,
  isApprovalView,
  onApprove,
  onReject,
  onEdit,
  onDelete,
}) {
  const [showReceipt, setShowReceipt] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const Icon = getCategoryIcon(expense.category);

  const handleReject = () => {
    onReject(expense.id, rejectionReason);
    setShowRejectConfirm(false);
    setRejectionReason('');
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-gray-100 p-3">
            <Icon className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium">{expense.category}</h3>
            <p className="text-sm text-gray-500">
              ${expense.amount}
            </p>
            {isApprovalView && (
              <p className="text-sm text-gray-500">Submitted by: {expense.user.name}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isApprovalView && expense.status === 'PENDING' && (
            <>
              <Button
                variant="success"
                onClick={() => setShowApproveConfirm(true)}
                className="h-8 w-8 p-0"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="danger"
                onClick={() => setShowRejectConfirm(true)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
          {!isApprovalView && (
            <>
              <Button
                variant="primary"
                onClick={() => onEdit?.(expense.id)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="danger"
                onClick={() => onDelete?.(expense.id)}
                className="h-8 w-8 p-0"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-600">{expense.description}</p>
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <span>Created: {new Date(expense.createdAt).toLocaleDateString()}</span>
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            onClick={() => setShowReceipt(true)}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <span className="rounded-full bg-gray-100 px-3 py-1">
            {expense.status}
          </span>
        </div>
      </div>

      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Receipt</DialogTitle>
          <div className="mt-4 space-y-4">
            <p>Receipt for {expense.category} expense:</p>
            <img src={`data:image/png;base64,${expense.receipt}`} alt="Receipt" className="w-full h-auto" />
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setShowReceipt(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showApproveConfirm} onOpenChange={setShowApproveConfirm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Confirm Approval</DialogTitle>
          <div className="mt-4 space-y-4">
            <p>Are you sure you want to approve this expense request?</p>
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setShowApproveConfirm(false)}>
                Cancel
              </Button>
              <Button variant="success" onClick={() => onApprove(expense.id)}>
                Approve
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showRejectConfirm} onOpenChange={setShowRejectConfirm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Confirm Rejection</DialogTitle>
          <div className="mt-4 space-y-4">
            <p>Are you sure you want to reject this expense request?</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setShowRejectConfirm(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleReject}>
                Reject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}