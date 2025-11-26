import { LucideIcon } from 'lucide-react';

export enum ToolCategory {
  PDF = 'PDF Tools',
  WORD = 'Word Tools',
  IMAGE = 'Image Tools',
  UTILITY = 'Utilities',
}

export interface ToolDef {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: ToolCategory;
  path: string;
  accepts: string; // e.g., "image/*" or ".pdf"
  multiple: boolean;
}

export interface FileState {
  file: File;
  id: string;
  preview?: string;
}

export interface ProcessingResult {
  success: boolean;
  downloadUrl?: string;
  downloadName?: string;
  message?: string;
}
