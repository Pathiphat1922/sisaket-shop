import React from 'react';
import { DonationSummary as IDonationSummary } from '../types/payment';

interface Props {
  summary: IDonationSummary;
}

export const DonationSummary: React.FC<Props> = ({ summary }) => {
  return (
    <div className="donation-summary">
      <h2>สรุปยอดการบริจาค</h2>
      <div className="summary-content">
        <p className="description">{summary.description}</p>
        <div className="amount-box">
          <span className="label">ยอดรวม:</span>
          <span className="amount">{summary.amount.toLocaleString('th-TH')} บาท</span>
        </div>
      </div>
    </div>
  );
};
