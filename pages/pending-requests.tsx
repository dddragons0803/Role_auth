import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';

const PendingRequestsPage = () => {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div>
        <h1>Pending Requests</h1>
        {/* List all pending requests for admin review */}
      </div>
    </ProtectedRoute>
  );
};

export default PendingRequestsPage;
