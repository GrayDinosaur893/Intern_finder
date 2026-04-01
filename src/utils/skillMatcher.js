// Skill to Domain mapping
const SKILL_DOMAIN_MAP = {
  // Web Development Skills
  'react': 'web_development',
  'javascript': 'web_development',
  'html': 'web_development',
  'css': 'web_development',
  'frontend': 'web_development',
  'backend': 'web_development',
  'node.js': 'web_development',
  'nodejs': 'web_development',
  'express': 'web_development',
  'vue': 'web_development',
  'angular': 'web_development',
  'typescript': 'web_development',
  'next.js': 'web_development',
  'fullstack': 'web_development',
  'full stack': 'web_development',
  'web development': 'web_development',
  'mern': 'web_development',
  'mean': 'web_development',
  'django': 'web_development',
  'flask': 'web_development',
  'php': 'web_development',
  'laravel': 'web_development',
  'ruby on rails': 'web_development',
  'spring boot': 'web_development',
  
  // Cyber Security Skills
  'cybersecurity': 'cyber_security',
  'security': 'cyber_security',
  'ethical hacking': 'cyber_security',
  'penetration testing': 'cyber_security',
  'network security': 'cyber_security',
  'information security': 'cyber_security',
  'cryptography': 'cyber_security',
  'vulnerability assessment': 'cyber_security',
  'incident response': 'cyber_security',
  'forensics': 'cyber_security',
  'cissp': 'cyber_security',
  'ceh': 'cyber_security',
  'security+': 'cyber_security',
  'comptia security': 'cyber_security',
  
  // Game Development Skills
  'game development': 'game_development',
  'unity': 'game_development',
  'unreal engine': 'game_development',
  'c#': 'game_development',
  'csharp': 'game_development',
  'game design': 'game_development',
  '3d modeling': 'game_development',
  'blender': 'game_development',
  'maya': 'game_development',
  'game programming': 'game_development',
  'gamedev': 'game_development',
  'godot': 'game_development',
  'phaser': 'game_development',
  
  // App Development Skills
  'app development': 'app_development',
  'mobile development': 'app_development',
  'android': 'app_development',
  'ios': 'app_development',
  'react native': 'app_development',
  'flutter': 'app_development',
  'dart': 'app_development',
  'kotlin': 'app_development',
  'swift': 'app_development',
  'xamarin': 'app_development',
  'mobile app': 'app_development',
  'android development': 'app_development',
  'ios development': 'app_development',
  
  // Mechanical Core Skills
  'mechanical': 'mechanical_core',
  'cad': 'mechanical_core',
  'autocad': 'mechanical_core',
  'solidworks': 'mechanical_core',
  'catia': 'mechanical_core',
  'matlab': 'mechanical_core',
  'ansys': 'mechanical_core',
  'manufacturing': 'mechanical_core',
  'thermodynamics': 'mechanical_core',
  'fluid mechanics': 'mechanical_core',
  'machine design': 'mechanical_core',
  'production': 'mechanical_core',
  'automobile': 'mechanical_core',
  'automotive': 'mechanical_core',
  'mechatronics': 'mechanical_core',
  'robotics': 'mechanical_core',
  
  // Electrical Core Skills
  'electrical': 'electrical_core',
  'electronics': 'electrical_core',
  'circuit design': 'electrical_core',
  'pcb design': 'electrical_core',
  'embedded systems': 'electrical_core',
  'microcontroller': 'electrical_core',
  'arduino': 'electrical_core',
  'raspberry pi': 'electrical_core',
  'plc': 'electrical_core',
  'scada': 'electrical_core',
  'power systems': 'electrical_core',
  'control systems': 'electrical_core',
  'instrumentation': 'electrical_core',
  'vlsi': 'electrical_core',
  'fpga': 'electrical_core',
  'verilog': 'electrical_core',
  'vhdl': 'electrical_core',
  'signals and systems': 'electrical_core',
  'power electronics': 'electrical_core',
  
  // Business Management Skills
  'management': 'business_mgmt',
  'business': 'business_mgmt',
  'marketing': 'business_mgmt',
  'finance': 'business_mgmt',
  'hr': 'business_mgmt',
  'human resources': 'business_mgmt',
  'operations': 'business_mgmt',
  'project management': 'business_mgmt',
  'product management': 'business_mgmt',
  'consulting': 'business_mgmt',
  'strategy': 'business_mgmt',
  'analytics': 'business_mgmt',
  'business analysis': 'business_mgmt',
  'data analysis': 'business_mgmt',
  'excel': 'business_mgmt',
  'sales': 'business_mgmt',
  'entrepreneurship': 'business_mgmt',
  'supply chain': 'business_mgmt',
  'digital marketing': 'business_mgmt',
  'seo': 'business_mgmt',
  'content marketing': 'business_mgmt',
  'social media': 'business_mgmt',
  'brand management': 'business_mgmt',
  'mba': 'business_mgmt',
};

// Domain to display name mapping
const DOMAIN_DISPLAY_NAMES = {
  'web_development': 'Web Development',
  'cyber_security': 'Cyber Security',
  'game_development': 'Game Development',
  'app_development': 'App Development',
  'mechanical_core': 'Mechanical Core',
  'electrical_core': 'Electrical Core',
  'business_mgmt': 'Business & Management',
};

// Domain to emoji mapping
const DOMAIN_EMOJIS = {
  'web_development': '🌐',
  'cyber_security': '🔒',
  'game_development': '🎮',
  'app_development': '📱',
  'mechanical_core': '⚙️',
  'electrical_core': '⚡',
  'business_mgmt': '💼',
};

/**
 * Parse user skills string into an array of individual skills
 * @param {string} skillsString - Comma or semicolon separated skills
 * @returns {string[]} Array of normalized skill strings
 */
export function parseUserSkills(skillsString) {
  if (!skillsString || typeof skillsString !== 'string') return [];
  
  return skillsString
    .split(/[,\;]/)
    .map(skill => skill.trim().toLowerCase())
    .filter(skill => skill.length > 0);
}

/**
 * Parse user preferred domains string into an array
 * @param {string} domainsString - Comma or semicolon separated domains
 * @returns {string[]} Array of normalized domain strings
 */
export function parsePreferredDomains(domainsString) {
  if (!domainsString || typeof domainsString !== 'string') return [];
  
  return domainsString
    .split(/[,\;]/)
    .map(domain => domain.trim().toLowerCase())
    .filter(domain => domain.length > 0);
}

/**
 * Match user skills to internship domains
 * @param {string} userSkills - User's skills string from "Skills and Expertise" field
 * @returns {Object} Object with matched domains and their matching skills
 */
export function matchSkillsToDomains(userSkills) {
  const skills = parseUserSkills(userSkills);
  
  const domainMatches = {};
  const matchedSkills = {};
  
  // Match skills to domains
  skills.forEach(skill => {
    const domain = SKILL_DOMAIN_MAP[skill];
    if (domain) {
      if (domainMatches[domain]) {
        // Already matched, add skill to list
        matchedSkills[domain].push(skill);
        // Increase score
        domainMatches[domain].score += 10;
      } else {
        domainMatches[domain] = { priority: 'skill_match', score: 10 };
        matchedSkills[domain] = [skill];
      }
    }
  });
  
  return { domainMatches, matchedSkills };
}

/**
 * Check if an internship category matches user's preferred domains
 * @param {string} category - Internship category
 * @param {string} preferredDomains - User's preferred domains string
 * @returns {boolean} True if category matches preferred domains
 */
export function checkPreferredMatch(category, preferredDomains) {
  if (!preferredDomains || typeof preferredDomains !== 'string') return false;
  
  const domains = parsePreferredDomains(preferredDomains);
  
  for (const domain of domains) {
    const normalized = normalizeDomainName(domain);
    if (normalized === category) {
      return true;
    }
  }
  
  return false;
}

/**
 * Check if an internship category matches user's skills or preferred domains
 * @param {string} category - Internship category
 * @param {string} userSkills - User's skills string from "Skills and Expertise" field
 * @param {string} preferredDomains - User's preferred domains string
 * @returns {Object} Match result with isMatch, priority, and matchedSkills
 */
export function checkInternshipMatch(category, userSkills, preferredDomains) {
  // First check preferred domains (higher priority)
  const isPreferred = checkPreferredMatch(category, preferredDomains);
  
  if (isPreferred) {
    return {
      isMatch: true,
      priority: 'preferred',
      score: 100,
      matchedSkills: ['Preferred Domain'],
      displayName: DOMAIN_DISPLAY_NAMES[category] || category,
      emoji: DOMAIN_EMOJIS[category] || '💼',
    };
  }
  
  // Then check skills
  const { domainMatches, matchedSkills } = matchSkillsToDomains(userSkills);
  const match = domainMatches[category];
  
  if (match) {
    return {
      isMatch: true,
      priority: 'skill_match',
      score: match.score,
      matchedSkills: matchedSkills[category] || [],
      displayName: DOMAIN_DISPLAY_NAMES[category] || category,
      emoji: DOMAIN_EMOJIS[category] || '💼',
    };
  }
  
  return {
    isMatch: false,
    priority: null,
    score: 0,
    matchedSkills: [],
    displayName: DOMAIN_DISPLAY_NAMES[category] || category,
    emoji: DOMAIN_EMOJIS[category] || '💼',
  };
}

/**
 * Normalize domain name to internal format
 * Only matches exact domain names - very strict to avoid false positives
 * @param {string} domain - Domain name to normalize
 * @returns {string|null} Normalized domain key or null
 */
function normalizeDomainName(domain) {
  if (!domain || typeof domain !== 'string') return null;
  
  const normalized = domain.toLowerCase().trim();
  
  // Only match exact, complete domain names - no partial matches
  // This prevents false positives from generic words
  const exactMappings = {
    // Web Development - must be explicit
    'web development': 'web_development',
    'web dev': 'web_development',
    'fullstack development': 'web_development',
    'full stack development': 'web_development',
    'full-stack development': 'web_development',
    'frontend development': 'web_development',
    'backend development': 'web_development',
    'mern stack': 'web_development',
    'mean stack': 'web_development',
    
    // Cyber Security - must be explicit
    'cyber security': 'cyber_security',
    'cybersecurity': 'cyber_security',
    'information security': 'cyber_security',
    'network security': 'cyber_security',
    'ethical hacking': 'cyber_security',
    
    // Game Development - must be explicit
    'game development': 'game_development',
    'game dev': 'game_development',
    'video game development': 'game_development',
    'game programming': 'game_development',
    
    // App Development - must be explicit
    'app development': 'app_development',
    'mobile app development': 'app_development',
    'android development': 'app_development',
    'ios development': 'app_development',
    'flutter development': 'app_development',
    'react native development': 'app_development',
    
    // Mechanical Core - must be explicit
    'mechanical engineering': 'mechanical_core',
    'mechanical': 'mechanical_core',
    'production engineering': 'mechanical_core',
    'manufacturing engineering': 'mechanical_core',
    'automobile engineering': 'mechanical_core',
    'automotive engineering': 'mechanical_core',
    
    // Electrical Core - must be explicit
    'electrical engineering': 'electrical_core',
    'electrical': 'electrical_core',
    'electronics engineering': 'electrical_core',
    'instrumentation engineering': 'electrical_core',
    'power systems': 'electrical_core',
    'control systems': 'electrical_core',
    
    // Business & Management - must be explicit
    'business management': 'business_mgmt',
    'business & management': 'business_mgmt',
    'business and management': 'business_mgmt',
    'management': 'business_mgmt',
    'business administration': 'business_mgmt',
    'mba': 'business_mgmt',
    'finance': 'business_mgmt',
    'marketing': 'business_mgmt',
    'human resources': 'business_mgmt',
  };
  
  return exactMappings[normalized] || null;
}

/**
 * Get all available domains with their info
 * @returns {Array} Array of domain objects
 */
export function getAllDomains() {
  return Object.entries(DOMAIN_DISPLAY_NAMES).map(([key, name]) => ({
    key,
    name,
    emoji: DOMAIN_EMOJIS[key] || '💼',
  }));
}

export default {
  parseUserSkills,
  parsePreferredDomains,
  matchSkillsToDomains,
  checkInternshipMatch,
  getAllDomains,
  SKILL_DOMAIN_MAP,
  DOMAIN_DISPLAY_NAMES,
  DOMAIN_EMOJIS,
};