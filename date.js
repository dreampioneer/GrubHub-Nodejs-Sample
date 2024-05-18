import { DateTime } from 'luxon'

// Date 1
const date1 = DateTime.fromISO('2024-05-17T19:22:31.204Z').setZone('America/New_York');
console.log('date1', date1)
// Date 2 (current date in America/New_York)
const date2 = DateTime.now().setZone('America/New_York');
console.log('date2', date2)
// Calculate the difference
const diff = date2.diff(date1, ['years', 'months', 'days', 'hours', 'minutes', 'seconds']);

// Output the difference
console.log(`Difference: ${diff.toObject().years} years, ${diff.toObject().months} months, ${diff.toObject().days} days, ${diff.toObject().hours} hours, ${diff.toObject().minutes} minutes, ${diff.toObject().seconds} seconds`);