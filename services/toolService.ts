import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import * as mammothLib from 'mammoth';
import * as docxLib from 'docx';
import { FileState, ProcessingResult } from '../types';

// --- Library Initialization Fixes ---

// Fix PDF.js Worker
const pdfJs = (pdfjsLib as any).default || pdfjsLib;
try {
  if (typeof window !== 'undefined' && pdfJs) {
    // Explicitly check structure before assignment to avoid "Cannot set properties of undefined"
    if (!pdfJs.GlobalWorkerOptions) {
      pdfJs.GlobalWorkerOptions = {};
    }
    // Use cdnjs for the worker to ensure correct MIME type and CORS headers
    pdfJs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
  }
} catch (e) {
  console.warn("Failed to set PDF Worker", e);
}

// Handle module imports that might be nested in default
const mammoth = (mammothLib as any).default || mammothLib;
const docx = (docxLib as any).default || docxLib;
// --- Helpers ---

const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// --- Main Processing Switch ---

export const processFiles = async (toolId: string, files: FileState[], options?: any): Promise<ProcessingResult> => {
  try {
    if (!files || files.length === 0) {
      throw new Error("No files provided");
    }

    switch (toolId) {
      // PDF Creation
      case 'img-to-pdf':
        return await imageToPdf(files);
      case 'text-to-pdf':
        return await textToPdf(files[0].file);

      // PDF Modification (pdf-lib)
      case 'pdf-merge':
        return await mergePdfs(files);
      case 'pdf-split':
        return await splitPdf(files[0].file);
      case 'pdf-layout':
        return await layoutPdf(files[0].file, options?.layoutMode);
      case 'pdf-watermark':
        return await watermarkPdf(
          files[0].file,
          options?.watermarkText,
          options?.watermarkPosition,
          options?.watermarkFont,
          options?.watermarkColor,
          options?.watermarkOpacity
        );
      case 'pdf-lock':
        return await lockPdf(files[0].file, options?.password);

      // PDF Extraction (pdf.js)
      case 'pdf-to-img':
        return await pdfToImages(files[0].file);
      case 'pdf-to-text':
        return await pdfToText(files[0].file);

      // Word Tools (mammoth + docx)
      case 'word-to-text':
        return await wordToText(files[0].file);
      case 'word-to-pdf':
        return await wordToPdf(files[0].file);
      case 'word-merge':
        return await mergeWords(files);
      case 'pdf-to-word':
        return await pdfToWord(files[0].file);
      case 'word-watermark':
        return await watermarkWord(
          files[0].file,
          options?.watermarkText,
          options?.watermarkPosition,
          options?.watermarkFont,
          options?.watermarkColor,
          options?.watermarkOpacity
        );

      // Utilities - Removed
      // case 'image-convert': ...
      // case 'zip-tool': ...
      // case 'text-format': ...

      default:
        await new Promise(r => setTimeout(r, 1000));
        return {
          success: true,
          downloadUrl: '#',
          downloadName: `demo_result.txt`,
          message: 'Tool under maintenance.'
        };
    }
  } catch (error: any) {
    console.error("Processing Error:", error);
    return { success: false, message: error.message || 'Processing failed.' };
  }
};

// --- Implementations ---

// 1. Image to PDF
const imageToPdf = async (files: FileState[]): Promise<ProcessingResult> => {
  const JsPDFCtor = (jsPDF as any).jsPDF || jsPDF;
  const doc = new JsPDFCtor();

  for (let i = 0; i < files.length; i++) {
    const file = files[i].file;
    const dataUrl = await readFileAsDataURL(file);
    const img = await loadImage(dataUrl);

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const imgRatio = img.width / img.height;

    let finalWidth = pageWidth;
    let finalHeight = pageWidth / imgRatio;

    if (finalHeight > pageHeight) {
      finalHeight = pageHeight;
      finalWidth = pageHeight * imgRatio;
    }

    if (i > 0) doc.addPage();
    doc.addImage(img, 'JPEG', (pageWidth - finalWidth) / 2, (pageHeight - finalHeight) / 2, finalWidth, finalHeight);
  }

  const blob = doc.output('blob');
  return {
    success: true,
    downloadUrl: URL.createObjectURL(blob),
    downloadName: 'images_converted.pdf'
  };
};

// 2. PDF Merge
const mergePdfs = async (files: FileState[]): Promise<ProcessingResult> => {
  const mergedPdf = await PDFDocument.create();

  for (const fileState of files) {
    const arrayBuffer = await readFileAsArrayBuffer(fileState.file);
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const pdfBytes = await mergedPdf.save();
  const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });

  return {
    success: true,
    downloadUrl: URL.createObjectURL(blob),
    downloadName: 'merged_document.pdf'
  };
};

// 3. PDF Split
const splitPdf = async (file: File): Promise<ProcessingResult> => {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const zip = new JSZip();

  const numPages = pdfDoc.getPageCount();

  for (let i = 0; i < numPages; i++) {
    const subDoc = await PDFDocument.create();
    const [copiedPage] = await subDoc.copyPages(pdfDoc, [i]);
    subDoc.addPage(copiedPage);
    const pdfBytes = await subDoc.save();
    zip.file(`page_${i + 1}.pdf`, pdfBytes);
  }

  const content = await zip.generateAsync({ type: 'blob' });
  return {
    success: true,
    downloadUrl: URL.createObjectURL(content),
    downloadName: `${file.name.replace('.pdf', '')}_split.zip`
  };
};

// 4. PDF Layout (N-up)
const layoutPdf = async (file: File, mode: string = '2'): Promise<ProcessingResult> => {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const newPdf = await PDFDocument.create();

  const pages = pdfDoc.getPages();
  const pageCount = pages.length;
  const pagesPerSheet = parseInt(mode);

  // A4 size
  const width = 595.28;
  const height = 841.89;

  for (let i = 0; i < pageCount; i += pagesPerSheet) {
    const newPage = newPdf.addPage([width, height]);

    for (let j = 0; j < pagesPerSheet; j++) {
      if (i + j >= pageCount) break;

      const [embeddedPage] = await newPdf.embedPdf(pdfDoc, [i + j]);
      const scale = pagesPerSheet === 2 ? 0.65 : 0.45;

      let x = 0, y = 0;

      if (pagesPerSheet === 2) {
        // 2-up: Top and Bottom
        x = (width - embeddedPage.width * scale) / 2;
        y = j === 0 ? height / 2 + 20 : 20;
      } else {
        // 4-up: Grid
        const col = j % 2;
        const row = Math.floor(j / 2);
        x = col === 0 ? 20 : width / 2 + 10;
        y = row === 0 ? height / 2 + 10 : 20;
      }

      newPage.drawPage(embeddedPage, {
        x,
        y,
        width: embeddedPage.width * scale,
        height: embeddedPage.height * scale,
      });
    }
  }

  const pdfBytes = await newPdf.save();
  const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
  return {
    success: true,
    downloadUrl: URL.createObjectURL(blob),
    downloadName: `layout_${mode}up.pdf`
  };
};



// 6. PDF Watermark
const watermarkPdf = async (
  file: File,
  text: string = 'CONFIDENTIAL',
  position: string = 'middle',
  fontName: string = 'Helvetica',
  colorHex: string = '#FF0000',
  opacity: number = 0.3
): Promise<ProcessingResult> => {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();

  // Helper to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : { r: 0, g: 0, b: 0 };
  };

  let embeddedFont: any;
  let standardFont = StandardFonts.Helvetica;
  if (fontName === 'Times Roman') standardFont = StandardFonts.TimesRoman;
  if (fontName === 'Courier') standardFont = StandardFonts.Courier;
  embeddedFont = await pdfDoc.embedFont(standardFont);

  pages.forEach(page => {
    const { width, height } = page.getSize();
    let x = 0;
    let y = 0;

    const textSize = 50;
    const textWidth = embeddedFont.widthOfTextAtSize(text, textSize);
    const textHeight = embeddedFont.heightAtSize(textSize);

    x = width / 2 - textWidth / 2;
    y = height / 2 - textHeight / 2;

    if (position === 'top') y = height - 100;
    else if (position === 'bottom') y = 100;

    const rgbColor = hexToRgb(colorHex);

    page.drawText(text, {
      x,
      y,
      size: textSize,
      font: embeddedFont,
      color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
      opacity: opacity,
      rotate: degrees(0), // Straight
    });
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
  return {
    success: true,
    downloadUrl: URL.createObjectURL(blob),
    downloadName: 'watermarked.pdf'
  };
};

// 7. PDF Lock (Password)
// 7. PDF Lock (Password)
const lockPdf = async (file: File, password?: string): Promise<ProcessingResult> => {
  if (!password) {
    return { success: false, message: 'Password is required to lock the PDF.' };
  }

  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  // Encrypt the PDF
  (pdfDoc as any).encrypt({
    userPassword: password,
    ownerPassword: password,
    permissions: {
      printing: 'highResolution',
      modifying: false,
      copying: false,
      annotating: false,
      fillingForms: false,
      contentAccessibility: false,
      documentAssembly: false,
    },
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });

  return {
    success: true,
    downloadUrl: URL.createObjectURL(blob),
    downloadName: 'locked.pdf'
  };
};

// 8. PDF to Images
const pdfToImages = async (file: File): Promise<ProcessingResult> => {
  if (!pdfJs) throw new Error("PDF Library not loaded");

  const arrayBuffer = await readFileAsArrayBuffer(file);
  const loadingTask = pdfJs.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const zip = new JSZip();

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    if (context) {
      await page.render({ canvasContext: context, viewport: viewport }).promise;
      const dataUrl = canvas.toDataURL('image/png');
      const base64Data = dataUrl.split(',')[1];
      zip.file(`page_${i}.png`, base64Data, { base64: true });
    }
  }

  const content = await zip.generateAsync({ type: 'blob' });
  return {
    success: true,
    downloadUrl: URL.createObjectURL(content),
    downloadName: 'pdf_images.zip'
  };
};

// 9. PDF to Text
const pdfToText = async (file: File): Promise<ProcessingResult> => {
  if (!pdfJs) throw new Error("PDF Library not loaded");

  const arrayBuffer = await readFileAsArrayBuffer(file);
  const loadingTask = pdfJs.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += `--- Page ${i} ---\n${pageText}\n\n`;
  }

  const blob = new Blob([fullText], { type: 'text/plain' });
  return {
    success: true,
    downloadUrl: URL.createObjectURL(blob),
    downloadName: 'extracted_text.txt'
  };
};

// 10. PDF to Word (via text extraction)
const pdfToWord = async (file: File): Promise<ProcessingResult> => {
  // 1. Extract text
  const textResult = await pdfToText(file);
  const textBlob = await fetch(textResult.downloadUrl!).then(r => r.text());

  // 2. Create Docx
  const doc = new docx.Document({
    sections: [{
      properties: {},
      children: textBlob.split('\n').map(line =>
        new docx.Paragraph({
          children: [new docx.TextRun(line)],
        })
      ),
    }],
  });

  const blob = await docx.Packer.toBlob(doc);
  return {
    success: true,
    downloadUrl: URL.createObjectURL(blob),
    downloadName: 'converted_from_pdf.docx'
  };
};

// 11. Word to Text
const wordToText = async (file: File): Promise<ProcessingResult> => {
  if (!mammoth) throw new Error("Mammoth library missing");
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const result = await mammoth.extractRawText({ arrayBuffer });

  const blob = new Blob([result.value], { type: 'text/plain' });
  return {
    success: true,
    downloadUrl: URL.createObjectURL(blob),
    downloadName: file.name.replace('.docx', '.txt')
  };
};

// 12. Word to PDF
const wordToPdf = async (file: File): Promise<ProcessingResult> => {
  if (!mammoth) throw new Error("Mammoth library missing");
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const html = result.value as string;

  const JsPDFCtor = (jsPDF as any).jsPDF || jsPDF;
  const doc = new JsPDFCtor();

  // Strip HTML tags for simple text placement (full HTML render is complex in jsPDF without canvas)
  // Improve text extraction from HTML
  // Replace block elements with double newlines, breaks with single newline
  const text = html
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '') // Strip remaining tags
    .replace(/&nbsp;/g, ' ') // Handle non-breaking spaces
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0) // Remove empty lines
    .join('\n');

  const splitText = doc.splitTextToSize(text, 180);

  let y = 15;
  for (let i = 0; i < splitText.length; i++) {
    if (y > 280) {
      doc.addPage();
      y = 15;
    }
    doc.text(splitText[i], 15, y);
    y += 7;
  }

  const blob = doc.output('blob');
  return {
    success: true,
    downloadUrl: URL.createObjectURL(blob),
    downloadName: file.name.replace('.docx', '.pdf')
  };
};

// 13. Word Merge
const mergeWords = async (files: FileState[]): Promise<ProcessingResult> => {
  if (!mammoth || !docx) throw new Error("Libraries missing for Word Merge");

  let allText = "";

  // Extract text from all docs
  for (const f of files) {
    const ab = await readFileAsArrayBuffer(f.file);
    const res = await mammoth.extractRawText({ arrayBuffer: ab });
    allText += `\n\n--- Start of ${f.file.name} ---\n\n`;
    allText += res.value;
  }

  // Create new Doc
  const doc = new docx.Document({
    sections: [{
      properties: {},
      children: allText.split('\n').map(line =>
        new docx.Paragraph({
          children: [new docx.TextRun(line)],
        })
      ),
    }],
  });

  const blob = await docx.Packer.toBlob(doc);
  return {
    success: true,
    downloadUrl: URL.createObjectURL(blob),
    downloadName: 'merged.docx',
    message: 'Merged text content of documents.'
  };
};

// 14. Utilities
const textToPdf = async (file: File): Promise<ProcessingResult> => {
  const text = await readFileAsText(file);
  const JsPDFCtor = (jsPDF as any).jsPDF || jsPDF;
  const doc = new JsPDFCtor();
  const splitText = doc.splitTextToSize(text, 180);

  let y = 15;
  for (let i = 0; i < splitText.length; i++) {
    if (y > 280) {
      doc.addPage();
      y = 15;
    }
    doc.text(splitText[i], 15, y);
    y += 7;
  }

  const blob = doc.output('blob');
  return {
    success: true,
    downloadUrl: URL.createObjectURL(blob),
    downloadName: file.name.replace('.txt', '.pdf')
  };
};

const convertImageSmart = async (file: File, targetFormat?: string): Promise<ProcessingResult> => {
  const dataUrl = await readFileAsDataURL(file);
  const img = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Context error');

  ctx.drawImage(img, 0, 0);

  let targetMime = 'image/png';
  if (targetFormat) {
    targetMime = `image/${targetFormat}`;
  } else {
    // Fallback toggle logic
    if (file.type === 'image/png') targetMime = 'image/jpeg';
    else if (file.type === 'image/jpeg') targetMime = 'image/png';
    else if (file.type === 'image/webp') targetMime = 'image/png';
  }

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return resolve({ success: false });
      const ext = targetMime.split('/')[1];
      resolve({
        success: true,
        downloadUrl: URL.createObjectURL(blob),
        downloadName: `converted.${ext}`
      });
    }, targetMime, 0.9);
  });
};

const formatText = async (file: File): Promise<ProcessingResult> => {
  const text = await readFileAsText(file);
  const newText = text.toUpperCase();
  const blob = new Blob([newText], { type: 'text/plain' });
  return {
    success: true,
    downloadUrl: URL.createObjectURL(blob),
    downloadName: 'uppercase.txt'
  };
};

// 15. Word Watermark (Re-create doc with watermark)
const watermarkWord = async (
  file: File,
  text: string = 'CONFIDENTIAL',
  position: string = 'middle',
  fontName: string = 'Helvetica',
  colorHex: string = '#FF0000',
  opacity: number = 0.3
): Promise<ProcessingResult> => {
  if (!mammoth || !docx) throw new Error("Libraries missing");

  // 1. Extract text
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const res = await mammoth.extractRawText({ arrayBuffer });
  const content = res.value;

  // 2. Create new Doc with watermark
  // We use headers/footers to simulate position

  let headers: any = {};
  let footers: any = {};

  const watermarkRun = new docx.TextRun({
    text: text,
    size: 80,
    color: colorHex.replace('#', ''), // docx expects hex without #
    bold: true,
    font: fontName,
  });

  const watermarkParagraph = new docx.Paragraph({
    children: [watermarkRun],
    alignment: docx.AlignmentType.CENTER,
  });

  if (position === 'top') {
    headers = {
      default: new docx.Header({
        children: [watermarkParagraph],
      }),
    };
  } else if (position === 'bottom') {
    footers = {
      default: new docx.Footer({
        children: [watermarkParagraph],
      }),
    };
  } else {
    // Middle is hard in docx without floating objects, so we put it in header with spacing
    // Or just put it at the top for now as a limitation fallback, or try to add it as first paragraph
    // Let's stick to header for consistency but maybe add spacing?
    // For simplicity in this demo, 'middle' will just be a header.
    headers = {
      default: new docx.Header({
        children: [watermarkParagraph],
      }),
    };
  }

  const doc = new docx.Document({
    sections: [{
      properties: {},
      headers: headers,
      footers: footers,
      children: content.split('\n').map((line: string) =>
        new docx.Paragraph({
          children: [new docx.TextRun(line)],
        })
      ),
    }],
  });

  const blob = await docx.Packer.toBlob(doc);
  return {
    success: true,
    downloadUrl: URL.createObjectURL(blob),
    downloadName: 'watermarked.docx',
    message: 'Created new DOCX with watermark.'
  };
};