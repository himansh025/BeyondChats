const mongoose = require('mongoose');
const Article = require('../models/Article');
require('dotenv').config();

async function clear() {
    try {
        console.log(process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const result = await Article.deleteMany({});
        console.log(`🗑️  Deleted ${result.deletedCount} articles`);

        mongoose.disconnect();
        console.log('✅ Done');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

clear();
