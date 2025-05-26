import { app } from "./src/server/serverApp.mjs";
import ENV from "./config.mjs"
import "./src/server/routes.mjs"

// Bareer_Token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDc4NjIyMzAsImV4cCI6MTc0ODQ2NzAzMH0.99o5-Y7cm7D8MctyrA0g84jhSaZ01K0mvKjTuAamqrA
app.listen(ENV.port, () => {
    console.log('Server is start');
})

