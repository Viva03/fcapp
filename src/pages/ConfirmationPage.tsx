import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../utils/api';
import { formatTimeRange } from '../utils/slotGenerator';

interface LocationState {
  date: string;
  time: string;
  venue: string;
}

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  useEffect(() => {
    if (!state?.date || !state?.time) {
      navigate('/dashboard');
    }
  }, [state, navigate]);

  if (!state) return null;

  const handleCancel = async () => {
    try {
      const response = await api.cancelBooking(state.date, state.time);
      if (response.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      // Handle error
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Interview Slot Confirmed
            </h2>
            <div className="h-px bg-gray-200 my-6"></div>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="text-lg font-medium">
                {new Date(state.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Time</p>
              <p className="text-lg font-medium">{formatTimeRange(state.time)}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Venue</p>
              <p className="text-lg font-medium">{state.venue}</p>
            </div>
          </div>
          
          <div className="mt-8 space-y-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Back to Dashboard
            </button>
            
            <button
              onClick={handleCancel}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
