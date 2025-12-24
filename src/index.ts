import { writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { generateWorkdir } from "./functions/workDir";
import { deleteAi } from "./functions/deleteAi";
import { login } from "./functions/login";
import { createAi } from "./functions/createAi";
import type { LoginResponse } from "../types/login";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const loginResp = await login();
const data: LoginResponse = await loginResp.json();

// Write the fetched data to a JSON file at the project root
const outPath = join(__dirname, "..", "data.json");
await writeFile(outPath, JSON.stringify(data, null, 2));


// Use the received token to create a new AI file
if (!data?.token) {
    throw new Error("Login did not return a token. Cannot create AI file.");
}

// Wrapper function to create "didier" AI
async function createDidier() {
    await createAi(data.token);
}

// Wrapper function to delete "didier" AI
async function deleteDidier() {
    await deleteAi(data);
}

async function workDir()
{
    await generateWorkdir(data);
}

// Prompt user for operation
function promptUser(): Promise<string> {
    return new Promise((resolve) => {
        console.log("\nChoose an operation:");
        console.log("1. create - Create AI named 'didier'");
        console.log("2. delete - Delete AI named 'didier'");
        console.log("3. workdir - Generate work directory structure\n");
        console.log("Or use: bun run start create|delete\n");
        
        process.stdout.write("Enter choice (create/delete/workdir): ");
        process.stdin.setEncoding("utf8");
        process.stdin.once("data", (chunk) => {
            resolve(chunk.toString().trim().toLowerCase());
        });
    });
}

// Determine operation from argv or prompt
const operation = process.argv[2] || await promptUser();

if (operation === "create" || operation === "1") {
    await createDidier();
} else if (operation === "delete" || operation === "2") {
    await deleteDidier();
} else if (operation === "workdir" || operation === "3") {
    await workDir();
} else {
    console.log("Invalid operation. Use 'create', 'delete', or 'workdir'.");
    process.exit(1);
}

process.exit(0);