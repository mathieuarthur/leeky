import { readdir, readFile } from "fs/promises";
import { join } from "path";

interface FolderMapping {
  [localPath: string]: number; // Maps local folder path to LeekWars folder_id
}

export async function createAi(token: string, baseDir = "./workdir") 
{
    const folderMapping: FolderMapping = {};

    // Step 1: Get all directories and files
    const structure = await scanDirectory(baseDir, baseDir);

    // Step 2: Create folders on LeekWars
    console.log("\nCreating folders...");
    for (const folder of structure.folders) 
    {
        const folderName = folder.split("/").pop()!;
    
        try 
        {
            const response = await fetch("https://leekwars.com/api/ai-folder/new-name", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `token=${token}`,
                },
                body: JSON.stringify({ 
                    folder_id: 0,  // Create in root for now (can be improved for nested folders)
                    name: folderName 
                }),
            });

            if (response.ok) 
            {
                const result: any = await response.json();
                const folderId = result.id || result.folder_id || result.folder?.id;
                folderMapping[folder] = folderId;
                console.log(`✓ Folder '${folderName}' created (ID: ${folderId})`);
            }
            else 
            {
                console.error(`✗ Failed to create folder '${folderName}': ${response.status} ${response.statusText}`);
            }
        }
        catch (error) 
        {
            console.error(`✗ Error creating folder '${folderName}':`, error);
        }

        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Step 3: Create AIs (empty, without code for now)
    console.log("\nCreating AIs...");
    for (const file of structure.files) 
    {
        const relativePath = file.path.replace(baseDir + "/", "");
        const folderPath = file.path.substring(0, file.path.lastIndexOf("/"));
        const folderId = folderMapping[folderPath] || 0;
        const aiName = file.name.replace(".leek", "");

        try 
        {
            // Create AI
            const createResponse = await fetch("https://leekwars.com/api/ai/new-name", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `token=${token}`,
                },
                body: JSON.stringify({
                    folder_id: folderId,
                    name: aiName,
                    version: 4,
                }),
            });

            if (createResponse.ok) 
            {
                const createResult: any = await createResponse.json();
                const aiId = createResult.id || createResult.ai_id || createResult.ai?.id;
                const location = folderId === 0 ? "root" : folderPath.split("/").pop();
                console.log(`✓ AI '${aiName}' created in ${location} (ID: ${aiId})`);
            }
            else 
            {
                console.error(`✗ Failed to create AI '${aiName}': ${createResponse.status} ${createResponse.statusText}`);
            }
        }
        catch (error) 
        {
            console.error(`✗ Error creating AI '${aiName}':`, error);
        }

        await new Promise(resolve => setTimeout(resolve, 500));
    }
}

async function scanDirectory(dir: string, baseDir: string): Promise<{ folders: string[], files: Array<{ path: string, name: string }> }> 
{
    const folders: string[] = [];
    const files: Array<{ path: string, name: string }> = [];

    async function scan(currentDir: string) 
    {
        const entries = await readdir(currentDir, {
            withFileTypes: true 
        });

        for (const entry of entries) 
        {
            const fullPath = join(currentDir, entry.name);

            if (entry.isDirectory()) 
            {
                folders.push(fullPath);
                await scan(fullPath);
            }
            else if (entry.isFile() && entry.name.endsWith(".leek")) 
            {
                files.push({
                    path: fullPath,
                    name: entry.name 
                });
            }
        }
    }

    await scan(dir);
    return {
        folders,
        files 
    };
}
