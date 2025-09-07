import express from 'express'
import { spawn } from 'child_process'
import os from 'os'
import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'
import { nanoid } from 'nanoid'
import { buildLatex } from './latex/generator.js'
import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Initialize Gemini AI
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null

// Basic CORS (no dependency)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

app.use(express.json({ limit: '2mb' }))

app.get('/health', (req, res) => res.json({ ok: true }))

app.post('/api/generate', async (req, res) => {
  const data = req.body || {}
  try {
    const tex = buildLatex(data)
    const { pdfBuffer, logs } = await compileLatex(tex)
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'inline; filename="resume.pdf"')
    return res.send(pdfBuffer)
  } catch (err) {
    const message = err?.message || 'LaTeX compilation failed'
    res.status(500).send(message)
  }
})

// New endpoint for AI-powered resume modification
app.post('/api/modify-with-ai', async (req, res) => {
  try {
    if (!genAI) {
      return res.status(400).json({ error: 'Gemini API key not configured' })
    }

    const { jobDescription, ...resumeData } = req.body || {}
    
    // Use the updated model name for Gemini 1.5
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    // Create different prompts based on whether job description is provided
    let prompt
    
    if (jobDescription && jobDescription.trim()) {
      // Job-specific enhancement prompt
      prompt = `You are an expert resume writer and career coach. I will provide you with a resume in JSON format and a job advertisement. Please tailor and optimize the resume content specifically for this job while maintaining the exact same JSON structure.

JOB ADVERTISEMENT:
${jobDescription}

TAILORING INSTRUCTIONS:
1. Analyze the job requirements and keywords from the advertisement
2. Modify the professional summary to align with the job requirements
3. Emphasize relevant skills and experiences that match the job posting
4. Use keywords from the job description naturally throughout the resume
5. Rewrite bullet points to highlight achievements relevant to this specific role
6. Ensure the resume demonstrates how the candidate meets the job requirements
7. Maintain professional language and ATS optimization
8. Quantify achievements where possible and relevant to the job

IMPORTANT: 
- Return ONLY the JSON object, no additional text or explanation
- Maintain the exact same JSON structure and field names
- Do not add or remove any fields or sections
- Keep all dates, names, and contact information exactly as provided
- Focus on making the content relevant to the specific job posting
- If any field is empty or missing, leave it as is

Here is the resume data to tailor for this job:

${JSON.stringify(resumeData, null, 2)}`
    } else {
      // General enhancement prompt
      prompt = `You are an expert resume writer and career coach. I will provide you with a resume in JSON format. Please improve and optimize the content while maintaining the exact same JSON structure. Focus on:

1. Making the language more professional and impactful
2. Improving bullet points to be more achievement-oriented with quantifiable results
3. Enhancing the professional summary to be more compelling
4. Optimizing keywords for ATS (Applicant Tracking Systems)
5. Ensuring consistent formatting and professional tone
6. Adding action verbs and power words where appropriate
7. Making descriptions more specific and results-focused

IMPORTANT: 
- Return ONLY the JSON object, no additional text or explanation
- Maintain the exact same JSON structure and field names
- Do not add or remove any fields or sections
- Keep all dates, names, and contact information exactly as provided
- If any field is empty or missing, leave it as is

Here is the resume data to improve:

${JSON.stringify(resumeData, null, 2)}`
    }

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    try {
      // Extract JSON from the response
      let jsonText = text.trim()
      
      // Remove any markdown code blocks if present
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }
      
      const improvedResume = JSON.parse(jsonText)
      
      const enhancementType = jobDescription ? 'job-specific' : 'general'
      const message = jobDescription 
        ? 'Resume successfully tailored for the specific job position!'
        : 'Resume successfully improved with AI!'
      
      res.json({ 
        success: true, 
        data: improvedResume,
        message: message,
        enhancementType: enhancementType
      })
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      console.error('AI Response:', text)
      res.status(500).json({ 
        error: 'Failed to parse AI response. Please try again.',
        details: parseError.message
      })
    }
  } catch (error) {
    console.error('AI modification error:', error)
    res.status(500).json({ 
      error: 'Failed to modify resume with AI',
      details: error.message
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  GEMINI_API_KEY not found in environment variables. AI modification will not work.')
  } else {
    console.log('✅ Gemini AI integration enabled')
  }
})

async function compileLatex(texSource) {
  const jobId = `resume-${nanoid(6)}`
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'resume-'))
  const texPath = path.join(tmpDir, `${jobId}.tex`)

  await fs.writeFile(texPath, texSource, 'utf8')

  // Try xelatex, then pdflatex
  const tries = [
    ['xelatex', ['-halt-on-error', '-interaction=nonstopmode', jobId + '.tex']],
    ['pdflatex', ['-halt-on-error', '-interaction=nonstopmode', jobId + '.tex']]
  ]

  let lastErr = null
  let logs = ''
  for (const [cmd, args] of tries) {
    try {
      logs += `Trying ${cmd}...\n`
      await execSpawn(cmd, args, { cwd: tmpDir })
      const pdf = await fs.readFile(path.join(tmpDir, `${jobId}.pdf`))
      return { pdfBuffer: pdf, logs }
    } catch (e) {
      lastErr = e
      logs += String(e?.message || e) + '\n'
    }
  }
  throw new Error(lastErr?.message || 'Compilation failed')
}

function execSpawn(command, args, opts) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { ...opts, shell: process.platform === 'win32' })
    let stdout = ''
    let stderr = ''
    child.stdout.on('data', d => { stdout += d.toString() })
    child.stderr.on('data', d => { stderr += d.toString() })
    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) return resolve({ stdout, stderr })
      reject(new Error(stderr || stdout || `Exit ${code}`))
    })
  })
}

