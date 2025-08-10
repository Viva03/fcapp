import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { Slot, generateSlots, generateDateRange, formatTimeRange } from '../utils/slotGenerator';
import BookingConfirmation from '../components/BookingConfirmation';
import BookedSlot from '../components/BookedSlot';

export default function DashboardPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [bookedSlot, setBookedSlot] = useState<Slot | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const generateAllSlots = () => {
      const dates = generateDateRange('2025-08-18', '2025-08-23');
      const timeSlots = generateSlots('17:00', '19:00', 10, 5);
      
      const allSlots: Slot[] = [];
      dates.forEach(date => {
        timeSlots.forEach(time => {
          allSlots.push({
            date,
            time,
            remaining: 14,
            bookedByUser: false
          });
        });
      });
      
      return allSlots;
    };

    const fetchSlots = async () => {
      try {
        await api.getSlots(); // Mock API call
        setSlots(generateAllSlots());
      } catch (err) {
        setError('Failed to load slots');
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/');
  };

  const handleSlotClick = (slot: Slot) => {
    setSelectedSlot(slot);
    setIsConfirmationOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot) return;

    try {
      setLoading(true);
      const response = await api.bookSlot(selectedSlot.date, selectedSlot.time);
      if (response.success) {
        // Update the slots list to mark this slot as booked
        setSlots(slots.map(slot => 
          slot.date === selectedSlot.date && slot.time === selectedSlot.time
            ? { ...slot, bookedByUser: true, remaining: slot.remaining - 1 }
            : slot
        ));
        setBookedSlot({ ...selectedSlot, venue: 'BEL 605' });
        setIsConfirmationOpen(false);
      }
    } catch (err) {
      setError('Failed to book slot');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!bookedSlot) return;

    try {
      setLoading(true);
      const response = await api.cancelBooking(bookedSlot.date, bookedSlot.time);
      if (response.success) {
        // Update the slots list to mark this slot as available
        setSlots(slots.map(slot => 
          slot.date === bookedSlot.date && slot.time === bookedSlot.time
            ? { ...slot, bookedByUser: false, remaining: slot.remaining + 1 }
            : slot
        ));
        setBookedSlot(null);
      }
    } catch (err) {
      setError('Failed to cancel booking');
    } finally {
      setLoading(false);
    }
  };

  const handleReschedule = async () => {
    await handleCancelBooking();
    // The user can now select a new slot
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img
              src="/src/assets/logo.jpg"
              alt="Founders Club Logo"
              className="h-8 w-auto"
            />
            <h1 className="text-2xl font-bold text-gray-900">Founders Club</h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {bookedSlot && (
            <BookedSlot
              slot={bookedSlot}
              onCancel={handleCancelBooking}
              onReschedule={handleReschedule}
            />
          )}

          <BookingConfirmation
            isOpen={isConfirmationOpen}
            onClose={() => setIsConfirmationOpen(false)}
            onConfirm={handleConfirmBooking}
            slot={selectedSlot}
          />
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Interview Details</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Dates: August 18, 2025 – August 23, 2025</p>
              <p>Time: 5:00 PM to 7:00 PM</p>
              <p>Slot Duration: 10 minutes (plus 5 min buffer)</p>
              <p>Venue: BEL 605</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading slots...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {generateDateRange('2025-08-18', '2025-08-23').map((date) => (
                <div key={date} className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b">
                    <h3 className="text-lg font-medium text-gray-900">
                      {new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
                    {slots
                      .filter(slot => slot.date === date)
                      .map((slot) => (
                        <button
                          key={`${slot.date}-${slot.time}`}
                          onClick={() => handleSlotClick(slot)}
                          disabled={slot.remaining === 0 || slot.bookedByUser}
                          className={`p-4 rounded-md text-left ${
                            slot.bookedByUser
                              ? 'bg-black text-white'
                              : slot.remaining === 0
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'border border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <p className="font-medium">{formatTimeRange(slot.time)}</p>
                          <p className="text-sm mt-1">
                            {slot.bookedByUser
                              ? 'Booked by you'
                              : slot.remaining === 0
                              ? 'Full'
                              : `${slot.remaining} spots left`}
                          </p>
                        </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
