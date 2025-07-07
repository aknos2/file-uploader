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
      createdAtRaw: createdAtDate.toISOString(),
      uploadedAt:
        uploadedDaysAgo <= 3
          ? formatDistanceToNow(uploadedAtDate, { addSuffix: true }) 
          : format(uploadedAtDate, 'MMM dd, yyyy'),
      uploadedAtRaw: uploadedAtDate.toISOString(),
      size: formatFileSize(file.size),
    };
  });
}

export function formatFolderData(folders) {
  return folders.map(folder => {
    const createdAtDate = new Date(folder.createdAt);
    const uploadedAtDate = new Date(folder.uploadedAt || folder.createdAt);
    const createdDaysAgo = differenceInCalendarDays(new Date(), createdAtDate);
    const uploadedDaysAgo = differenceInDays(new Date(), uploadedAtDate);
    const totalSize = calculateFolderSize(folder.data);

    return {
      ...folder,
      createdAt:
        createdDaysAgo <= 3
          ? `${createdDaysAgo === 0 ? 'Today' : `${createdDaysAgo} day${createdDaysAgo > 1 ? 's' : ''} ago`}`
          : format(createdAtDate, 'MMM dd, yyyy'),
      createdAtRaw: createdAtDate.toISOString(),
      uploadedAt:
        uploadedDaysAgo <= 3
          ? formatDistanceToNow(uploadedAtDate, { addSuffix: true }) 
          : format(uploadedAtDate, 'MMM dd, yyyy'),
      uploadedAtRaw: uploadedAtDate.toISOString(),
      size: formatFileSize(totalSize),

      // format files inside the folder
      data: formatFileData(folder.data || []),
      totalSize: totalSize,
    };
  });
}

function calculateFolderSize(files) {
  return files.reduce((total, file) => total + (file.size || 0), 0);
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
