import { generateWorkdir } from "./functions/workDir";
import { deleteAi } from "./functions/deleteAi";
import { login } from "./functions/login";
import { createAi } from "./functions/createAi";
import { getCode } from "./functions/getCode";
import { saveCode } from "./functions/saveCode";
import type { LoginResponse } from "../types/login";

// Login and get user data
const loginResp = await login();
const data: LoginResponse = await loginResp.json();

if (!data?.token) 
{
    throw new Error("Login did not return a token.");
}

// Prompt user for operation
function promptUser(): Promise<string> 
{
    return new Promise((resolve) => 
    {
        console.log("\nChoose an operation:");
        console.log("  1. create  - Create folders and AIs from workdir");
        console.log("  2. delete  - Delete all AIs and folders ⚠️  WARNING: IRREVERSIBLE!");
        console.log("  3. workdir - Download code to work directory");
        console.log("  4. save    - Upload code from workdir to LeekWars");
        console.log("  q. quit    - Exit the script");
        console.log("\nUsage: bun run start <operation>\n");
        
        process.stdout.write("Enter choice: ");
        process.stdin.setEncoding("utf8");
        process.stdin.once("data", (chunk) => 
        {
            resolve(chunk.toString().trim().toLowerCase());
        });
    });
}

// Confirm deletion
function confirmDeletion(): Promise<boolean> 
{
    return new Promise((resolve) => 
    {
        console.log("\n⚠️  WARNING: This will delete ALL your AIs and folders from LeekWars!");
        console.log("This action is IRREVERSIBLE and cannot be undone.\n");
        process.stdout.write("Type 'yes' to confirm deletion: ");
        process.stdin.setEncoding("utf8");
        process.stdin.once("data", (chunk) => 
        {
            const response = chunk.toString().trim().toLowerCase();
            resolve(response === "yes");
        });
    });
}

type OperationName = "create" | "delete" | "workdir" | "save";

// Map numeric shortcuts to operation names
const operationAliases: Record<string, OperationName> = {
    "1": "create",
    "2": "delete",
    "3": "workdir",
    "4": "save",
};

// Map operations to their handlers
const operations: Record<OperationName, () => Promise<void>> = {
    "create": async () => createAi(data.token),
    "delete": async () => 
    {
        const confirmed = await confirmDeletion();
        if (!confirmed) 
        {
            console.log("\nDeletion cancelled.");
            return;
        }
        await deleteAi(data);
    },
    "workdir": async () => 
    {
        const codeMap = await getCode(data);
        await generateWorkdir(data, "./workdir", codeMap);
    },
    "save": async () => saveCode(data),
};

// Execute operation
const input = process.argv[2] || await promptUser();

// Handle quit command
if (input === "q" || input === "quit") 
{
    console.log("\nExiting...");
    process.exit(0);
}

const operation = (operationAliases[input] || input) as OperationName;
const handler = operations[operation];

if (handler) 
{
    await handler();
}
else 
{
    console.log("Invalid operation. Use 'create', 'delete', 'workdir', 'save', or 'q' to quit.");
    process.exit(1);
}

process.exit(0);