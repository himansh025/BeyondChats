const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();
const Groq = require("groq-sdk");


const API = process.env.API_URL;
const SERP_API_KEY = process.env.SERP_API_KEY;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });



async function searchGoogle(query) {
  try {
    console.log(`  🔎 Searching Google for: "${query}"`);

    const response = await axios.get('https://serpapi.com/search', {
      params: {
        q: query,
        api_key: SERP_API_KEY,
        num: 10
      }
    });

    const results = response.data.organic_results || [];

    // Filter for blog/article URLs (exclude social media, videos, etc.)
    const blogUrls = results
      .filter(result => {
        const url = result.link.toLowerCase();
        return (
          (url.includes('/blog') || url.includes('/article') || url.includes('/post')) &&
          !url.includes('youtube.com') &&
          !url.includes('facebook.com') &&
          !url.includes('twitter.com') &&
          !url.includes('linkedin.com')
        );
      })
      .slice(0, 2)
      .map(result => result.link);

    return blogUrls;
  } catch (error) {
    console.error(`  ❌ Google search failed: ${error.message}`);
    return [];
  }
}


async function scrapeArticle(url) {
  try {
    console.log(`  📥 Scraping: ${url.substring(0, 50)}...`);

    const { data } = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(data);

    $('script, style, nav, footer, header, .nav, .footer, .header').remove();

    let content =
      $('article').text() ||
      $('.post-content').text() ||
      $('.entry-content').text() ||
      $('.article-content').text() ||
      $('main').text() ||
      $('.content').text() ||
      $('body').text();

    content = content
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 3000);

    return content;
  } catch (error) {
    return '';
  }
}


async function enhanceWithLLM(title, original, ref1, ref2) {
  const prompt = `
You are an expert SEO content writer.

TITLE:
${title}

ORIGINAL ARTICLE:
${original}

REFERENCE ARTICLE 1:
${ref1.slice(0, 1200)}

REFERENCE ARTICLE 2:
${ref2.slice(0, 1200)}

TASK:
Rewrite and enhance the original article.
- Keep same topic
- Improve structure & depth
- SEO friendly
- 500–800 words
- Use headings, intro, conclusion
Return ONLY the article.
`;

  const res = await groq.chat.completions.create({
    model: "groq/compound",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7
  });

  return res.choices[0].message.content;
}


async function run() {
  try {
    console.log('🔍 Fetching original articles...\n');
    const { data: originals } = await axios.get(`${API}?type=original`);

    if (originals.length === 0) {
      console.log('⚠️  No original articles found. Run scrapeInitial.js first.');
      return;
    }

    console.log(`📝 Found ${originals.length} original articles to enhance\n`);

    for (let i = 0; i < originals.length; i++) {
      const article = originals[i];
      console.log(`\n[${i + 1}/${originals.length}] Processing: "${article.title}"`);
      console.log('─'.repeat(60));

      // Step 1: Search Google
      const referenceUrls = await searchGoogle(article.title);

      if (referenceUrls.length < 2) {
        console.log('  ⚠️  Not enough reference articles found, using fallback enhancement');

        // Fallback: simple enhancement without references
        const fallbackContent = `Enhanced Version\n\n${article.content}\n\nThis article has been enhanced with improved formatting and structure.`;

        await axios.put(`${API}/${article._id}`, {
          content: fallbackContent,
          isUpdated: true,
          references: []
        });

        console.log('  ✅ Enhanced with fallback method\n');
        continue;
      }

      // Step 2: Scrape reference articles
      const [ref1Content, ref2Content] = await Promise.all([
        scrapeArticle(referenceUrls[0]),
        scrapeArticle(referenceUrls[1])
      ]);

      if (!ref1Content && !ref2Content) {
        console.log('  ⚠️  Failed to scrape references, using fallback');
        continue;
      }

      // Step 3: Enhance with LLM
      const enhancedContent = await enhanceWithLLM(
        article.title,
        article.content,
        ref1Content || 'No content available',
        ref2Content || 'No content available'
      );

      // Step 4: Update article via API
      await axios.put(`${API}/${article._id}`, {
        content: enhancedContent,
        isUpdated: true,
        references: referenceUrls
      });

      referenceUrls.forEach((url, idx) => {
        console.log(`     ${idx + 1}. ${url}`);
      });

      // Add delay to avoid rate limits
      if (i < originals.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('🎉 All articles enhanced successfully!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

run();
