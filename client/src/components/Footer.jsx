import React from 'react'
import { Icon } from './IconRegistry.jsx'

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>Made with <Icon name="Heart" size={16} className="heart-icon" /> by Muhammad Anas</p>
        <p className="copyright">
          <Icon name="Copyright" size={12} className="mr-1" />
          {currentYear} Muhammad Anas. All rights reserved.
        </p>
      </div>
    </footer>
  )
}