import { createClient } from "redis";
const redisClient = createClient();

redisClient.on("error", (err) => console.error("Redis Error", err))

await redisClient.connect();

export default redisClient;




