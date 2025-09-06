# Resume Generator (React + LaTeX)

A modern, dynamic resume builder with real-time PDF generation using React frontend and LaTeX backend compilation.

## Overview
- **Frontend**: React 18 with Vite for fast development and modern JSX components
- **Backend**: Node.js Express API that compiles LaTeX to PDF on-demand
- **UI/UX**: Clean, responsive interface with dark/light theme support
- **Real-time**: Live PDF preview with automatic generation options
- **Extensible**: Schema-driven form system for easy customization

## Features

### 🎨 User Interface
- **Dual Layout Modes**: Side-by-side or tabbed preview
- **Dark/Light Themes**: Automatic theme persistence
- **Resizable Panels**: Drag to adjust form/preview split
- **Responsive Design**: Works on desktop and tablet devices
- **Modern Icons**: Feather Icons for consistent UI elements

### 📝 Resume Sections
- **Personal Information**: Name, title, contact details with social links
- **Professional Summary**: Rich text summary section
- **Experience**: Work history with bullet points and date ranges
- **Education**: Academic background with GPA and details
- **Skills**: Categorized technical and soft skills
- **Certifications**: Professional certifications with links
- **Projects**: Portfolio projects with tech stack and descriptions
- **Awards**: Recognition and achievements
- **Publications**: Academic or professional publications
- **Languages**: Language proficiency levels
- **Custom Sections**: Flexible sections for unique content

### ⚙️ Advanced Features
- **Section Management**: Reorder, show/hide, and rename sections
- **Real-time Validation**: Input validation with error indicators
- **Auto-save**: Automatic localStorage persistence
- **Import/Export**: JSON backup and restore functionality
- **Auto-generation**: Optional automatic PDF generation on changes
- **Inline Editing**: Click-to-edit section titles
- **Move Controls**: Drag-free section reordering with buttons

### 🔧 Technical Features
- **LaTeX Security**: All inputs properly escaped for safe compilation
- **Fallback Compilation**: Tries XeLaTeX first, then PDFLaTeX
- **Error Handling**: Detailed error messages for debugging
- **Performance**: Debounced auto-generation to prevent excessive requests
- **Cross-platform**: Works on Windows, macOS, and Linux

## Prerequisites

### Required Software
- **Node.js 18+** and npm/pnpm
- **LaTeX Distribution** (choose one):
  - **TeX Live** (recommended): Full-featured, cross-platform
  - **MiKTeX** (Windows): Automatic package installation
  - **BasicTeX** (macOS): Lightweight option

### LaTeX Setup (Windows)
1. **Install TeX Live or MiKTeX**
2. **Add to PATH**:
   - TeX Live: `C:\Program Files\texlive\2024\bin\windows`
   - MiKTeX: `C:\Program Files\MiKTeX\miktex\bin\x64`
3. **Verify installation**: Run `xelatex --version` or `pdflatex --version`

### LaTeX Setup (macOS)
```bash
# Using Homebrew
brew install --cask mactex
# Or BasicTeX for minimal install
brew install --cask basictex
```

### LaTeX Setup (Linux)
```bash
# Ubuntu/Debian
sudo apt-get install texlive-full
# Or minimal install
sudo apt-get install texlive-latex-base texlive-fonts-recommended
```

## Quick Start

### 1. Server Setup
```bash
cd server
npm install
npm start
```
- Server runs on **http://localhost:3001**
- Health check available at `/health`
- PDF generation endpoint: `POST /api/generate`

### 2. Client Setup
```bash
cd client
npm install
npm run dev
```
- Development server runs on **http://localhost:5173**
- Hot module replacement for instant updates
- Automatic browser opening

### 3. Environment Configuration (Optional)
Create `client/.env` if server runs elsewhere:
```env
VITE_API_BASE=http://localhost:3001
```

## Usage Guide

### Basic Workflow
1. **Fill Personal Information**: Start with name, email, and title (required)
2. **Add Content**: Use the form sections to input your information
3. **Generate PDF**: Click "Generate PDF" to compile your resume
4. **Preview**: View the PDF in the integrated preview pane
5. **Export**: Save your data as JSON for backup/sharing

### Section Management
- **Add Sections**: Click "+" buttons to add new resume sections
- **Reorder Sections**: Use ↑/↓ arrows to change section order
- **Edit Titles**: Click the edit icon next to section headers
- **Remove Sections**: Click ✗ to hide sections (data preserved)
- **Bulk Operations**: Use settings to configure multiple sections

### Settings & Preferences
- **Auto-generation**: Enable automatic PDF creation on data changes
- **Layout Mode**: Choose between side-by-side or tabbed preview
- **Theme**: Toggle between dark and light modes
- **Data Persistence**: All settings saved to localStorage

### Advanced Tips
- **Validation**: Red indicators show required fields or errors
- **Tooltips**: Hover over buttons for helpful descriptions  
- **Keyboard Shortcuts**: Enter to save section title edits
- **Responsive Design**: Form adapts to different screen sizes

## Project Structure

```
resume-generator/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── App.jsx        # Main application component
│   │   ├── main.jsx       # React entry point
│   │   ├── styles.css     # Global styles and themes
│   │   ├── components/    # Reusable UI components
│   │   │   ├── Footer.jsx         # App footer with credits
│   │   │   ├── IconRegistry.jsx   # Centralized icon management
│   │   │   ├── Modal.jsx          # Confirmation dialogs
│   │   │   ├── SectionEditor.jsx  # Generic form renderer
│   │   │   ├── Settings.jsx       # Configuration panel
│   │   │   └── Toolbar.jsx        # Top navigation bar
│   │   └── models/
│   │       └── schema.js          # Data models and validation
│   ├── index.html         # HTML template
│   └── package.json       # Frontend dependencies
├── server/                # Node.js backend
│   ├── index.js          # Express server
│   ├── latex/
│   │   └── generator.js  # LaTeX document generation
│   ├── utils/
│   │   └── latex.js      # LaTeX escaping utilities
│   └── package.json      # Backend dependencies
├── README.md             # This file
└── LICENSE               # MIT license
```

## Component Architecture

### Frontend Components
- **App.jsx**: State management, layout switching, section orchestration
- **SectionEditor.jsx**: Schema-driven form rendering with validation
- **Toolbar.jsx**: PDF generation, import/export, theme switching
- **Settings.jsx**: Configuration modal with auto-generation options
- **Modal.jsx**: Reusable confirmation and info dialogs
- **IconRegistry.jsx**: Centralized icon library using Feather Icons

### Backend Modules
- **index.js**: Express server with CORS, PDF compilation endpoints
- **generator.js**: LaTeX document builder with section handlers
- **latex.js**: Security utilities for LaTeX special character escaping

## Data Storage

### localStorage Keys
- `resume-data-v1`: Complete resume data with section configuration
- `resume-settings`: User preferences (theme, auto-generation, layout)
- `theme`: Current theme selection (dark/light)

### Data Format
```javascript
{
  personal: { name, email, title, phone, location, linkedin, github, website },
  summary: "Professional summary text",
  experience: [{ company, role, startDate, endDate, bullets: [] }],
  skills: { categories: [{ name, items: [] }] },
  // ... other sections
  sectionConfig: {
    order: ["personal", "summary", "experience", "skills", ...],
    visibility: { personal: true, summary: true, ... },
    titles: { personal: "Personal Info", summary: "Summary", ... }
  }
}
```

## Troubleshooting

### LaTeX Issues
- **Command not found**: Add LaTeX bin directory to system PATH
- **Missing packages**: MiKTeX auto-installs; TeX Live requires manual installation
- **Compilation errors**: Check server logs for detailed LaTeX error messages
- **Font issues**: Ensure FontAwesome packages are installed

### Development Issues
- **CORS errors**: Verify server is running and VITE_API_BASE is correct
- **Build failures**: Clear node_modules and reinstall dependencies
- **Hot reload issues**: Restart Vite dev server
- **localStorage conflicts**: Clear browser data if experiencing data issues

### Performance
- **Slow PDF generation**: Disable auto-generation for large resumes
- **Memory issues**: LaTeX compilation uses temporary files (automatically cleaned)
- **Network timeouts**: Increase server timeout for complex documents

## Security & Reliability

### Input Sanitization
- All user inputs are escaped for LaTeX special characters
- No shell-escape or external file inclusion in LaTeX compilation
- Temporary files isolated to OS temp directories with unique IDs

### Error Handling
- Graceful fallback from XeLaTeX to PDFLaTeX
- Comprehensive validation with user-friendly error messages
- Network error recovery with retry mechanisms

### Data Protection
- All data stored locally (no server-side persistence)
- Export/import for data backup and migration
- No tracking or analytics collection

## Customization

### Adding New Sections
1. **Define schema** in `client/src/models/schema.js`:
```javascript
newSection: {
  type: 'array',
  item: {
    type: 'object',
    fields: [
      { key: 'title', label: 'Title', type: 'string' },
      { key: 'description', label: 'Description', type: 'textarea' }
    ]
  },
  defaultItem: () => ({ title: '', description: '' })
}
```

2. **Add LaTeX generator** in `server/latex/generator.js`:
```javascript
case 'newSection':
  return generateNewSectionFormat(sectionTitle, data)
```

### Styling Customization
- **CSS Variables**: Modify theme colors in `client/src/styles.css`
- **LaTeX Formatting**: Adjust document styling in `server/latex/generator.js`
- **Component Styles**: Update individual component styles

### Icon Customization
- **Add Icons**: Import new icons in `client/src/components/IconRegistry.jsx`
- **Icon Library**: Currently uses Feather Icons (react-icons/fi)

## Contributing

### Development Setup
1. Fork and clone the repository
2. Install dependencies in both client and server directories
3. Start development servers
4. Make changes and test thoroughly
5. Submit pull request with description

### Code Style
- Use modern ES6+ JavaScript features
- Follow React functional component patterns
- Maintain consistent indentation and naming
- Add comments for complex logic

## License

MIT License - see LICENSE file for details.

## Credits

- **Developer**: Muhammad Anas
- **Icons**: Feather Icons (react-icons)
- **LaTeX**: TeX Live/MiKTeX communities
- **Fonts**: FontAwesome for PDF icons

---

**Made with ❤️ by Muhammad Anas**

