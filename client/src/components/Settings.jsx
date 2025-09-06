import React from 'react'
import { Icon } from './IconRegistry.jsx'

export function Settings({ isOpen, onClose, settings, onSettingsChange }) {
  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleToggleAutoGenerate = () => {
    onSettingsChange({
      ...settings,
      autoGeneratePDF: !settings.autoGeneratePDF
    })
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="settings-content">
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="modal-close" onClick={onClose}>
            <Icon name="Close" size={18} />
          </button>
        </div>
        <div className="settings-body">
          <div className="setting-group">
            <h3>PDF Generation</h3>
            <div className="setting-item">
              <div className="setting-info">
                <label>Automatic PDF Generation</label>
                <p>Automatically generate PDF when resume data changes</p>
              </div>
              <div className="setting-control">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.autoGeneratePDF}
                    onChange={handleToggleAutoGenerate}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="setting-group">
            <h3>Layout & View</h3>
            <div className="setting-item">
              <div className="setting-info">
                <label>Preview Mode</label>
                <p>Choose how to display the PDF preview</p>
              </div>
              <div className="setting-control">
                <select 
                  className="setting-select"
                  value={settings.previewMode || 'side'}
                  onChange={(e) => onSettingsChange({
                    ...settings,
                    previewMode: e.target.value
                  })}
                >
                  <option value="side">Side by Side</option>
                  <option value="tab">Separate Tab</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="settings-footer">
          <button className="btn primary" onClick={onClose}>
            <Icon name="Check" size={16} className="mr-1" />
            Done
          </button>
        </div>
      </div>
    </div>
  )
}