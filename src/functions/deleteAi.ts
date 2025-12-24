import { getAiIdByName } from "./getAiIdByName";
import { emptyBin } from "./emptyBin";
import type { LoginResponse } from "../../types/login";

export async function deleteAi(data: LoginResponse) 
{
    const aiIdFromData = getAiIdByName(data, "didier");

    const response = await fetch("https://leekwars.com/api/ai/delete", {
        method: "DELETE",
        headers: {
        "Content-Type": "application/json",
        Cookie: `token=${data.token}`,
        },
        body: JSON.stringify({ ai_id: aiIdFromData }),
    });

    if (response.ok) {
        console.log("✓ AI 'didier' deleted successfully");
        await emptyBin(data.token);
    } else {
        console.error(`✗ Failed to delete AI 'didier': ${response.status} ${response.statusText}`);
    }
}
