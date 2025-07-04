export function fixDoubleUTF8Encoding(str) {
  try {
    // Convert the string to bytes as if it were latin1, then decode as UTF-8
    const bytes = Buffer.from(str, 'latin1');
    return bytes.toString('utf8');
  } catch (error) {
    console.warn('Failed to fix encoding, using original string:', error);
    return str;
  }
}