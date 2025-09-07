import React, { useState } from 'react'
import { Icon } from './IconRegistry.jsx'

export function Modal({ isOpen, onClose, onConfirm, title, message, type = 'info', onGeneralAI, onJobSpecificAI, onJobSubmit }) {
  const [jobDescription, setJobDescription] = useState('')

  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleJobSubmit = () => {
    if (onJobSubmit && jobDescription.trim()) {
      onJobSubmit(jobDescription.trim())
      setJobDescription('') // Clear the textarea
    }
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>
            <Icon name="Close" size={18} />
          </button>
        </div>
        <div className="modal-body">
          {type === 'ai-options' ? (
            <div className="ai-options">
              <p>{message}</p>
              <div className="ai-option-buttons">
                <button 
                  className="btn ai-option-btn"
                  onClick={onGeneralAI}
                >
                  <Icon name="Sparkles" size={16} className="mr-2" />
                  <div className="option-content">
                    <div className="option-title">General Enhancement</div>
                    <div className="option-description">Improve overall resume quality and formatting</div>
                  </div>
                </button>
                <button 
                  className="btn ai-option-btn"
                  onClick={onJobSpecificAI}
                >
                  <Icon name="FileText" size={16} className="mr-2" />
                  <div className="option-content">
                    <div className="option-title">Job-Specific Tailoring</div>
                    <div className="option-description">Customize resume for a specific job posting</div>
                  </div>
                </button>
              </div>
            </div>
          ) : type === 'job-input' ? (
            <div className="job-input">
              <p>{message}</p>
              <textarea
                className="job-textarea"
                placeholder="Paste the job advertisement or requirements here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={8}
              />
            </div>
          ) : (
            <p>{message}</p>
          )}
        </div>
        <div className="modal-footer">
          {type === 'ai-options' ? (
            <button className="btn secondary" onClick={onClose}>Cancel</button>
          ) : type === 'job-input' ? (
            <>
              <button className="btn secondary" onClick={onClose}>Cancel</button>
              <button 
                className="btn primary" 
                onClick={handleJobSubmit}
                disabled={!jobDescription.trim()}
              >
                <Icon name="Sparkles" size={16} className="mr-1" />
                Enhance for Job
              </button>
            </>
          ) : type === 'confirm' ? (
            <>
              <button className="btn secondary" onClick={onClose}>Cancel</button>
              <button className="btn danger" onClick={onConfirm}>Confirm</button>
            </>
          ) : (
            <button className="btn primary" onClick={onClose}>
              <Icon name="Check" size={16} className="mr-1" />
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  )
}