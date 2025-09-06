export function defaultResume() {
  return {
    personal: {
      name: 'Your Name',
      title: 'Your Title',
      email: 'your.email@example.com',
      phone: '+92 3311234567',
      location: 'Karachi, Pakistan',
      linkedin: 'https://www.linkedin.com/in/anas-jadoon/',
      github: 'https://github.com/AnasJadoon31'
    },
    summary: 'Computer Science student specializing in AI, data automation, and web development. Proven ability to deliver end-to-end solutions with measurable business value. Proficient in deploying machine learning models, building dashboards, and engineering scalable backends.',
    experience: [
      {
        company: 'Java GUI Desktop App',
        role: 'Restaurant Automation System',
        startDate: '',
        endDate: '',
        bullets: [
          'Engineered a full-featured desktop solution for automating restaurant workflows including billing, staff management, and inventory tracking.',
          'Reduced manual overhead by 70% by digitizing reservations, customer loyalty, and reporting processes.',
          'Generated professional invoices via JasperReports with real-time discounts and tax logic.',
          'Technology: Java, Swing, MySQL, JasperReports, Git'
        ]
      },
      {
        company: 'C++ CLI App',
        role: 'LAN Messaging & File Sharing System',
        startDate: '',
        endDate: '',
        bullets: [
          'Developed a real-time messaging and file sharing platform over LAN using a custom TCP/IP protocol.',
          'Implemented broadcast messaging and group file distribution, improving in-lab communication by 90%.',
          'Designed a robust command-line interface with admin-level controls and socket error handling.',
          'Technology: C++, WinSock, TCP/IP'
        ]
      }
    ],
    skills: {
      categories: [
        { name: 'Programming', items: ['Python', 'Java', 'C++', 'Kotlin', 'JavaScript', 'SQL', 'HTML/CSS', 'Google Apps Script'] },
        { name: 'ML/AI Tools', items: ['YOLOv8', 'scikit-learn', 'TensorFlow', 'Keras', 'PyTorch', 'OpenCV', 'MediaPipe', 'RAG', 'Qdrant'] },
        { name: 'Automation / BI', items: ['Power BI', 'n8n', 'Firebase', 'Google Sheets API', 'JasperReports'] },
        { name: 'Dev Tools', items: ['Git & GitHub', 'LabelImg', 'Roboflow', 'VSCode', 'Android Studio'] }
      ]
    },
    certifications: [
      { name: 'IBM AI Engineering', issuer: 'IBM', year: '', link: '' },
      { name: 'Machine Learning with Python (V2)', issuer: 'IBM', year: '', link: '' },
      { name: 'Data Analysis with Python', issuer: 'IBM', year: '', link: '' },
      { name: 'Convolutional Neural Networks', issuer: 'IBM', year: '', link: '' },
      { name: 'Neural Networks and Deep Learning', issuer: 'IBM', year: '', link: '' },
      { name: 'Improving Deep Neural Networks', issuer: 'IBM', year: '', link: '' },
      { name: 'Structuring Machine Learning Projects', issuer: 'IBM', year: '', link: '' },
      { name: 'Deep Learning with Keras and TensorFlow', issuer: 'IBM', year: '', link: '' },
      { name: 'Deep Learning with Keras', issuer: 'IBM', year: '', link: '' },
      { name: 'Intro to Neural Networks with PyTorch', issuer: 'IBM', year: '', link: '' },
      { name: 'Supervised ML: Regression and Classification', issuer: 'DeepLearning.AI', year: '', link: '' },
      { name: 'Generative AI for All', issuer: 'DeepLearning.AI', year: '', link: '' },
      { name: 'Google Project Management', issuer: 'Google', year: '', link: '' },
      { name: 'HTML and CSS in Depth', issuer: 'Meta', year: '', link: '' }
    ],
    education: [
      {
        institution: 'Bahria University, Karachi',
        degree: 'Bachelors of Science in Computer Science',
        location: '',
        startDate: '2024',
        endDate: '2028',
        gpa: 'CGPA: 3.80',
        details: []
      },
      {
        institution: 'Pakistan Navy Cadet College, Ormara',
        degree: 'Intermediate (Computer Science)',
        location: '',
        startDate: '2022',
        endDate: '2024',
        gpa: '73.5%',
        details: []
      },
      {
        institution: 'Cadet College Petaro, Jamshoro',
        degree: 'Matriculation (Science)',
        location: '',
        startDate: '2018',
        endDate: '2021',
        gpa: '92.5%',
        details: []
      }
    ],
    projects: [],
    awards: [],
    publications: [],
    languages: [],
    customSections: [],
    // Add metadata for section management
    sectionConfig: {
      order: ['personal', 'summary', 'experience', 'skills', 'certifications', 'education'],
      visibility: {
        personal: true,
        summary: true,
        experience: true,
        skills: true,
        certifications: true,
        education: true,
        projects: false,
        awards: false,
        publications: false,
        languages: false,
        customSections: false
      },
      titles: {
        personal: 'Personal Info',
        summary: 'Summary',
        experience: 'Experience & Projects',
        skills: 'Technical Skills',
        certifications: 'Certifications',
        education: 'Education',
        projects: 'Projects',
        awards: 'Awards',
        publications: 'Publications',
        languages: 'Languages',
        customSections: 'Custom Sections'
      }
    }
  }
}

export const sectionSchemas = {
  personal: {
    type: 'object',
    fields: [
      { key: 'name', label: 'Full Name', type: 'string' },
      { key: 'title', label: 'Headline / Title', type: 'string' },
      { key: 'email', label: 'Email', type: 'string' },
      { key: 'phone', label: 'Phone', type: 'string' },
      { key: 'location', label: 'Location', type: 'string' },
      { key: 'website', label: 'Website', type: 'string' },
      { key: 'linkedin', label: 'LinkedIn', type: 'string' },
      { key: 'github', label: 'GitHub', type: 'string' }
    ]
  },
  summary: { type: 'string' },
  experience: {
    type: 'array',
    item: {
      type: 'object',
      fields: [
        { key: 'company', label: 'Company/Type', type: 'string' },
        { key: 'role', label: 'Role/Title', type: 'string' },
        { key: 'location', label: 'Location', type: 'string' },
        { key: 'startDate', label: 'Start', type: 'string' },
        { key: 'endDate', label: 'End', type: 'string' },
        { key: 'bullets', label: 'Bullets', type: 'array-string', full: true }
      ]
    },
    defaultItem: () => ({ company: '', role: '', location: '', startDate: '', endDate: '', bullets: [] }),
    addLabel: 'Experience'
  },
  education: {
    type: 'array',
    item: {
      type: 'object',
      fields: [
        { key: 'institution', label: 'Institution', type: 'string' },
        { key: 'degree', label: 'Degree', type: 'string' },
        { key: 'location', label: 'Location', type: 'string' },
        { key: 'startDate', label: 'Start', type: 'string' },
        { key: 'endDate', label: 'End', type: 'string' },
        { key: 'gpa', label: 'GPA/Grade', type: 'string' },
        { key: 'details', label: 'Details', type: 'array-string', full: true }
      ]
    },
    defaultItem: () => ({ institution: '', degree: '', location: '', startDate: '', endDate: '', gpa: '', details: [] }),
    addLabel: 'Education'
  },
  projects: {
    type: 'array',
    item: {
      type: 'object',
      fields: [
        { key: 'name', label: 'Name', type: 'string' },
        { key: 'link', label: 'Link', type: 'string' },
        { key: 'description', label: 'Description', type: 'textarea', full: true },
        { key: 'tech', label: 'Tech', type: 'array-string', full: true },
        { key: 'bullets', label: 'Bullets', type: 'array-string', full: true }
      ]
    },
    defaultItem: () => ({ name: '', link: '', description: '', tech: [], bullets: [] }),
    addLabel: 'Project'
  },
  skills: {
    type: 'object',
    fields: [
      {
        key: 'categories',
        label: 'Categories',
        type: 'array-object',
        addLabel: 'Category',
        fields: [
          { key: 'name', label: 'Name', type: 'string' },
          { key: 'items', label: 'Items', type: 'array-string', full: true }
        ],
        defaultItem: () => ({ name: '', items: [] }),
        full: true
      }
    ]
  },
  certifications: {
    type: 'array',
    item: {
      type: 'object',
      fields: [
        { key: 'name', label: 'Name', type: 'string' },
        { key: 'issuer', label: 'Issuer', type: 'string' },
        { key: 'year', label: 'Year', type: 'string' },
        { key: 'link', label: 'Link', type: 'string' }
      ]
    },
    defaultItem: () => ({ name: '', issuer: '', year: '', link: '' })
  },
  awards: {
    type: 'array',
    item: {
      type: 'object',
      fields: [
        { key: 'name', label: 'Name', type: 'string' },
        { key: 'issuer', label: 'Issuer', type: 'string' },
        { key: 'year', label: 'Year', type: 'string' }
      ]
    },
    defaultItem: () => ({ name: '', issuer: '', year: '' })
  },
  publications: {
    type: 'array',
    item: {
      type: 'object',
      fields: [
        { key: 'title', label: 'Title', type: 'string' },
        { key: 'venue', label: 'Venue', type: 'string' },
        { key: 'year', label: 'Year', type: 'string' },
        { key: 'link', label: 'Link', type: 'string' }
      ]
    },
    defaultItem: () => ({ title: '', venue: '', year: '', link: '' })
  },
  languages: {
    type: 'array',
    item: {
      type: 'object',
      fields: [
        { key: 'name', label: 'Language', type: 'string' },
        { key: 'level', label: 'Level', type: 'string' }
      ]
    },
    defaultItem: () => ({ name: '', level: '' })
  },
  customSections: {
    type: 'array',
    item: {
      type: 'object',
      fields: [
        { key: 'title', label: 'Section Title', type: 'string', full: true },
        {
          key: 'items',
          label: 'Items',
          type: 'array-object',
          addLabel: 'Item',
          fields: [
            { key: 'heading', label: 'Heading', type: 'string' },
            { key: 'subheading', label: 'Subheading', type: 'string' },
            { key: 'bullets', label: 'Bullets', type: 'array-string', full: true }
          ],
          defaultItem: () => ({ heading: '', subheading: '', bullets: [] }),
          full: true
        }
      ]
    },
    defaultItem: () => ({ title: '', items: [] })
  }
}

export function validateResume(r) {
  const issues = []
  
  // Personal section validation (required fields)
  if (!r.personal?.name?.trim()) issues.push('Name is required')
  if (!r.personal?.email?.trim()) issues.push('Email is required')
  if (!r.personal?.title?.trim()) issues.push('Title/Headline is required')
  
  // Email format validation
  if (r.personal?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.personal.email.trim())) {
    issues.push('Invalid email format')
  }
  
  // Experience validation (if visible and has items)
  if (r.sectionConfig?.visibility?.experience && r.experience?.length > 0) {
    r.experience.forEach((exp, index) => {
      if (!exp.role?.trim()) issues.push(`Experience ${index + 1}: Role is required`)
      if (!exp.company?.trim()) issues.push(`Experience ${index + 1}: Company is required`)
    })
  }
  
  // Education validation (if visible and has items)
  if (r.sectionConfig?.visibility?.education && r.education?.length > 0) {
    r.education.forEach((edu, index) => {
      if (!edu.institution?.trim()) issues.push(`Education ${index + 1}: Institution is required`)
      if (!edu.degree?.trim()) issues.push(`Education ${index + 1}: Degree is required`)
    })
  }
  
  // Skills validation (if visible)
  if (r.sectionConfig?.visibility?.skills && r.skills?.categories?.length > 0) {
    r.skills.categories.forEach((cat, index) => {
      if (!cat.name?.trim()) issues.push(`Skills category ${index + 1}: Name is required`)
      if (!cat.items?.length || cat.items.every(item => !item.trim())) {
        issues.push(`Skills category ${index + 1}: At least one skill item is required`)
      }
    })
  }
  
  // Certifications validation (if visible and has items)
  if (r.sectionConfig?.visibility?.certifications && r.certifications?.length > 0) {
    r.certifications.forEach((cert, index) => {
      if (!cert.name?.trim()) issues.push(`Certification ${index + 1}: Name is required`)
    })
  }
  
  // Projects validation (if visible and has items)
  if (r.sectionConfig?.visibility?.projects && r.projects?.length > 0) {
    r.projects.forEach((proj, index) => {
      if (!proj.name?.trim()) issues.push(`Project ${index + 1}: Name is required`)
    })
  }
  
  // Awards validation (if visible and has items)
  if (r.sectionConfig?.visibility?.awards && r.awards?.length > 0) {
    r.awards.forEach((award, index) => {
      if (!award.name?.trim()) issues.push(`Award ${index + 1}: Name is required`)
    })
  }
  
  // Publications validation (if visible and has items)
  if (r.sectionConfig?.visibility?.publications && r.publications?.length > 0) {
    r.publications.forEach((pub, index) => {
      if (!pub.title?.trim()) issues.push(`Publication ${index + 1}: Title is required`)
    })
  }
  
  // Languages validation (if visible and has items)
  if (r.sectionConfig?.visibility?.languages && r.languages?.length > 0) {
    r.languages.forEach((lang, index) => {
      if (!lang.name?.trim()) issues.push(`Language ${index + 1}: Name is required`)
      if (!lang.level?.trim()) issues.push(`Language ${index + 1}: Level is required`)
    })
  }
  
  // Custom sections validation (if visible and has items)
  if (r.sectionConfig?.visibility?.customSections && r.customSections?.length > 0) {
    r.customSections.forEach((section, sectionIndex) => {
      if (!section.title?.trim()) issues.push(`Custom section ${sectionIndex + 1}: Title is required`)
      if (section.items?.length > 0) {
        section.items.forEach((item, itemIndex) => {
          if (!item.heading?.trim()) {
            issues.push(`Custom section ${sectionIndex + 1}, item ${itemIndex + 1}: Heading is required`)
          }
        })
      }
    })
  }
  
  return issues
}

export function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

