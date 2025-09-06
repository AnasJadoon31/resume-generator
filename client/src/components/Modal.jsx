import React from 'react'
import { Icon } from './IconRegistry.jsx'

export function Modal({ isOpen, onClose, onConfirm, title, message, type = 'info' }) {
  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
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
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          {type === 'confirm' ? (
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