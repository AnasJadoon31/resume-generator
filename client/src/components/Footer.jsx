import React from 'react'

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>Made with ❤️ by Muhammad Anas</p>
        <p className="copyright">© {currentYear} Muhammad Anas. All rights reserved.</p>
      </div>
    </footer>
  )
}