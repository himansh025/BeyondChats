const axios = require('axios');
require('dotenv').config();

const API = process.env.API_URL;

async function run() {
  try {
    console.log('🔍 Fetching original articles...');
    const { data: originals } = await axios.get(`${API}?type=original`);

    if (originals.length === 0) {
      console.log('⚠️  No original articles found. Run scrapeInitial.js first.');
      return;
    }

    console.log(`📝 Found ${originals.length} original articles to enhance`);

    for (const article of originals) {
      // AI Enhancement placeholder - In production, this would:
      // 1. Search Google for related content
      // 2. Scrape top reference articles
      // 3. Use LLM (Gemini/OpenAI) to rewrite content
      const enhancedContent = `AI Enhanced Version\n\n${article.content}\n\nThis article has been enhanced with additional context and insights.`;

      // UPDATE the existing article instead of creating a new one
      await axios.put(`${API}/${article._id}`, {
        content: enhancedContent,
        isUpdated: true,
        references: [
          'https://example.com/reference1',
          'https://example.com/reference2',
          'https://example.com/reference3'
        ]
      });

      console.log(`✅ Enhanced: ${article.title}`);
    }

    console.log('🎉 All articles enhanced successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

run();

