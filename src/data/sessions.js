// The trimester's sessions, kept in one place.
// App.vue passes this array down as a prop to two different children:
// HomeView renders it as the schedule table, and ContactForm renders it as
// the radio list of Saturdays. Changing a date here changes it in both.
export const sessions = [
  { id: '2026-09-12', day: 'Saturday 12 September', doors: '4:00pm', where: 'Lower level, MA Car Park', extra: 'Hygiene packs', status: 'Next session', spotsLeft: 3, note: 'next session' },
  { id: '2026-09-26', day: 'Saturday 26 September', doors: '4:00pm', where: 'Lower level, MA Car Park', extra: 'Hot soup, served at the table', status: 'Confirmed', spotsLeft: 5, note: 'soup week' },
  { id: '2026-10-10', day: 'Saturday 10 October', doors: '4:00pm', where: 'Lower level, MA Car Park', extra: 'Double bakery delivery', status: 'Confirmed',  spotsLeft: 2, note: 'double bakery delivery' },
  { id: '2026-10-24', day: 'Saturday 24 October', doors: '4:00pm', where: 'Lower level, MA Car Park', extra: 'Hygiene packs', status: 'Confirmed', spotsLeft: 6, note: '' },
  { id: '2026-11-07', day: 'Saturday 7 November', doors: '3:30pm', where: 'Forecourt outside LC Building', extra: 'Barbecue if it stays dry', status: 'Earlier start', spotsLeft: 8, note: 'earlier start for the barbecue' },
  { id: '2026-11-21', day: 'Saturday 21 November', doors: '4:00pm', where: 'Lower level, MA Car Park', extra: 'Pantry staples, larger limit', status: 'Last before exams', spotsLeft: 4, note: 'last before exams' }
]
