import { formatTimeRange } from '../utils/slotGenerator'

interface BookedSlotProps {
  slot: {
    date: string
    time: string
    venue: string
  }
  onCancel: () => void
  onReschedule: () => void
}

export default function BookedSlot({ slot, onCancel, onReschedule }: BookedSlotProps) {
  const formattedDate = new Date(slot.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">My Booked Slot</h2>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500">Date</p>
          <p className="font-medium">{formattedDate}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Time</p>
          <p className="font-medium">{formatTimeRange(slot.time)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Venue</p>
          <p className="font-medium">{slot.venue}</p>
        </div>
        <div className="pt-4 flex space-x-3">
          <button
            onClick={onReschedule}
            className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Reschedule
          </button>
          <button
            onClick={onCancel}
            className="inline-flex justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel Booking
          </button>
        </div>
      </div>
    </div>
  )
}
