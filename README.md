Resume Generator (React + LaTeX)

Overview
- React JSX frontend for a dynamic resume form
- Node.js backend compiles LaTeX to PDF on demand
- User never sees LaTeX; form data is inserted into a safe template

Prerequisites
- Node.js 18+ and npm
- LaTeX distribution installed and available on PATH
  - Windows (common):
    - TeX Live: C:\Program Files\texlive\2024\bin\windows in PATH
    - MiKTeX: C:\Program Files\MiKTeX\miktex\bin\x64 in PATH
  - Verify by running xelatex --version or pdflatex --version in a terminal

Quick Start
1) Install server dependencies and start API
   cd server
   npm install
   npm start

   - Server runs on http://localhost:3001
   - It tries xelatex first, then pdflatex

2) Install client dependencies and start dev server
   cd client
   npm install
   npm run dev

   - Visit the URL Vite shows (default: http://localhost:5173)
   - If your server runs elsewhere, set client/.env and restart:
     VITE_API_BASE=http://localhost:3001

Usage
- Fill in personal info, summary, and add entries under Experience, Education, Projects, etc
- Click Generate PDF to compile and preview
- Export/Import JSON to save and load your data
- Data auto-saves to localStorage

LaTeX Setup Notes (Windows)
- If xelatex/pdflatex is not found:
  - Open “Edit the system environment variables” → Environment Variables… → edit Path → Add your TeX bin folder
  - Example (TeX Live): C:\Program Files\texlive\2024\bin\windows
  - Example (MiKTeX): C:\Program Files\MiKTeX\miktex\bin\x64
- MiKTeX first run may prompt to install missing packages; accept installation
- If compilation fails, the server returns error text with LaTeX log

Project Structure
- client/ (Vite + React JSX UI)
- server/ (Express API + LaTeX generation)

Security & Reliability
- All user fields are escaped for LaTeX special characters
- No shell-escape is enabled; only xelatex/pdflatex with -halt-on-error
- The server uses OS temp directories for builds and returns the PDF directly

Customization
- Adjust LaTeX formatting in server/latex/generator.js (preamble and section builders)
- Extend the form by editing client/src/models/schema.js (fields) and the generic SectionEditor will render them

