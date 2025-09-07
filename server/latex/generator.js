import { escapeLatex, texLink } from '../utils/latex.js'

export function buildLatex(data) {
  const parts = [
    preamble(),
    `\\begin{document}`,
    ``,
    ...generateSections(data),
    `\\end{document}`
  ]
  
  return parts.filter(Boolean).join('\n')
}

function generateSections(data) {
  const parts = []
  const config = data.sectionConfig
  
  if (!config) {
    // Fallback to original structure if no config exists
    return generateFallbackSections(data)
  }
  
  // Filter to only visible sections that have data
  const orderedSections = config.order.filter(key => {
    // Must be visible in config
    if (!config.visibility[key]) return false
    
    // Must have data (except for summary which can be a string)
    const sectionData = data[key]
    if (key === 'summary') return sectionData && sectionData.trim()
    if (Array.isArray(sectionData)) return sectionData.length > 0
    if (typeof sectionData === 'object' && sectionData !== null) {
      // For skills object, check if it has categories with items
      if (key === 'skills') return sectionData.categories && sectionData.categories.length > 0
      return Object.keys(sectionData).some(k => sectionData[k])
    }
    return sectionData
  })
  
  let isFirstSection = true
  
  for (const sectionKey of orderedSections) {
    const sectionTitle = config.titles[sectionKey] || sectionKey
    
    if (sectionKey === 'personal') {
      parts.push(generatePersonalSection(data.personal))
      parts.push(``, `\\raggedright`, ``)
      isFirstSection = false
    } else {
      if (!isFirstSection) {
        parts.push(sectionDivider())
      }
      const sectionContent = generateSection(sectionKey, sectionTitle, data[sectionKey])
      if (sectionContent) { // Only add if section actually generated content
        parts.push(sectionContent)
        isFirstSection = false
      }
    }
  }
  
  return parts
}

function generateFallbackSections(data) {
  // Original fallback structure
  const parts = []
  
  if (data.personal) {
    parts.push(generatePersonalSection(data.personal))
    parts.push(``, `\\raggedright`, ``)
  }
  
  const sections = [
    { key: 'summary', title: 'Summary' },
    { key: 'experience', title: 'Experience & Projects' },
    { key: 'skills', title: 'Technical Skills' },
    { key: 'certifications', title: 'Certifications' },
    { key: 'education', title: 'Education' }
  ]
  
  let isFirst = true
  for (const section of sections) {
    if (data[section.key]) {
      if (!isFirst) parts.push(sectionDivider())
      parts.push(generateSection(section.key, section.title, data[section.key]))
      isFirst = false
    }
  }
  
  return parts
}

function generatePersonalSection(personalData) {
  const p = personalData || {}
  
  // Build header with FontAwesome icons and proper formatting
  const name = p.name ? `{\\Huge \\textbf{\\textcolor{black}{${escapeLatex(p.name)}}}}` : ''
  const title = p.title ? `{\\large \\textbf{${escapeLatex(p.title)}}}` : ''
  
  // Build contact line with FontAwesome icons
  const contacts = []
  if (p.email) {
    contacts.push(`\\faEnvelope \\, \\href{mailto:${escapeLatex(p.email)}}{${escapeLatex(p.email)}}`)
  }
  if (p.phone) {
    contacts.push(`\\faPhone \\, ${escapeLatex(p.phone)}`)
  }
  if (p.location) {
    contacts.push(`\\faMapMarker \\, ${escapeLatex(p.location)}`)
  }
  if (p.linkedin) {
    const linkedinText = p.linkedin.includes('linkedin.com') ? 
      p.linkedin.split('/').pop() : p.linkedin
    contacts.push(`\\faLinkedin \\, \\href{${escapeLatex(p.linkedin)}}{${escapeLatex(linkedinText)}}`)
  }
  if (p.github) {
    const githubText = p.github.includes('github.com') ? 
      p.github.split('/').pop() : p.github
    contacts.push(`\\faGithub \\, \\href{${escapeLatex(p.github)}}{${escapeLatex(githubText)}}`)
  }
  if (p.website) {
    contacts.push(`\\faGlobe \\, \\href{${escapeLatex(p.website)}}{${escapeLatex(p.website)}}`)
  }

  const headerParts = [
    `\\centering`,
    name && `${name}\\\\`,
    title && `${title}\\\\`,
    contacts.length > 0 && `{\\small`,
    contacts.length > 0 && contacts.join(' \\quad '),
    contacts.length > 0 && `}`
  ]
  
  return headerParts.filter(Boolean).join('\n')
}

function generateSection(sectionKey, title, data) {
  const sectionTitle = `\\section*{${escapeLatex(title)}}`
  
  switch (sectionKey) {
    case 'summary':
      return `${sectionTitle}\n${escapeLatex(data || '')}`
    
    case 'experience':
      return generateExperienceSection(sectionTitle, data)
    
    case 'education':
      return generateEducationSection(sectionTitle, data)
    
    case 'skills':
      return generateSkillsSection(sectionTitle, data)
    
    case 'certifications':
      return generateCertificationsSection(sectionTitle, data)
    
    case 'awards':
      return generateAwardsSection(sectionTitle, data)
    
    case 'publications':
      return generatePublicationsSection(sectionTitle, data)
    
    case 'languages':
      return generateLanguagesSection(sectionTitle, data)
    
    case 'projects':
      return generateProjectsSection(sectionTitle, data)
    
    case 'customSections':
      return generateCustomSectionsSection(sectionTitle, data)
    
    default:
      return `${sectionTitle}\n${escapeLatex(String(data || ''))}`
  }
}

function generateExperienceSection(title, data) {
  if (!Array.isArray(data) || !data.length) return ''
  
  const body = data.map(e => {
    const header = e.role ? `\\textbf{${escapeLatex(e.role)}}` : ''
    const company = e.company ? ` – ${escapeLatex(e.company)}` : ''
    
    // Add location and date range
    const location = e.location ? `${escapeLatex(e.location)}` : ''
    const dates = dateRange(e.startDate, e.endDate)
    
    // Create the right-aligned location and dates line
    let locationDateLine = ''
    if (location || dates) {
      const locationText = location || ''
      const dateText = dates || ''
      const separator = (location && dates) ? ' | ' : ''
      locationDateLine = ` \\hfill \\textit{${locationText}${separator}${dateText}}`
    }
    
    const bullets = listItems(e.bullets)
    return `${header}${company}${locationDateLine}\n${bullets}`
  }).join('\n\n')
  
  return `\\Needspace{10\\baselineskip}\n${title}\n\n${body}`
}

function generateEducationSection(title, data) {
  if (!Array.isArray(data) || !data.length) return ''
  
  const items = data.map(e => {
    const degree = e.degree ? `\\textbf{${escapeLatex(e.degree)}}` : ''
    const dates = dateRange(e.startDate, e.endDate)
    const dateText = dates ? ` \\hfill \\textit{${escapeLatex(dates)}}` : ''
    const institution = e.institution ? `\\textit{${escapeLatex(e.institution)}}` : ''
    const gpa = e.gpa ? ` — ${escapeLatex(e.gpa)}` : ''
    
    let result = `\\item ${degree}${dateText}`
    if (institution || gpa) {
      result += ` \\\\\n${institution}${gpa}`
    }
    
    if (e.details && e.details.length > 0) {
      const details = e.details.map(d => `\\item ${escapeLatex(d)}`).join('\n')
      result += `\n\\begin{itemize}\n${details}\n\\end{itemize}`
    }
    
    return result
  }).join('\n\n')
  
  return `\\Needspace{6\\baselineskip}\n${title}\n\\begin{itemize}\n${items}\n\\end{itemize}`
}

function generateSkillsSection(title, data) {
  if (!data || !Array.isArray(data.categories) || !data.categories.length) return ''
  
  const items = data.categories.map(c => 
    `\\item \\textbf{${escapeLatex(c.name)}:} ${escapeLatex((c.items||[]).join(', '))}`
  ).join('\n')
  
  return `\\Needspace{7\\baselineskip}\n${title}\n\\begin{itemize}\n${items}\n\\end{itemize}`
}

function generateCertificationsSection(title, data) {
  if (!Array.isArray(data) || !data.length) return ''
  
  const items = data.map(c => {
    let text = ''
    
    // Handle the name with optional link
    if (c.link && c.link.trim()) {
      text = `\\href{${escapeLatex(c.link)}}{${escapeLatex(c.name || '')}}`
    } else {
      text = escapeLatex(c.name || '')
    }
    
    if (c.issuer) text += ` by ${escapeLatex(c.issuer)}`
    if (c.year) text += ` (${escapeLatex(c.year)})`
    return `\\item ${text}`
  }).join('\n')
  
  return `\\Needspace{10\\baselineskip}\n${title}\n\\begin{itemize}\n${items}\n\\end{itemize}`
}

function generateAwardsSection(title, data) {
  if (!Array.isArray(data) || !data.length) return ''
  
  const items = data.map(a => {
    let text = escapeLatex(a.name || '')
    if (a.issuer) text += ` - ${escapeLatex(a.issuer)}`
    if (a.year) text += ` (${escapeLatex(a.year)})`
    return `\\item ${text}`
  }).join('\n')
  
  return `\\Needspace{6\\baselineskip}\n${title}\n\\begin{itemize}\n${items}\n\\end{itemize}`
}

function generatePublicationsSection(title, data) {
  if (!Array.isArray(data) || !data.length) return ''
  
  const items = data.map(p => {
    let text = escapeLatex(p.title || '')
    if (p.venue) text += `, ${escapeLatex(p.venue)}`
    if (p.year) text += ` (${escapeLatex(p.year)})`
    return `\\item ${text}`
  }).join('\n')
  
  return `\\Needspace{6\\baselineskip}\n${title}\n\\begin{itemize}\n${items}\n\\end{itemize}`
}

function generateLanguagesSection(title, data) {
  if (!Array.isArray(data) || !data.length) return ''
  
  const items = data.map(l => 
    `\\item \\textbf{${escapeLatex(l.name || '')}:} ${escapeLatex(l.level || '')}`
  ).join('\n')
  
  return `\\Needspace{4\\baselineskip}\n${title}\n\\begin{itemize}\n${items}\n\\end{itemize}`
}

function generateProjectsSection(title, data) {
  if (!Array.isArray(data) || !data.length) return ''
  
  const body = data.map(p => {
    const header = p.name ? `\\textbf{${escapeLatex(p.name)}}` : ''
    const link = p.link ? ` - \\href{${escapeLatex(p.link)}}{${escapeLatex(p.link)}}` : ''
    const description = p.description ? `\n${escapeLatex(p.description)}` : ''
    const tech = p.tech && p.tech.length ? `\n\\textbf{Tech:} ${escapeLatex(p.tech.join(', '))}` : ''
    const bullets = listItems(p.bullets)
    
    return `${header}${link}${description}${tech}\n${bullets}`
  }).join('\n\n')
  
  return `\\Needspace{8\\baselineskip}\n${title}\n\n${body}`
}

function generateCustomSectionsSection(title, data) {
  if (!Array.isArray(data) || !data.length) return ''
  
  const body = data.map(customSection => {
    const sectionTitle = customSection.title ? `\\subsection*{${escapeLatex(customSection.title)}}` : ''
    const items = Array.isArray(customSection.items) ? customSection.items : []
    
    const itemsBody = items.map(item => {
      const heading = item.heading ? `\\textbf{${escapeLatex(item.heading)}}` : ''
      const subheading = item.subheading ? ` - ${escapeLatex(item.subheading)}` : ''
      const bullets = listItems(item.bullets)
      
      return `${heading}${subheading}\n${bullets}`
    }).join('\n\n')
    
    return `${sectionTitle}\n${itemsBody}`
  }).join('\n\n')
  
  return `\\Needspace{6\\baselineskip}\n${title}\n\n${body}`
}

function preamble() {
  return `\\documentclass[a4paper,10pt]{article}
\\usepackage[top=0.4in,bottom=0.6in,left=0.75in,right=0.75in]{geometry}
\\usepackage{hyperref}
\\usepackage{xcolor}
\\usepackage{fontawesome5}
\\usepackage{enumitem}
\\usepackage{needspace}
\\pagestyle{empty}
\\setlist[itemize]{noitemsep, topsep=0pt, left=1.5em}`
}

function sectionDivider() {
  return `\\vspace{4pt}
\\noindent\\color{black}\\rule{\\textwidth}{0.4pt}
\\vspace{-4pt}`
}

function listItems(items) {
  if (!Array.isArray(items) || !items.length) return ''
  const lis = items.map(b => `\\item ${escapeLatex(String(b || ''))}`).join('\n')
  return `\\begin{itemize}
${lis}
\\end{itemize}`
}

function dateRange(a, b) {
  const s = [a, b].filter(Boolean)
  if (!s.length) return ''
  return s.join('–')
}
