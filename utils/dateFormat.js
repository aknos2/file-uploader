import { format, formatDistanceToNow, differenceInDays, differenceInCalendarDays } from 'date-fns';

export function formatMessageDates(data) {
  return data.map(file => {
    const createdAtDate = new Date(file.createdAt);
    const uploadedAtDate = new Date(file.uploadedAt);
    const createdDaysAgo = differenceInCalendarDays(new Date(), createdAtDate);
    const uploadedDaysAgo = differenceInDays(new Date(), uploadedAtDate);

    return {
      ...file,
      createdAt:
        createdDaysAgo <= 3
          ? `${createdDaysAgo === 0 ? 'Today' : `${createdDaysAgo} day${createdDaysAgo > 1 ? 's' : ''} ago`}`
          : format(createdAtDate, 'MMM dd, yyyy'),
      uploadedAt:
        uploadedDaysAgo <= 3
          ? formatDistanceToNow(uploadedAtDate, { addSuffix: true }) 
          : format(uploadedAtDate, 'MMM dd, yyyy'),
    };
  });
}
