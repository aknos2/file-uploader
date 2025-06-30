import { format, formatDistanceToNow, differenceInDays, differenceInCalendarDays } from 'date-fns';

export function formatFileData(data) {
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
      size: formatFileSize(file.size),
    };
  });
}

function formatFileSize(bytes) {
  const kb = bytes / 1024;
  const mb = kb / 1024;
  const gb = mb / 1024;

  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (kb < 1024) {
    return `${kb.toFixed(2)} KB`;
  } else if (mb < 1024) {
    return `${mb.toFixed(2)} MB`;
  } else {
    return `${gb.toFixed(2)} GB`;
  }
}
