import { mockFees } from "../utils/MockData";

export const getFees = async (studentId) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockFees[studentId] || {}), 500);
  });
};
