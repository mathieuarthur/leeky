import { readdir, readFile } from "fs/promises";
import { join } from "path";
import type { LoginResponse } from "../../types/login";
import type { AI } from "../../types/ai";

export async function saveCode(data: LoginResponse, baseDir = "./workdir") 
{
    // Step 1: Get farmer AIs with fresh IDs
    console.log("Fetching current AI list...");
  
    const response = await fetch("https://leekwars.com/api/ai/get-farmer-ais", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Cookie: `token=${data.token}`,
        },
    });

    if (!response.ok) 
    {
        console.error(`✗ Failed to fetch AI list: ${response.status} ${response.statusText}`);
        return;
    }

    const result: any = await response.json();
    const ais: AI[] = result.ais || result.farmer_ais || [];
  
    if (ais.length === 0) 
    {
        console.log("✗ No AIs found on LeekWars");
        return;
    }

    console.log(`Found ${ais.length} AI(s) on LeekWars`);

    // Step 2: Create a map of AI names to IDs
    const aiMap = new Map<string, number>();
    for (const ai of ais) 
    {
        aiMap.set(ai.name, ai.id);
    }

    // Step 3: Scan workdir and upload code
    console.log("\nUploading code...");
    const files = await scanLeekFiles(baseDir);

    for (const file of files) 
    {
        const aiName = file.name.replace(".leek", "");
        const aiId = aiMap.get(aiName);

        if (!aiId) 
        {
            console.log(`⚠️  AI '${aiName}' not found on LeekWars, skipping...`);
            continue;
        }

        try 
        {
            // Read the file content
            const content = await readFile(file.path, "utf-8");

            if (!content || content.trim().length === 0) 
            {
                console.log(`⚠️  AI '${aiName}' has no code, skipping...`);
                continue;
            }

            // Save code to LeekWars
            const saveResponse = await fetch("https://leekwars.com/api/ai/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `token=${data.token}`,
                },
                body: JSON.stringify({
                    ai_id: aiId,
                    code: content,
                }),
            });

            if (saveResponse.ok) 
            {
                console.log(`✓ Code uploaded for AI '${aiName}' (${content.length} chars)`);
            }
            else 
            {
                console.error(`✗ Failed to upload code for AI '${aiName}': ${saveResponse.status} ${saveResponse.statusText}`);
            }
        }
        catch (error) 
        {
            console.error(`✗ Error uploading code for AI '${aiName}':`, error);
        }

        // Wait to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log("\n✓ Code upload complete");
}

async function scanLeekFiles(dir: string): Promise<Array<{ path: string, name: string }>> 
{
    const files: Array<{ path: string, name: string }> = [];
    const entries = await readdir(dir, {
        withFileTypes: true 
    });

    for (const entry of entries) 
    {
        const fullPath = join(dir, entry.name);

        if (entry.isDirectory()) 
        {
            const subFiles = await scanLeekFiles(fullPath);
            files.push(...subFiles);
        }
        else if (entry.isFile() && entry.name.endsWith(".leek")) 
        {
            files.push({
                path: fullPath,
                name: entry.name 
            });
        }
    }

    return files;
}
