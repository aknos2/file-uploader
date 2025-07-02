export function formatFileSize(sizeInKB) {
  if (sizeInKB > 1000) {
    const sizeInMB =  sizeInKB / 1024;
    return `${sizeInMB.toFixed(2)}MB`
  }
  return `${sizeInKB}KB`;
}