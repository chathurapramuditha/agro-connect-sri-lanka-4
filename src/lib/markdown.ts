// Utility functions for handling markdown content

export const cleanMarkdown = (text: string): string => {
  return text
    // Remove headers (##, ###, etc.)
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold formatting (**)
    .replace(/\*\*(.*?)\*\*/g, '$1')
    // Remove italic formatting (*) 
    .replace(/\*(.*?)\*/g, '$1')
    // Remove bullet points (-)
    .replace(/^-\s+/gm, '')
    // Remove horizontal rules (---)
    .replace(/^---$/gm, '')
    // Remove any remaining markdown symbols
    .replace(/[#*_`~]/g, '')
    // Clean up extra whitespace
    .replace(/\n\s*\n/g, '\n')
    .trim();
};

export const convertMarkdownToHtml = (text: string): string => {
  return text
    // Convert headers
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    // Convert bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Convert italic text
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Convert bullet points
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    // Convert line breaks
    .replace(/\n/g, '<br>')
    // Wrap consecutive <li> elements in <ul>
    .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
    // Clean up nested ul tags
    .replace(/<\/ul>\s*<ul>/g, '');
};

export const extractExcerpt = (text: string, maxLength: number = 150): string => {
  const cleaned = cleanMarkdown(text);
  if (cleaned.length <= maxLength) return cleaned;
  
  // Find the last space before the max length to avoid cutting words
  const truncated = cleaned.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return truncated.substring(0, lastSpace) + '...';
};