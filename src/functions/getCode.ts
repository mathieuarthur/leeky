import type { LoginResponse } from "../../types/login";

interface AIGetResponse {
  success: boolean;
  ai?: {
    id: number;
    code: string;
    [key: string]: any;
  };
}

export async function getCode(data: LoginResponse): Promise<Map<number, string>> 
{
    const codeMap = new Map<number, string>();

    if (!data?.farmer?.ais) 
    {
        console.log("✗ No AIs found in data");
        return codeMap;
    }

    console.log(`Fetching code for ${data.farmer.ais.length} AI(s)...`);

    for (const ai of data.farmer.ais) 
    {
        try 
        {
            const response = await fetch(
                `https://leekwars.com/api/ai/get/${ai.id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Cookie: `token=${data.token}`,
                    }
                }
            );

            if (response.ok) 
            {
                const result: any = await response.json();
        
                // Check if code exists in the ai object
                if (result.ai?.code) 
                {
                    codeMap.set(ai.id, result.ai.code);
                    console.log(`✓ Retrieved code for AI '${ai.name}' (ID: ${ai.id}) - ${result.ai.code.length} chars`);
                }
                else 
                {
                    console.error(`✗ No code found for AI '${ai.name}' (ID: ${ai.id})`);
                    console.error(`Response:`, result);
                }
            }
            else 
            {
                const errorBody = await response.text();
                console.error(
                    `✗ Failed to retrieve AI '${ai.name}': ${response.status} ${response.statusText}`
                );
                console.error(`Response body:`, errorBody);
                console.error(`Request URL:`, `https://leekwars.com/api/ai/get?ai_id=${ai.id}`);
                console.error(`Token (first 20 chars):`, data.token?.substring(0, 20));
            }
        }
        catch (error) 
        {
            console.error(`✗ Error fetching AI '${ai.name}':`, error);
        }

        await new Promise(resolve => setTimeout(resolve, 500)); // Slight delay to avoid rate limiting
    }

    return codeMap;
}
