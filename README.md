# EasyPDF

EasyPDF is a powerful, client-side PDF manipulation tool built with React, TypeScript, and Vite. It offers a suite of utilities to manage and edit PDF files directly in your browser without uploading data to any server, ensuring maximum privacy and security.

## Features

### PDF Tools
*   **Merge PDF**: Combine multiple PDF files into a single document.
*   **Split PDF**: Extract individual pages from a PDF file.
*   **PDF to Images**: Convert PDF pages into high-quality images.
*   **Images to PDF**: Convert images (PNG, JPG) into a single PDF document.
*   **Watermark PDF**: Add text watermarks to your PDF files.
    *   **Customization**: Choose font (Helvetica, Times Roman, Courier), color (Named colors or Hex), opacity, and position.
    *   **Straight Text**: Watermarks are applied horizontally for a professional look.
*   **Lock PDF**: Encrypt your PDF files with a password.
*   **PDF Layout**: Re-arrange PDF pages (2-up, 4-up) per sheet.
*   **PDF to Text**: Extract text content from PDF files.
*   **PDF to Word**: Convert PDF documents to editable Word files.

### Word Tools
*   **Word to PDF**: Convert DOCX files to PDF.
*   **Word to Text**: Extract raw text from Word documents.
*   **Merge Word**: Combine multiple Word documents.
*   **Watermark Word**: Add text watermarks to Word documents.

## Tech Stack

*   **Frontend**: React, TypeScript, Vite
*   **Styling**: Tailwind CSS
*   **PDF Processing**: `pdf-lib`, `jspdf`, `pdfjs-dist`
*   **Word Processing**: `mammoth`, `docx`
*   **Icons**: `lucide-react`

## Getting Started

### Prerequisites
*   Node.js (v16 or higher)
*   npm (v7 or higher)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/midhun-404/Easy-PDF.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd Easy-PDF
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

### Running the App
Website Link :

## Privacy

All file processing happens locally in your browser. No files are ever uploaded to a server.

## License

MIT

