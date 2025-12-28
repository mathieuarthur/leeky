import type { LoginResponse } from "../../types/login";
import type { AIResponse } from "../../types/api";

export async function getCode(data: LoginResponse): Promise<Map<number, string>> 
{
    const codeMap = new Map<number, string>();

    if (!data?.farmer?.ais) 
    {
        console.log("✗ No AIs found in data");
        return codeMap;
    }

    console.log(`Fetching code for ${data.farmer.ais.length} AI(s)...`);

    const headers = {
        "Content-Type": "application/json",
        Cookie: `token=${data.token}`,
    };

    for (const ai of data.farmer.ais) 
    {
        try 
        {
            const response = await fetch(`https://leekwars.com/api/ai/get/${ai.id}`, {
                method: "GET",
                headers,
            });

            if (response.ok) 
            {
                const result: AIResponse = await response.json();

                if (result.ai?.code) 
                {
                    codeMap.set(ai.id, result.ai.code);
                    console.log(`✓ Retrieved code for AI '${ai.name}' (ID: ${ai.id}) - ${result.ai.code.length} chars`);
                }
                else 
                {
                    console.error(`✗ No code found for AI '${ai.name}' (ID: ${ai.id})`);
                }
            }
            else 
            {
                console.error(`✗ Failed to retrieve AI '${ai.name}': ${response.status} ${response.statusText}`);
            }
        }
        catch (error) 
        {
            console.error(`✗ Error fetching AI '${ai.name}':`, error);
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    return codeMap;
}
