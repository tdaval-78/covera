/**
 * Extract text from PDF files (client-side using PDF.js)
 * For server-side, we'd need a proper PDF parsing library
 */

export async function extractTextFromPDF(file: File): Promise<string> {
  // Load PDF.js dynamically
  const pdfjsLib = await import('pdfjs-dist');
  
  // Set worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: unknown) => {
        const textItem = item as { str?: string };
        return textItem.str || '';
      })
      .join(' ');
    fullText += `\n--- Page ${i} ---\n${pageText}`;
  }
  
  return fullText;
}

export async function extractTextFromImage(file: File): Promise<string> {
  // Use OCR-like approach via MiniMax vision
  // The actual OCR will happen in the AI call
  const formData = new FormData();
  formData.append('file', file);
  
  // Return a placeholder - actual vision analysis happens in the AI call
  return `[Image: ${file.name}]`;
}
