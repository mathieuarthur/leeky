export async function login(): Promise<Response> 
{
    const login = process.env.LW_LOGIN;
    const password = process.env.LW_PASSWORD;

    if (!login || !password) 
    {
        throw new Error("Missing LW_LOGIN or LW_PASSWORD environment variables.");
    }

    return fetch("https://leekwars.com/api/farmer/login-token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            login,
            password 
        }),
    });
}
