import { app } from "./src/server/serverApp.mjs";
import ENV from "./config.mjs"
import "./src/server/routes.mjs"

// import jwt from "jsonwebtoken";

// const payload = { user: "admin" };
// const secret = ENV.jwt_secret;
// const token = jwt.sign(payload, secret); 

// console.log('====================================');
// console.log('Generated JWT Token:', token);
// console.log('====================================');

// Bareer_Token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWRtaW4iLCJpYXQiOjE3NDg1MzgzMTZ9.1ib_Q5WN4_cV61MoWTDkViRbeAeZmdLRQiIyDiA-6ZM
app.listen(ENV.port, () => {
    console.log('Server is start');
})

