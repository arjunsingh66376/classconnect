export async function getReportCard(studentId, term) {
    const response = await fetch(`http://192.168.1.211:5000/api/reports?studentId=${studentId}&term=${term}`);
  return await response.json();
}

