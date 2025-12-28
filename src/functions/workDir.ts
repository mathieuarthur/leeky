import { mkdir, writeFile, rm} from "fs/promises";
import { join } from "path";
import type { LoginResponse } from "../../types/login";

export async function generateWorkdir(
    data: LoginResponse,
    baseDir = "./workdir",
    codeMap?: Map<number, string>
) 
{
    console.log(`📊 CodeMap received: ${codeMap ? `${codeMap.size} entries` : 'undefined'}`);
    if (codeMap) 
    {
        console.log(`🔑 CodeMap keys:`, Array.from(codeMap.keys()));
    }
  
    // Remove existing workdir to start clean
    await rm(baseDir, {
        recursive: true,
        force: true 
    });

    // Create base workdir if it doesn't exist
    await mkdir(baseDir, {
        recursive: true 
    });

    // Create a map of folder id to folder name
    const folderMap: Record<number, string> = {};
    if (data?.farmer?.folders) 
    {
        for (const folder of data.farmer.folders) 
        {
            folderMap[folder.id] = folder.name;
        }
    }

    // Process each AI
    if (data?.farmer?.ais) 
    {
        for (const ai of data.farmer.ais) 
        {
            const folderId = (ai.folder ?? ai.folder_id ?? 0);
            const folderPath =
        folderId === 0 ? baseDir : join(baseDir, folderMap[folderId] || String(folderId));

            // Create folder
            if (folderId !== 0) 
            {
                await mkdir(folderPath, {
                    recursive: true 
                });
            }

            // Create .leek file
            const fileName = `${ai.name}.leek`;
            const filePath = join(folderPath, fileName);
      
            // Write AI info as comment header
            let content = `// AI: ${ai.name}\n// ID: ${ai.id}\n// Version: ${ai.version || 1}\n`;
      
            // Add the actual code if available
            if (codeMap && codeMap.has(ai.id)) 
            {
                const code = codeMap.get(ai.id)!;
                console.log(`✅ Adding code for AI ${ai.name} (${code.length} chars)`);
                content += `\n${code}`;
            }
            else 
            {
                console.log(`⚠️  No code found for AI ${ai.name} (ID: ${ai.id})`);
            }
      
            await writeFile(filePath, content);
            console.log(`✓ Created ${folderId === 0 ? "." : folderMap[folderId] || folderId}/${fileName}`);
        }
    }

    console.log(`✓ Workdir generated at ${baseDir}`);
}