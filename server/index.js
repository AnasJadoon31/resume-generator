import express from 'express'
import { spawn } from 'child_process'
import os from 'os'
import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'
import { nanoid } from 'nanoid'
import { buildLatex } from './latex/generator.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

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

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
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

