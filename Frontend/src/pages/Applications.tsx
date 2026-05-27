import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export default function Applications() {
  const [form, setForm] = useState({ date: '', loan_type: '', amount: '', status: 'Pending', applicant_age: '', gender: '', season: '' });
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const queryClient = useQueryClient();

  const { data: apps } = useQuery({
    queryKey: ['applications'],
    queryFn: () => axios.get('http://localhost:6000/api/applications').then(r => r.data)
  });

  const addMutation = useMutation({
    mutationFn: (newApp: any) => axios.post('http://localhost:6000/api/applications', newApp),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['applications'] });
      setSubmitMessage({ type: 'success', text: 'Application submitted successfully.' });
    },
    onError: () => {
      setSubmitMessage({ type: 'error', text: 'Failed to submit application. Please try again.' });
    }
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Loan Applications</h1>
      
      {/* Add New Form */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="font-semibold mb-4">New Application</h2>
        <div className="grid grid-cols-2 gap-4">
          <input type="date" onChange={e => setForm({...form, date: e.target.value})} className="border p-3 rounded" />
          <input placeholder="Loan Type" onChange={e => setForm({...form, loan_type: e.target.value})} className="border p-3 rounded" />
          <input type="number" placeholder="Amount" onChange={e => setForm({...form, amount: e.target.value})} className="border p-3 rounded" />
          <select onChange={e => setForm({...form, gender: e.target.value})} className="border p-3 rounded">
            <option value="">Gender</option><option>Male</option><option>Female</option>
          </select>
        </div>
        <button
          onClick={() => {
            if (addMutation.isPending) return;
            setSubmitMessage(null);
            addMutation.mutate(form);
          }}
          disabled={addMutation.isPending}
          aria-busy={addMutation.isPending}
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          style={addMutation.isPending ? { opacity: 0.7, cursor: 'not-allowed' } : undefined}
        >
          {addMutation.isPending ? 'Submitting...' : 'Submit Application'}
        </button>
        {submitMessage && (
          <p
            role="status"
            aria-live="polite"
            style={{
              marginTop: '0.75rem',
              fontWeight: 600,
              color: submitMessage.type === 'success' ? '#166534' : '#991b1b'
            }}
          >
            {submitMessage.text}
          </p>
        )}
      </div>

      {/* Applications Table */}
      <table className="w-full bg-white rounded-xl shadow">
        <thead><tr className="bg-gray-100">
          <th className="p-4 text-left">Date</th><th>Loan Type</th><th>Amount</th><th>Age</th><th>Gender</th><th>Status</th>
        </tr></thead>
        <tbody>
          {apps?.map((app: any) => (
            <tr key={app.id} className="border-t">
              <td className="p-4">{app.date}</td>
              <td>{app.loan_type}</td>
              <td>${app.amount.toLocaleString()}</td>
              <td>{app.applicant_age}</td>
              <td>{app.gender}</td>
              <td><span className={`px-3 py-1 rounded-full text-sm ${app.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{app.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
