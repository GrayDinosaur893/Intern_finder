const API_URL =
  'https://opensheet.elk.sh/15ExPw5ifVM_9IOUlp6eERhvy3BCVTghuLLNhskYEIns/data';

export async function fetchStudentData() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Normalize the data to match expected fields
    return data.map((row) => ({
      id: row['Email Address'] || Math.random().toString(36).substr(2, 9),
      name: row['Full Name'] || 'Unknown',
      branch: row['Current Engineering Branch'] || 'CSE',
      skills: row['Skills and Expertise'] || 'N/A',
      cgpa: row['Cumulative Grade Point Average (CGPA)'] || 'N/A',
      email: row['Email Address'] || 'N/A',
      preferredCompany: row['Preferred Domain(s) for Internship'] || 'N/A',
    }));
  } catch (error) {
    console.error('Error fetching student data:', error);
    throw error;
  }
}