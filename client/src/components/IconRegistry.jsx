import React from 'react'
import {
  // Navigation and UI
  FiArrowUp,
  FiArrowDown,
  FiX,
  FiEdit2,
  FiSun,
  FiMoon,
  FiEye,
  FiEyeOff,
  FiPlus,
  FiDownload,
  FiUpload,
  FiRefreshCw,
  FiFileText,
  FiSettings,
  // Contact icons
  FiMail,
  FiPhone,
  FiMapPin,
  FiGlobe,
  FiGithub,
  FiLinkedin,
  // Other
  FiHeart,
  FiCheck,
  FiAlertCircle,
  FiInfo,
  FiStar
} from 'react-icons/fi'

import {
  // Copyright symbol from different icon pack
  AiOutlineCopyright
} from 'react-icons/ai'

export const Icons = {
  // Navigation and controls
  ArrowUp: FiArrowUp,
  ArrowDown: FiArrowDown,
  Close: FiX,
  Edit: FiEdit2,
  Plus: FiPlus,
  Eye: FiEye,
  EyeOff: FiEyeOff,
  Settings: FiSettings,
  
  // Theme
  Sun: FiSun,
  Moon: FiMoon,
  
  // Actions
  Download: FiDownload,
  Upload: FiUpload,
  Refresh: FiRefreshCw,
  FileText: FiFileText,
  Check: FiCheck,
  Alert: FiAlertCircle,
  Info: FiInfo,
  Sparkles: FiStar, // Using FiStar instead of HiSparkles for better compatibility
  
  // Contact
  Mail: FiMail,
  Phone: FiPhone,
  MapPin: FiMapPin,
  Globe: FiGlobe,
  Github: FiGithub,
  Linkedin: FiLinkedin,
  
  // Special
  Heart: FiHeart,
  Copyright: AiOutlineCopyright
}

// Icon wrapper component for consistent styling
export function Icon({ name, size = 16, className = '', ...props }) {
  const IconComponent = Icons[name]
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in IconRegistry`)
    return null
  }
  
  return (
    <IconComponent 
      size={size} 
      className={`icon-base ${className}`} 
      {...props} 
    />
  )
}

// Export individual icons for direct use if needed
export default Icons