import express from "express";

export const app = express()

import { main } from "./src/config/dbConfig.js"
import routers from "./src/routes/index.js"
import bodyParser from "body-parser";
import * as dotenv from 'dotenv';
dotenv.config()

app.use(bodyParser.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(routers)

export async function server() {
    await main()
    if (process.env.NODE_ENV === "test") {
        app.listen(process.env.TEST_PORT, () => {
            console.log(`app is running on port ${process.env.TEST_PORT}`);
        })
    }
    else {
        app.listen(process.env.PORT, () => {
            console.log(`app is running on port ${process.env.PORT}`);
        })
    }
}
