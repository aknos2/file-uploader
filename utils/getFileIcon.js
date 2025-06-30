export function getFileType(extension) {
  const ext = extension.toLowerCase();
  
  const typeMap = {
    // Documents
    'pdf': 'document',
    'doc': 'document',
    'docx': 'document',
    'txt': 'document',
    'rtf': 'document',
    'odt': 'document',
    
    // Spreadsheets
    'xls': 'spreadsheet',
    'xlsx': 'spreadsheet',
    'csv': 'spreadsheet',
    'ods': 'spreadsheet',
    
    // Presentations
    'ppt': 'presentation',
    'pptx': 'presentation',
    'odp': 'presentation',
    
    // Images
    'jpg': 'image',
    'jpeg': 'image',
    'png': 'image',
    'gif': 'image',
    'bmp': 'image',
    'svg': 'image',
    'webp': 'image',
    'ico': 'image',
    'tiff': 'image',
    'tif': 'image',
    
    // Videos
    'mp4': 'video',
    'avi': 'video',
    'mov': 'video',
    'wmv': 'video',
    'flv': 'video',
    'webm': 'video',
    'mkv': 'video',
    '3gp': 'video',
    
    // Audio
    'mp3': 'audio',
    'wav': 'audio',
    'flac': 'audio',
    'aac': 'audio',
    'ogg': 'audio',
    'wma': 'audio',
    'm4a': 'audio',
    
    // Archives
    'zip': 'archive',
    'rar': 'archive',
    '7z': 'archive',
    'tar': 'archive',
    'gz': 'archive',
    'bz2': 'archive',
    
    // Code files
    'js': 'code',
    'html': 'code',
    'css': 'code',
    'php': 'code',
    'py': 'code',
    'java': 'code',
    'cpp': 'code',
    'c': 'code',
    'json': 'code',
    'xml': 'code',
    'sql': 'code',
    'sh': 'code',
    'bat': 'code',
  };
  
  return typeMap[ext] || 'file';
}

export function getFileIcon(fileName, isFolder = false) {
  if (isFolder) {
    return 'fas fa-folder';
  }

  const extension = fileName.split('.').pop().toLowerCase();
  const type = getFileType(extension);
  
  const iconMap = {
    'document': getDocumentIcon(extension),
    'spreadsheet': 'fas fa-file-excel',
    'presentation': 'fas fa-file-powerpoint',
    'image': 'fas fa-file-image',
    'video': 'fas fa-file-video',
    'audio': 'fas fa-file-audio',
    'archive': 'fas fa-file-archive',
    'code': 'fas fa-file-code',
    'file': 'fas fa-file'
  };
  
  return iconMap[type] || 'fas fa-file';
}

function getDocumentIcon(extension) {
  const docIcons = {
    'pdf': 'fas fa-file-pdf',
    'doc': 'fas fa-file-word',
    'docx': 'fas fa-file-word',
    'txt': 'fas fa-file-alt',
    'rtf': 'fas fa-file-alt',
    'odt': 'fas fa-file-alt'
  };
  
  return docIcons[extension] || 'fas fa-file-alt';
}

export function getFileIconColor(fileName, isFolder = false) {
  if (isFolder) {
    return '#FFD700';
  }

  const extension = fileName.split('.').pop().toLowerCase();
  const type = getFileType(extension);
  
  const colorMap = {
    'document': getDocumentColor(extension),
    'spreadsheet': '#217346',
    'presentation': '#D24726',
    'image': '#6F42C1',
    'video': '#DC3545',
    'audio': '#20C997',
    'archive': '#8B4513',
    'code': getCodeColor(extension),
    'file': '#6C757D'
  };
  
  return colorMap[type] || '#6C757D';
}

function getDocumentColor(extension) {
  const docColors = {
    'pdf': '#DC143C',
    'doc': '#2B579A',
    'docx': '#2B579A',
    'txt': '#6C757D',
    'rtf': '#6C757D',
    'odt': '#6C757D'
  };
  
  return docColors[extension] || '#6C757D';
}

function getCodeColor(extension) {
  const codeColors = {
    'js': '#F7DF1E',
    'html': '#E34F26',
    'css': '#1572B6',
    'php': '#777BB4',
    'py': '#3776AB',
    'java': '#ED8B00',
    'cpp': '#00599C',
    'c': '#A8B9CC',
    'json': '#000000',
    'xml': '#FF6600'
  };
  
  return codeColors[extension] || '#6C757D';
}