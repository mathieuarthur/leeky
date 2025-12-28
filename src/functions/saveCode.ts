import { readdir, readFile } from "fs/promises";
import { join } from "path";
import type { LoginResponse } from "../../types/login";
import type { AI } from "../../types/ai";
import type { LeekFile } from "../../types/api";

export async function saveCode(data: LoginResponse, baseDir = "./workdir"): Promise<void> 
{
    // Fetch current AI list
    console.log("Fetching current AI list...");
    const headers = {
        "Content-Type": "application/json",
        Cookie: `token=${data.token}`,
    };

    const response = await fetch("https://leekwars.com/api/ai/get-farmer-ais", {
        method: "GET",
        headers,
    });

    if (!response.ok) 
    {
        console.error(`✗ Failed to fetch AI list: ${response.status} ${response.statusText}`);
        return;
    }

    const result = await response.json();
    const ais: AI[] = result.ais || result.farmer_ais || [];

    if (ais.length === 0) 
    {
        console.log("✗ No AIs found on LeekWars");
        return;
    }

    console.log(`Found ${ais.length} AI(s) on LeekWars`);

    // Build AI name to ID map
    const aiMap = new Map(ais.map(ai => [ai.name, ai.id]));

    // Scan and upload code
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

        const content = await readFile(file.path, "utf-8");

        if (!content.trim()) 
        {
            console.log(`⚠️  AI '${aiName}' has no code, skipping...`);
            continue;
        }

        try 
        {
            const saveResponse = await fetch("https://leekwars.com/api/ai/save", {
                method: "POST",
                headers,
                body: JSON.stringify({
                    ai_id: aiId,
                    code: content 
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

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log("\n✓ Code upload complete");
}

async function scanLeekFiles(dir: string): Promise<LeekFile[]> 
{
    const files: LeekFile[] = [];
    const entries = await readdir(dir, {
        withFileTypes: true 
    });

    for (const entry of entries) 
    {
        const fullPath = join(dir, entry.name);

        if (entry.isDirectory()) 
        {
            files.push(...await scanLeekFiles(fullPath));
        }
        else if (entry.name.endsWith(".leek")) 
        {
            files.push({
                path: fullPath,
                name: entry.name 
            });
        }
    }

    return files;
}
