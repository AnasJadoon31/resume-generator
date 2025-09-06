import React, { useEffect, useMemo, useState } from 'react'
import { SectionEditor } from './components/SectionEditor.jsx'
import { Toolbar } from './components/Toolbar.jsx'
import { Modal } from './components/Modal.jsx'
import { defaultResume, sectionSchemas, validateResume, generateId } from './models/schema.js'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001'

export default function App() {
  const [resume, setResume] = useState(() => {
    const saved = localStorage.getItem('resume-data-v1')
    return saved ? JSON.parse(saved) : defaultResume()
  })
  const [pdfUrl, setPdfUrl] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [editingTitles, setEditingTitles] = useState({})
  const [modal, setModal] = useState({ isOpen: false, type: 'info', title: '', message: '', onConfirm: null })

  // Ensure sectionConfig exists for backward compatibility
  useEffect(() => {
    if (!resume.sectionConfig) {
      const defaultConfig = defaultResume().sectionConfig
      setResume(prev => ({ ...prev, sectionConfig: defaultConfig }))
    }
  }, [resume])

  useEffect(() => {
    localStorage.setItem('resume-data-v1', JSON.stringify(resume))
  }, [resume])

  const showModal = (type, title, message, onConfirm = null) => {
    setModal({ isOpen: true, type, title, message, onConfirm })
  }

  const closeModal = () => {
    setModal({ isOpen: false, type: 'info', title: '', message: '', onConfirm: null })
  }

  const handleModalConfirm = () => {
    if (modal.onConfirm) {
      modal.onConfirm()
    }
    closeModal()
  }

  const onGenerate = async () => {
    setError(null)
    const issues = validateResume(resume)
    if (issues.length) {
      setError('Please fix: ' + issues.join('; '))
      return
    }
    setBusy(true)
    try {
      const resp = await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resume)
      })
      if (!resp.ok) {
        const text = await resp.text()
        throw new Error(text || `HTTP ${resp.status}`)
      }
      const blob = await resp.blob()
      const url = URL.createObjectURL(blob)
      if (pdfUrl) URL.revokeObjectURL(pdfUrl)
      setPdfUrl(url)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  const onReset = () => {
    showModal(
      'confirm',
      'Reset Resume',
      'Are you sure you want to reset to template data? This will remove all your current data.',
      () => {
        setResume(defaultResume())
        setPdfUrl(null)
        setError(null)
      }
    )
  }

  const onImport = (obj) => {
    setResume(obj)
    setPdfUrl(null)
    setError(null)
  }

  // Section management functions
  const updateSectionTitle = (sectionKey, title) => {
    setResume(prev => ({
      ...prev,
      sectionConfig: {
        ...prev.sectionConfig,
        titles: {
          ...prev.sectionConfig.titles,
          [sectionKey]: title
        }
      }
    }))
  }

  const toggleTitleEdit = (sectionKey) => {
    setEditingTitles(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }))
  }

  const handleTitleKeyPress = (e, sectionKey) => {
    if (e.key === 'Enter') {
      setEditingTitles(prev => ({
        ...prev,
        [sectionKey]: false
      }))
    }
  }

  const handleTitleBlur = (sectionKey) => {
    setEditingTitles(prev => ({
      ...prev,
      [sectionKey]: false
    }))
  }

  const removeSection = (sectionKey) => {
    if (sectionKey === 'personal') {
      showModal('info', 'Cannot Remove Section', 'Personal section cannot be removed as it contains essential information.')
      return
    }
    showModal(
      'confirm',
      'Remove Section',
      'Are you sure you want to remove this section? This will hide it from your resume.',
      () => {
        setResume(prev => ({
          ...prev,
          sectionConfig: {
            ...prev.sectionConfig,
            visibility: {
              ...prev.sectionConfig.visibility,
              [sectionKey]: false
            }
          }
        }))
      }
    )
  }

  const moveSectionUp = (sectionKey) => {
    if (sectionKey === 'personal') return // Personal section can't be moved
    
    setResume(prev => {
      const order = [...prev.sectionConfig.order]
      const index = order.indexOf(sectionKey)
      // Don't allow moving above personal section (index 0)
      if (index > 1) {
        [order[index], order[index - 1]] = [order[index - 1], order[index]]
      }
      return {
        ...prev,
        sectionConfig: {
          ...prev.sectionConfig,
          order
        }
      }
    })
  }

  const moveSectionDown = (sectionKey) => {
    if (sectionKey === 'personal') return // Personal section can't be moved
    
    setResume(prev => {
      const order = [...prev.sectionConfig.order]
      const index = order.indexOf(sectionKey)
      if (index < order.length - 1 && index > 0) { // Don't move if it's personal (index 0)
        [order[index], order[index + 1]] = [order[index + 1], order[index]]
      }
      return {
        ...prev,
        sectionConfig: {
          ...prev.sectionConfig,
          order
        }
      }
    })
  }

  const addSection = (sectionKey) => {
    setResume(prev => {
      const newVisibility = { ...prev.sectionConfig.visibility, [sectionKey]: true }
      const newOrder = prev.sectionConfig.order.includes(sectionKey) 
        ? prev.sectionConfig.order 
        : [...prev.sectionConfig.order, sectionKey]
      
      return {
        ...prev,
        sectionConfig: {
          ...prev.sectionConfig,
          visibility: newVisibility,
          order: newOrder
        }
      }
    })
  }

  // Separate personal section from other sections
  const personalSection = useMemo(() => {
    if (!resume.sectionConfig) return null
    return {
      key: 'personal',
      title: resume.sectionConfig.titles['personal'] || 'Personal Info',
      schema: sectionSchemas['personal']
    }
  }, [resume.sectionConfig])

  const otherVisibleSections = useMemo(() => {
    if (!resume.sectionConfig) return []
    
    return resume.sectionConfig.order
      .filter(sectionKey => sectionKey !== 'personal' && resume.sectionConfig.visibility[sectionKey])
      .map(sectionKey => ({
        key: sectionKey,
        title: resume.sectionConfig.titles[sectionKey] || sectionKey,
        schema: sectionSchemas[sectionKey]
      }))
  }, [resume.sectionConfig])

  const availableSections = useMemo(() => {
    if (!resume.sectionConfig) return []
    
    return Object.keys(sectionSchemas)
      .filter(sectionKey => sectionKey !== 'personal' && !resume.sectionConfig.visibility[sectionKey])
      .map(sectionKey => ({
        key: sectionKey,
        title: resume.sectionConfig.titles[sectionKey] || sectionKey
      }))
  }, [resume.sectionConfig])

  return (
    <div className="app-root">
      <Toolbar
        busy={busy}
        onGenerate={onGenerate}
        onReset={onReset}
        onImport={onImport}
        onShowModal={showModal}
        data={resume}
      />
      <div className="layout">
        <div className="form-pane">
          {personalSection && (
            <section className="card" key={personalSection.key}>
              <header className="card-header">
                <div className="section-header">
                  {editingTitles[personalSection.key] ? (
                    <input 
                      className="section-title-input"
                      value={personalSection.title}
                      onChange={e => updateSectionTitle(personalSection.key, e.target.value)}
                      onBlur={() => handleTitleBlur(personalSection.key)}
                      onKeyPress={e => handleTitleKeyPress(e, personalSection.key)}
                      placeholder="Section Title"
                      autoFocus
                    />
                  ) : (
                    <>
                      <button 
                        className="icon edit-title-btn" 
                        title="Edit section title" 
                        onClick={() => toggleTitleEdit(personalSection.key)}
                      >
                        ✏️
                      </button>
                      <h2>{personalSection.title}</h2>
                    </>
                  )}
                </div>
              </header>
              <div className="card-body">
                <SectionEditor
                  schema={personalSection.schema}
                  value={resume[personalSection.key]}
                  onChange={val => setResume(prev => ({ ...prev, [personalSection.key]: val }))}
                />
              </div>
            </section>
          )}
          {otherVisibleSections.map(section => (
            <section className="card" key={section.key}>
              <header className="card-header">
                <div className="section-header">
                  {editingTitles[section.key] ? (
                    <input 
                      className="section-title-input"
                      value={section.title}
                      onChange={e => updateSectionTitle(section.key, e.target.value)}
                      onBlur={() => handleTitleBlur(section.key)}
                      onKeyPress={e => handleTitleKeyPress(e, section.key)}
                      placeholder="Section Title"
                      autoFocus
                    />
                  ) : (
                    <>
                      <button 
                        className="icon edit-title-btn" 
                        title="Edit section title" 
                        onClick={() => toggleTitleEdit(section.key)}
                      >
                        ✏️
                      </button>
                      <h2>{section.title}</h2>
                    </>
                  )}
                </div>
                <div className="section-controls">
                  <button className="icon" title="Move up" onClick={() => moveSectionUp(section.key)}>↑</button>
                  <button className="icon" title="Move down" onClick={() => moveSectionDown(section.key)}>↓</button>
                  <button className="icon danger" title="Remove section" onClick={() => removeSection(section.key)}>✕</button>
                </div>
              </header>
              <div className="card-body">
                <SectionEditor
                  schema={section.schema}
                  value={resume[section.key]}
                  onChange={val => setResume(prev => ({ ...prev, [section.key]: val }))}
                />
              </div>
            </section>
          ))}
          
          {availableSections.length > 0 && (
            <div className="card add-section-card">
              <header className="card-header">
                <h2>Add Section</h2>
              </header>
              <div className="card-body">
                <div className="add-section-grid">
                  {availableSections.map(section => (
                    <button 
                      key={section.key}
                      className="btn add-section-btn"
                      onClick={() => addSection(section.key)}
                    >
                      + {section.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="preview-pane">
          <div className="card">
            <header className="card-header"><h2>Preview</h2></header>
            <div className="card-body preview-body">
              {error && <div className="alert error">{String(error)}</div>}
              {!pdfUrl && <div className="placeholder">Generate to see PDF preview</div>}
              {pdfUrl && (
                <iframe title="resume" src={pdfUrl} className="preview-frame" />
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={closeModal}
        onConfirm={handleModalConfirm}
      />
    </div>
  )
}

