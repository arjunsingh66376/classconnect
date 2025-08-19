

// Function to get student info by ID
export async function getStudentInfo(studentId) {
    try {
      const response = await fetch(`http://192.168.1.211:5000/api/studentinfo?studentId=${studentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch student info');
      }
      // Return parsed JSON data
      return await response.json();
    } catch (error) {
      console.error('Error fetching student info:', error);
      return null;
    }
  }
  