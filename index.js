const app = require("./app");
const config = require("./config/config");
const db_connection = require("./config/db");
// const { connectRedis } = require("./config/redis");
const PORT = config.app.port

app.listen(PORT, async ()=>{
    console.log(`http://localhost:${PORT}`);
    await db_connection()
    // await connectRedis()
})