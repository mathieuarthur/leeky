import { emptyBin } from "./emptyBin";
import type { LoginResponse } from "../../types/login";

export async function deleteAi(data: LoginResponse) 
{
    // Delete folders first (this will delete AIs inside them)
    if (data?.farmer?.folders && data.farmer.folders.length > 0) 
    {
        console.log(`Deleting ${data.farmer.folders.length} folder(s)...`);

        for (const folder of data.farmer.folders) 
        {
            try 
            {
                const response = await fetch("https://leekwars.com/api/ai-folder/delete", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Cookie: `token=${data.token}`,
                    },
                    body: JSON.stringify({
                        folder_id: folder.id 
                    }),
                });

                if (response.ok) 
                {
                    console.log(`✓ Folder '${folder.name}' (ID: ${folder.id}) deleted successfully`);
                }
                else 
                {
                    console.error(`✗ Failed to delete folder '${folder.name}': ${response.status} ${response.statusText}`);
                }
            }
            catch (error) 
            {
                console.error(`✗ Error deleting folder '${folder.name}':`, error);
            }

            // Wait to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
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
                try 
                {
                    const response = await fetch("https://leekwars.com/api/ai/delete", {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            Cookie: `token=${data.token}`,
                        },
                        body: JSON.stringify({
                            ai_id: ai.id 
                        }),
                    });

                    if (response.ok) 
                    {
                        console.log(`✓ AI '${ai.name}' (ID: ${ai.id}) deleted successfully`);
                    }
                    else 
                    {
                        console.error(`✗ Failed to delete AI '${ai.name}': ${response.status} ${response.statusText}`);
                    }
                }
                catch (error) 
                {
                    console.error(`✗ Error deleting AI '${ai.name}':`, error);
                }

                // Wait to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
    }

    console.log("\nEmptying bin...");
    await emptyBin(data.token);
}
