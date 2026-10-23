export const event = {
  id: 'sofia-2026-11-14',
  name: 'Софія',
  nameGenitive: 'Софії',
  nameAccusative: 'Софію',
  title: 'День народження Софії',
  startsAt: '2026-11-14T19:00:00+02:00',
  endsAt: '2026-11-15T00:00:00+02:00',
  timeZone: 'Europe/Kyiv',
  city: 'Київ',
  venue: '',
  address: '',
  routeUrl: '',
  rsvpDeadline: '2026-11-07',
  dressCode: 'Твоє вечірнє альтер его',
  dressNote: 'Чорне, червоне, трохи блиску. Або просто те, в чому ти — це ти.',
  allowPlusOne: false,
  message:
    'Хочу зібрати за одним столом тих, з ким добре бути собою. Обійматися, загадувати бажання, танцювати й робити трохи розмиті фото. І дуже хочу, щоб ти був / була поруч.',
  secret:
    'Найкращий подарунок — ти на танцполі. А ще: готуй улюблений трек. Цієї ночі кожен трохи діджей.',
  schedule: [
    { time: '19:00', title: 'Перші обійми', detail: 'Знайомі обличчя, келихи та розмови.' },
    { time: '20:00', title: 'Всі за стіл', detail: 'Смачно їмо. Голосно сміємося.' },
    { time: '21:00', title: 'Те саме бажання', detail: 'Свічки, торт і фото зі спалахом.' },
    { time: '22:00', title: 'Танці без плану', detail: 'Улюблені треки. Ще один. І ще один.' },
  ],
  photos: [
    {
      src: '/images/cake.jpg',
      title: 'Одне бажання',
      caption: 'І трошки більше вишень.',
      position: '50% 62%',
    },
    {
      src: '/images/cheers.jpg',
      title: 'За нас',
      caption: 'За зустрічі, які хочеться повторити.',
      position: '50% 50%',
    },
    {
      src: '/images/cake.jpg',
      title: 'Після опівночі',
      caption: 'Коли найкраще тільки починається.',
      position: '80% 90%',
    },
  ],
};
export const dateLabel = (date = event.startsAt) =>
  new Intl.DateTimeFormat('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: event.timeZone,
  })
    .format(new Date(date))
    .replace(' р.', '');
export const timeLabel = new Intl.DateTimeFormat('uk-UA', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: event.timeZone,
}).format(new Date(event.startsAt));
export const shortDate = new Intl.DateTimeFormat('uk-UA', {
  day: '2-digit',
  month: '2-digit',
  timeZone: event.timeZone,
}).format(new Date(event.startsAt));
export const locationLabel = event.venue || 'Локацію повідомимо окремо';
export const routeUrl = (() => {
  try {
    const url = new URL(event.routeUrl);
    return event.venue && url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
})();

export const weekdayLabel = new Intl.DateTimeFormat('uk-UA', {
  weekday: 'long',
  timeZone: event.timeZone,
}).format(new Date(event.startsAt));
export const eventYear = new Intl.DateTimeFormat('uk-UA', {
  year: 'numeric',
  timeZone: event.timeZone,
}).format(new Date(event.startsAt));
