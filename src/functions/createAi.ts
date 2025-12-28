import { readdir } from "fs/promises";
import { join } from "path";
import type { FolderMapping, DirectoryStructure } from "../../types/api";

async function apiRequest(
    url: string,
    body: object,
    token: string
): Promise<any> 
{
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: `token=${token}`,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) 
    {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    return response.json();
}

export async function createAi(token: string, baseDir = "./workdir"): Promise<void> 
{
    const folderMapping: FolderMapping = {
    };
    const structure = await scanDirectory(baseDir);

    // Create folders on LeekWars
    console.log("\nCreating folders...");
    for (const folder of structure.folders) 
    {
        const folderName = folder.split("/").pop()!;

        try 
        {
            const result = await apiRequest(
                "https://leekwars.com/api/ai-folder/new-name",
                {
                    folder_id: 0,
                    name: folderName 
                },
                token
            );

            const folderId = result.id || result.folder_id || result.folder?.id;
            folderMapping[folder] = folderId;
            console.log(`✓ Folder '${folderName}' created (ID: ${folderId})`);
        }
        catch (error) 
        {
            console.error(`✗ Error creating folder '${folderName}':`, error);
        }

        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Create AIs
    console.log("\nCreating AIs...");
    for (const file of structure.files) 
    {
        const folderPath = file.path.substring(0, file.path.lastIndexOf("/"));
        const folderId = folderMapping[folderPath] || 0;
        const aiName = file.name.replace(".leek", "");

        try 
        {
            const result = await apiRequest(
                "https://leekwars.com/api/ai/new-name",
                {
                    folder_id: folderId,
                    name: aiName,
                    version: 4 
                },
                token
            );

            const aiId = result.id || result.ai_id || result.ai?.id;
            const location = folderId === 0 ? "root" : folderPath.split("/").pop();
            console.log(`✓ AI '${aiName}' created in ${location} (ID: ${aiId})`);
        }
        catch (error) 
        {
            console.error(`✗ Error creating AI '${aiName}':`, error);
        }

        await new Promise(resolve => setTimeout(resolve, 500));
    }
}

async function scanDirectory(dir: string): Promise<DirectoryStructure> 
{
    const folders: string[] = [];
    const files: DirectoryStructure['files'] = [];

    async function scan(currentDir: string): Promise<void> 
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
            else if (entry.name.endsWith(".leek")) 
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
