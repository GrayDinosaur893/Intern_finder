// Normalize text for flexible matching
function normalize(text) {
  if (!text) return '';
  return text.toLowerCase().replace(/[^a-z]/g, '');
}

// Keywords to identify BIT Bhilai
const keywords = [
  'bitbhilai',
  'bhilaiinstituteoftechnology',
  'bitdurg',
  'bitbhilaiinstituteoftechnologydurg',
];

// Extract college field from user data
function extractCollege(user) {
  return (
    user['College'] ||
    user['College Name'] ||
    user['Institute'] ||
    user['Institution'] ||
    user['Current Engineering Branch'] ||
    ''
  );
}

// Check if user belongs to BIT Bhilai
export function isBITBhilai(user) {
  const collegeRaw = extractCollege(user);
  const normalized = normalize(collegeRaw);
  return keywords.some((k) => normalized.includes(k));
}