import api from "../axios";

export async function updateUserProfile(userId: string, userData: {
    name: string;
    lastName: string;
    biografia: string;
    curso: string;
    fotoPerfil: string;
    semestre: number;
    }): Promise<void> {
    try {
        const response = await api.put(`/users/${userId}`, userData);
        return response.data;
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
}