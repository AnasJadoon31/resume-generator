# AI-Powered Resume Enhancement Setup

## Google Gemini API Setup

1. **Get a Gemini API Key:**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key
   - Copy the API key

2. **Configure the Server:**
   - Navigate to the `server` directory
   - Open the `.env` file
   - Replace `your_gemini_api_key_here` with your actual API key:
     ```
     GEMINI_API_KEY=your_actual_api_key_here
     ```

3. **Install Dependencies:**
   ```bash
   cd server
   npm install @google/generative-ai dotenv
   ```

## How to Use AI Resume Enhancement

### Step 1: Create Your Raw Resume
1. Fill in your personal information (name, email, etc.)
2. Add your work experience, education, and skills
3. Don't worry about perfect wording - just get your content down

### Step 2: Use AI Enhancement
1. Click the **"Modify with AI"** button in the toolbar (purple button with sparkles ✨)
2. Confirm that you want to enhance your resume
3. Wait for the AI to process and improve your content
4. Review the enhanced resume

### What the AI Does
- **Professional Language**: Converts casual language to professional terminology
- **Achievement Focus**: Transforms job duties into achievement-oriented bullet points
- **ATS Optimization**: Adds relevant keywords for Applicant Tracking Systems
- **Power Words**: Incorporates action verbs and impactful language
- **Quantifiable Results**: Emphasizes measurable achievements where possible
- **Compelling Summaries**: Creates engaging professional summaries

### Important Notes
- ✅ The AI preserves your data structure and contact information
- ✅ All dates, company names, and personal details remain unchanged
- ✅ You can always undo changes using the import/export feature
- ⚠️ Always review AI-generated content before finalizing
- ⚠️ The AI works best when you have substantial content to work with

### Tips for Best Results
1. **Add Content First**: Include detailed job descriptions and achievements
2. **Be Specific**: Mention technologies, metrics, and accomplishments
3. **Multiple Iterations**: You can run AI enhancement multiple times
4. **Manual Review**: Always review and adjust the AI output as needed

## Troubleshooting

### "Gemini API key not configured" Error
- Check that your `.env` file has the correct API key
- Restart the server after adding the API key
- Ensure there are no extra spaces in the API key

### "Add Content First" Message
- Make sure you have at least your name filled in
- Add some work experience or education before using AI
- The AI needs substantial content to work with

### Server Not Starting
- Make sure you have Node.js installed
- Run `npm install` in the server directory
- Check that port 3001 is not in use by another application