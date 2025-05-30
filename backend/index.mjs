import { app } from "./src/server/serverApp.mjs";
import ENV from "./config.mjs"
import "./src/server/routes.mjs"

// Bareer_Token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWRtaW4iLCJpYXQiOjE3NDg1MzgzMTZ9.1ib_Q5WN4_cV61MoWTDkViRbeAeZmdLRQiIyDiA-6ZM
app.listen(ENV.port, () => {
    console.log('Server is start');
})

