import { event, locationLabel } from './config';
const escapeICS = (value: string) =>
  value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
const utc = (value: string) =>
  new Date(value)
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
function foldLine(line: string) {
  const encoder = new TextEncoder();
  let result = '';
  let bytes = 0;
  for (const char of line) {
    const length = encoder.encode(char).length;
    if (bytes + length > 75) {
      result += '\r\n ';
      bytes = 1;
    }
    result += char;
    bytes += length;
  }
  return result;
}
export function downloadCalendar() {
  const text = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Sofia//Birthday Invitation//UK',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${event.id}@sofia.invitation`,
    `DTSTAMP:${utc(new Date().toISOString())}`,
    `DTSTART:${utc(event.startsAt)}`,
    `DTEND:${utc(event.endsAt)}`,
    `SUMMARY:${escapeICS(event.title)}`,
    `LOCATION:${escapeICS([event.city, locationLabel, event.address].filter(Boolean).join(', '))}`,
    `DESCRIPTION:${escapeICS(event.dressCode + '. ' + event.dressNote)}`,
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ]
    .map(foldLine)
    .join('\r\n');
  const url = URL.createObjectURL(new Blob([text], { type: 'text/calendar;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.id}.ics`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
