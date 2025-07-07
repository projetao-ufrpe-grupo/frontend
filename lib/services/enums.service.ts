import api from "../axios";

export interface UserInterestResponse {
    value: string;
    description: string;
}

export class EnumsService {
    async getUserInterests(): Promise<UserInterestResponse[]> {
        const response = await api.get<UserInterestResponse[]>('/enums/interesses-usuario');
        return response.data;
    }
}

export const enumsService = new EnumsService();