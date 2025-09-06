import React, { useRef, useState, useEffect } from 'react'
import { Icon } from './IconRegistry.jsx'

export function Toolbar({ busy, onGenerate, onReset, onImport, data, onShowModal, onOpenSettings, onOpenPreview, validationErrors = [], showingPreview = false }) {
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
        onShowModal('info', 'Import Error', 'Invalid JSON file. Please check the file format and try again.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const hasErrors = validationErrors.length > 0
  const errorTooltip = hasErrors ? validationErrors.join('; ') : ''

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <h1>Resume Generator</h1>
        {hasErrors && (
          <div className="validation-indicator">
            <Icon name="Alert" size={16} className="error-icon" />
            <span className="error-count">{validationErrors.length} error{validationErrors.length > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
      <div className="toolbar-right">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme} 
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <Icon name={theme === 'dark' ? 'Sun' : 'Moon'} size={16} />
        </button>
        <button 
          className="btn" 
          onClick={onOpenSettings} 
          title="Settings"
        >
          <Icon name="Settings" size={16} />
        </button>
        {onOpenPreview && (
          <button 
            className="btn" 
            onClick={onOpenPreview} 
            title={showingPreview ? "Edit Resume" : "Preview Resume"}
          >
            <Icon name={showingPreview ? "Edit" : "Eye"} size={16} className="mr-2" />
            {showingPreview ? "Edit" : "Preview"}
          </button>
        )}
        <button className="btn" onClick={exportJson} title="Export JSON">
          <Icon name="Download" size={16} className="mr-2" />
          Export
        </button>
        <input ref={fileRef} type="file" accept="application/json" hidden onChange={importJson} />
        <button className="btn" onClick={() => fileRef.current?.click()} title="Import JSON">
          <Icon name="Upload" size={16} className="mr-2" />
          Import
        </button>
        <button className="btn secondary" onClick={onReset} title="Reset data">
          <Icon name="Refresh" size={16} className="mr-2" />
          Reset
        </button>
        <div className="generate-button-container">
          <button 
            className={`btn primary ${hasErrors ? 'disabled' : ''}`}
            disabled={busy || hasErrors} 
            onClick={onGenerate} 
            title={hasErrors ? errorTooltip : 'Generate PDF'}
          >
            <Icon name="FileText" size={16} className="mr-2" />
            {busy ? 'Generating…' : 'Generate PDF'}
          </button>
        </div>
      </div>
    </div>
  )
}

