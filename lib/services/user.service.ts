import api from "../axios";
import { UpdateUserProfilePayload } from "./types";

export async function updateUserProfile(userData: UpdateUserProfilePayload) {
  try {
    const response = await api.patch(`/account/profile`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}
