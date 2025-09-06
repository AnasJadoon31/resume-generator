import React, { useRef, useState, useEffect } from 'react'

export function Toolbar({ busy, onGenerate, onReset, onImport, data }) {
  const fileRef = useRef(null)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'resume.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importJson = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const obj = JSON.parse(reader.result)
        onImport(obj)
      } catch (e) {
        alert('Invalid JSON file')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <h1>Resume Generator</h1>
      </div>
      <div className="toolbar-right">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme} 
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button className="btn" onClick={exportJson} title="Export JSON">Export</button>
        <input ref={fileRef} type="file" accept="application/json" hidden onChange={importJson} />
        <button className="btn" onClick={() => fileRef.current?.click()} title="Import JSON">Import</button>
        <button className="btn secondary" onClick={onReset} title="Reset data">Reset</button>
        <button className="btn primary" disabled={busy} onClick={onGenerate} title="Generate PDF">
          {busy ? 'Generating…' : 'Generate PDF'}
        </button>
      </div>
    </div>
  )
}

