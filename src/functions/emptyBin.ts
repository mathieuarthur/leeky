export async function emptyBin(token: string): Promise<void> 
{
    const response = await fetch("https://leekwars.com/api/ai/bin", {
        method: "DELETE",
        headers: {
            Cookie: `token=${token}` 
        },
    });

    if (response.ok) 
    {
        console.log("✓ bin emptied successfully");
    } 
    else 
    {
        console.error(`✗ Failed to empty bin: ${response.status} ${response.statusText}`);
    }
}
