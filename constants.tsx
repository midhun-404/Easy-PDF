import {
  FileImage, FileText, FilePlus, Scissors, Minimize2,
  Type, RotateCw, Lock, Stamp, Merge,
  FileCode, Image, FileType, FileArchive, SpellCheck, Eye
} from 'lucide-react';
import { ToolCategory, ToolDef } from './types';

export const APP_NAME = "EasyPDF";

export const TOOLS: ToolDef[] = [
  // PDF Tools
  {
    id: 'img-to-pdf',
    name: 'Image to PDF',
    description: 'Convert JPG, PNG images to PDF documents.',
    icon: FileImage,
    category: ToolCategory.PDF,
    path: '/tools/img-to-pdf',
    accepts: 'image/*',
    multiple: true
  },
  {
    id: 'pdf-to-img',
    name: 'PDF to Image',
    description: 'Extract pages from PDF as high-quality images.',
    icon: Image,
    category: ToolCategory.PDF,
    path: '/tools/pdf-to-img',
    accepts: 'application/pdf',
    multiple: false
  },
  {
    id: 'pdf-merge',
    name: 'PDF Merge',
    description: 'Combine multiple PDFs into a single file.',
    icon: FilePlus,
    category: ToolCategory.PDF,
    path: '/tools/pdf-merge',
    accepts: 'application/pdf',
    multiple: true
  },
  {
    id: 'pdf-split',
    name: 'PDF Split',
    description: 'Separate PDF pages into individual files.',
    icon: Scissors,
    category: ToolCategory.PDF,
    path: '/tools/pdf-split',
    accepts: 'application/pdf',
    multiple: false
  },
  {
    id: 'pdf-layout',
    name: 'PDF Layout',
    description: 'Change PDF layout (2-up, 4-up, etc.).',
    icon: Minimize2,
    category: ToolCategory.PDF,
    path: '/tools/pdf-layout',
    accepts: 'application/pdf',
    multiple: false
  },
  {
    id: 'text-to-pdf',
    name: 'Text to PDF',
    description: 'Convert .txt files to PDF format.',
    icon: Type,
    category: ToolCategory.PDF,
    path: '/tools/text-to-pdf',
    accepts: '.txt',
    multiple: false
  },
  {
    id: 'pdf-to-text',
    name: 'PDF to Text',
    description: 'Extract text content from PDF files.',
    icon: FileText,
    category: ToolCategory.PDF,
    path: '/tools/pdf-to-text',
    accepts: 'application/pdf',
    multiple: false
  },

  {
    id: 'pdf-watermark',
    name: 'Watermark PDF',
    description: 'Add text watermarks to your documents.',
    icon: Stamp,
    category: ToolCategory.PDF,
    path: '/tools/pdf-watermark',
    accepts: 'application/pdf',
    multiple: false
  },
  {
    id: 'pdf-lock',
    name: 'Lock PDF',
    description: 'Encrypt PDF with a password.',
    icon: Lock,
    category: ToolCategory.PDF,
    path: '/tools/pdf-lock',
    accepts: 'application/pdf',
    multiple: false
  },

  // Word Tools
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    description: 'Convert DOCX files to PDF documents.',
    icon: FileType,
    category: ToolCategory.WORD,
    path: '/tools/word-to-pdf',
    accepts: '.docx',
    multiple: false
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    description: 'Convert PDF documents to editable Word files.',
    icon: FileText,
    category: ToolCategory.WORD,
    path: '/tools/pdf-to-word',
    accepts: 'application/pdf',
    multiple: false
  },
  {
    id: 'word-merge',
    name: 'Word Merge',
    description: 'Combine multiple Word documents.',
    icon: Merge,
    category: ToolCategory.WORD,
    path: '/tools/word-merge',
    accepts: '.docx',
    multiple: true
  },
  {
    id: 'word-to-text',
    name: 'Word to Text',
    description: 'Extract text from Word documents.',
    icon: FileCode,
    category: ToolCategory.WORD,
    path: '/tools/word-to-text',
    accepts: '.docx',
    multiple: false
  },
  {
    id: 'word-watermark',
    name: 'Watermark Word',
    description: 'Add text watermark to Word documents.',
    icon: Stamp,
    category: ToolCategory.WORD,
    path: '/tools/word-watermark',
    accepts: '.docx',
    multiple: false
  },

];