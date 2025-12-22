const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const uri = process.env.MONGODB_URI;

async function run() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db(); // uses db from uri
        const collection = db.collection('users');

        console.log("Fetching indexes...");
        const indexes = await collection.listIndexes().toArray();
        console.log("Indexes:", JSON.stringify(indexes, null, 2));

        const emailIndex = indexes.find(i => i.name === 'email_1');
        if (emailIndex) {
            console.log("Found email_1 index. Dropping it...");
            await collection.dropIndex('email_1');
            console.log("Dropped email_1");
        } else {
            console.log("email_1 index not found");
        }
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

run();
