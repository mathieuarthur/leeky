import type { LoginResponse } from "../../types/login";

export function getAiIdByName(data: LoginResponse, name: string): number | null 
{
    return data?.farmer?.ais?.find(ai => ai.name === name)?.id ?? null;
}
