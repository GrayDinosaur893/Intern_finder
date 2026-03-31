import bitData from '../data/bit_bhilai_variants.json'

export function normalize(text) {
  return text.toLowerCase().replace(/[^a-z]/g, '')
}

// Reads the actual college name from the sheet.
// The column is "College name " (with a trailing space) — do NOT rename this key.
export function extractCollege(user) {
  return (
    user["College name "] ||   // exact key from Google Sheet (trailing space is intentional)
    user["College Name"] ||
    user["College"] ||
    user["Institute"] ||
    user["Institution"] ||
    ""
  )
}

// Reads the engineering branch/stream (separate from college name)
export function extractBranch(user) {
  return user["Current Engineering Branch"] || ""
}

export function isBITBhilai(user) {
  const collegeRaw = extractCollege(user)

  if (!collegeRaw) return false

  console.log('College detected:', collegeRaw)

  const exactMatch = bitData.college_variants.some(
    v => v.toLowerCase().trim() ===
         collegeRaw.toLowerCase().trim()
  )

  const normalized = normalize(collegeRaw)
  // Also check for standalone "bit" which is the raw value in the sheet
  const keywordMatch = bitData.normalized_keywords.some(
    k => normalized.includes(k)
  ) || normalized === 'bit'

  return exactMatch || keywordMatch
}
