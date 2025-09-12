import React from 'react';
import './../styles/PersonalDetails.css';

const PersonalDetails = () => {
  // This data would typically come from your auth context or API
  const user = {
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    memberSince: '2023-01-15',
  };

  return (
    <div className="personal-details-card">
      <h3>Personal Information</h3>
      <div className="details-grid">
        <div className="detail-item">
          <span className="detail-label">Name:</span>
          <span className="detail-value">{user.name}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Email:</span>
          <span className="detail-value">{user.email}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Member Since:</span>
          <span className="detail-value">{user.memberSince}</span>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
