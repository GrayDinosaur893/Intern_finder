const COLLEGE_KEY = 'college_login_counts';
const UNIQUE_USERS_KEY = 'college_unique_users';

// Record a login only if this userId (email) hasn't been seen before for this college
export function recordLogin(collegeName, userId) {
  if (!collegeName || !userId) return;

  const normalizedCollege = collegeName.toLowerCase().trim();
  const normalizedUser = userId.toLowerCase().trim();

  // Load unique users map: { collegeName: Set<userId> }
  const uniqueMap = JSON.parse(localStorage.getItem(UNIQUE_USERS_KEY) || '{}');
  if (!uniqueMap[normalizedCollege]) {
    uniqueMap[normalizedCollege] = [];
  }

  // If already seen this user, do NOT increment
  if (uniqueMap[normalizedCollege].includes(normalizedUser)) {
    return;
  }

  // New unique user — record them
  uniqueMap[normalizedCollege].push(normalizedUser);
  localStorage.setItem(UNIQUE_USERS_KEY, JSON.stringify(uniqueMap));

  // Increment college count
  const counts = JSON.parse(localStorage.getItem(COLLEGE_KEY) || '{}');
  counts[normalizedCollege] = (counts[normalizedCollege] || 0) + 1;
  localStorage.setItem(COLLEGE_KEY, JSON.stringify(counts));
}

// Get unique student count for a college
export function getCollegeCount(collegeName) {
  if (!collegeName) return 0;
  const normalizedCollege = collegeName.toLowerCase().trim();
  const counts = JSON.parse(localStorage.getItem(COLLEGE_KEY) || '{}');
  return counts[normalizedCollege] || 0;
}

// Alias kept for backward compat
export const getStreamCount = getCollegeCount;

// Reset all counts and tracked users
export function clearCollegeCounts() {
  localStorage.removeItem(COLLEGE_KEY);
  localStorage.removeItem(UNIQUE_USERS_KEY);
}