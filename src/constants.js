export const DOCTORS = [
  { id: 1, name: "Dr. Ana Reyes", specialty: "General Medicine", slots: ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"] },
  { id: 2, name: "Dr. Marco Santos", specialty: "Pediatrics", slots: ["8:00 AM", "11:00 AM", "1:00 PM", "4:00 PM"] },
  { id: 3, name: "Dr. Clara Tan", specialty: "Internal Medicine", slots: ["9:30 AM", "10:30 AM", "2:30 PM"] },
];

export const TODAY = new Date().toISOString().split("T")[0];

export const colors = {
  bg: "#f0f4f8",
  card: "#ffffff",
  primary: "#1a6b8a",
  primaryLight: "#e8f4f8",
  accent: "#e8734a",
  text: "#1a2332",
  muted: "#6b7a8d",
  border: "#d1dce8",
  success: "#2a9d5c",
  danger: "#c0392b",
};
