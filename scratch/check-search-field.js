require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('artists');

    const sample = await collection.findOne({ "location.city": { $exists: true } });
    console.log("Sample Artist Location:", JSON.stringify(sample?.location, null, 2));
    console.log("Sample Artist Search Field:", JSON.stringify(sample?.search, null, 2));

    const missingSearch = await collection.countDocuments({ search: { $exists: false } });
    console.log("Artists missing search field:", missingSearch);

  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
