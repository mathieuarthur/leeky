import type { LoginResponse } from "../../types/login";

export function getAiIdByName(data: LoginResponse, name: string): number | null | undefined 
{
    if (!data?.farmer?.ais || !Array.isArray(data.farmer.ais)) 
    {
        return null;
    }
    for (const ai of data.farmer.ais) 
    {
        if (ai?.name === name) 
        {
            return ai?.id;
        }
    }
    return null;
}
