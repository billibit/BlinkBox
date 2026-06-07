import { getState } from "./mock-store";

export async function getCurrentUser() {
  return getState().users.find((user) => user.role === "user") ?? null;
}

export async function requireAdmin() {
  const admin = getState().users.find((user) => user.role === "admin");
  if (!admin) {
    throw new Error("Admin user is not configured");
  }

  return admin;
}
