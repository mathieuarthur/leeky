var counter = 0
while (counter < localStorage.length) 
{
    if (localStorage.key(counter).includes("ai/")) 
    {
        localStorage.removeItem(localStorage.key(counter))
    }
    else 
    {
        counter++
    }
}