import { emptyBin } from "./emptyBin";
import type { LoginResponse } from "../../types/login";

async function deleteEntity(url: string, body: object, token: string, entityType: string, entityName: string): Promise<void> 
{
    try 
    {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Cookie: `token=${token}`,
            },
            body: JSON.stringify(body),
        });

        if (response.ok) 
        {
            console.log(`✓ ${entityType} '${entityName}' deleted successfully`);
        }
        else 
        {
            console.error(`✗ Failed to delete ${entityType.toLowerCase()} '${entityName}': ${response.status} ${response.statusText}`);
        }
    }
    catch (error) 
    {
        console.error(`✗ Error deleting ${entityType.toLowerCase()} '${entityName}':`, error);
    }

    await new Promise(resolve => setTimeout(resolve, 500));
}

export async function deleteAi(data: LoginResponse): Promise<void> 
{
    // Delete folders first (this will delete AIs inside them)
    if (data?.farmer?.folders?.length) 
    {
        console.log(`Deleting ${data.farmer.folders.length} folder(s)...`);

        for (const folder of data.farmer.folders) 
        {
            await deleteEntity(
                "https://leekwars.com/api/ai-folder/delete",
                {
                    folder_id: folder.id 
                },
                data.token,
                "Folder",
                `${folder.name} (ID: ${folder.id})`
            );
        }
    }

    // Delete only AIs that are NOT in a folder (folder_id == 0)
    if (data?.farmer?.ais) 
    {
        const rootAis = data.farmer.ais.filter(ai => (ai.folder ?? ai.folder_id ?? 0) === 0);
        
        if (rootAis.length > 0) 
        {
            console.log(`\nDeleting ${rootAis.length} root AI(s)...`);

            for (const ai of rootAis) 
            {
                await deleteEntity(
                    "https://leekwars.com/api/ai/delete",
                    {
                        ai_id: ai.id 
                    },
                    data.token,
                    "AI",
                    `${ai.name} (ID: ${ai.id})`
                );
            }
        }
    }

    console.log("\nEmptying bin...");
    await emptyBin(data.token);
}
