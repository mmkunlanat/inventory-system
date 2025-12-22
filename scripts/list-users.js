import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        const db = client.db();
        const users = await db.collection('users').find({}).toArray();
        console.log("Users in DB:");
        users.forEach(u => {
            console.log(`- Username: ${u.username}, Role: ${u.role}`);
        });
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
run();
