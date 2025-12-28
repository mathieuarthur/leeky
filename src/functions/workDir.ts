import { mkdir, writeFile, rm } from "fs/promises";
import { join } from "path";
import type { LoginResponse } from "../../types/login";

export async function generateWorkdir(
    data: LoginResponse,
    baseDir = "./workdir",
    codeMap?: Map<number, string>
) 
{
    // Remove and recreate workdir
    await rm(baseDir, {
        recursive: true,
        force: true 
    });
    await mkdir(baseDir, {
        recursive: true 
    });

    // Early return if no AIs
    if (!data?.farmer?.ais) 
    {
        console.log(`✓ Workdir generated at ${baseDir}`);
        return;
    }

    // Build folder map
    const folderMap = new Map<number, string>();
    data.farmer.folders?.forEach(folder => folderMap.set(folder.id, folder.name));

    // Process each AI
    for (const ai of data.farmer.ais) 
    {
        const folderId = ai.folder ?? ai.folder_id ?? 0;
        const folderName = folderMap.get(folderId) || String(folderId);
        const folderPath = folderId === 0 ? baseDir : join(baseDir, folderName);
        const filePath = join(folderPath, `${ai.name}.leek`);

        // Create folder if needed (mkdir recursive handles parent creation)
        await mkdir(folderPath, {
            recursive: true 
        });

        // Get code content
        const content = codeMap?.get(ai.id) ?? "";
        
        if (content) 
        {
            console.log(`✅ Adding code for AI ${ai.name} (${content.length} chars)`);
        }
        else 
        {
            console.log(`⚠️  No code found for AI ${ai.name} (ID: ${ai.id})`);
        }

        await writeFile(filePath, content);
        console.log(`✓ Created ${folderId === 0 ? "." : folderName}/${ai.name}.leek`);
    }

    console.log(`✓ Workdir generated at ${baseDir}`);
}