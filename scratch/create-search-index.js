require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("ERROR: MONGODB_URI is not defined in .env.local");
  process.exit(1);
}

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('artists');

    // Create text index on name, category, and about
    await collection.createIndex({
      name: 'text',
      category: 'text',
      about: 'text',
      'location.city': 'text',
      'location.state': 'text'
    }, {
      name: 'ArtistSearchIndex',
      weights: {
        name: 10,
        category: 5,
        about: 1
      }
    });

    console.log('Text index created successfully on artists collection.');
  } catch (error) {
    console.error('Error creating index:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
