import { addMinutes, format, parse, setHours, setMinutes } from 'date-fns';

export interface Slot {
  date: string;
  time: string;
  remaining: number;
  bookedByUser: boolean;
  venue?: string;
}

export const generateSlots = (
  startTime: string,
  endTime: string,
  interviewDuration: number,
  bufferDuration: number
): string[] => {
  const slots: string[] = [];
  const start = parse(startTime, 'HH:mm', new Date());
  const end = parse(endTime, 'HH:mm', new Date());
  
  let currentTime = start;
  
  while (currentTime < end) {
    const slotEnd = addMinutes(currentTime, interviewDuration);
    slots.push(
      `${format(currentTime, 'HH:mm')}-${format(slotEnd, 'HH:mm')}`
    );
    currentTime = addMinutes(currentTime, interviewDuration + bufferDuration);
  }
  
  return slots;
};

export const formatTimeRange = (timeRange: string): string => {
  const [start, end] = timeRange.split('-');
  const startTime = parse(start, 'HH:mm', new Date());
  const endTime = parse(end, 'HH:mm', new Date());
  return `${format(startTime, 'h:mm a')} - ${format(endTime, 'h:mm a')}`;
};

export const generateDateRange = (startDate: string, endDate: string): string[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates: string[] = [];
  
  let currentDate = start;
  while (currentDate <= end) {
    dates.push(format(currentDate, 'yyyy-MM-dd'));
    currentDate = addMinutes(currentDate, 24 * 60);
  }
  
  return dates;
};
