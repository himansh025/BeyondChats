const axios = require('axios');
const puppeteer = require('puppeteer');
require('dotenv').config();

const API_URL = process.env.API_URL || 'http://localhost:5000/articles';
const SERP_API_KEY = process.env.SERP_API_KEY;
const LLM_API_KEY = process.env.LLM_API_KEY;

const MOCK_LLM = !LLM_API_KEY;

async function getArticlesToUpdate() {
    try {
        const { data } = await axios.get(`${API_URL}?type=original`);
        return data;
    } catch (error) {
        console.error('❌ Error fetching articles:', error.message);
        return [];
    }
}

async function searchGoogle(query) {
    console.log(`🔍 Searching Google for: ${query}`);

    if (SERP_API_KEY) {
        try {
            const { data } = await axios.get('https://serpapi.com/search', {
                params: { q: query, api_key: SERP_API_KEY, num: 3 }
            });
            if (data.organic_results) return data.organic_results.map(r => r.link);
        } catch (e) {
            console.error('⚠️ SerpAPI failed, trying Puppeteer fallback...');
        }
    }

    // Option 2: Puppeteer (Fallback)
    try {
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        // Use a user agent to avoid immediate blocking
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`, { waitUntil: 'domcontentloaded' });

        const links = await page.evaluate(() => {
            const anchors = Array.from(document.querySelectorAll('a'));
            return anchors
                .map(a => a.href)
                .filter(href => href && href.startsWith('http') && !href.includes('google.com') && !href.includes('youtube.com'))
                .slice(0, 3);
        });

        await browser.close();
        return links;
    } catch (err) {
        console.error(`⚠️ Puppeteer search failed: ${err.message}. Returning mock links.`);
        return ['https://example.com/related-1', 'https://example.com/related-2'];
    }
}

async function scrapeContent(url) {
    console.log(`📄 Scraping content from: ${url}`);
    if (url.includes('example.com')) return "Mock content: This is a placeholder for related article content.";

    try {
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (['image', 'stylesheet', 'font'].includes(req.resourceType())) req.abort();
            else req.continue();
        });

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });

        const content = await page.evaluate(() => {
            const nodes = document.querySelectorAll('h1, h2, h3, p');
            return Array.from(nodes).map(n => n.innerText).join('\n\n');
        });

        await browser.close();
        return content.slice(0, 5000);
    } catch (err) {
        console.error(`⚠️ Failed to scrape ${url}: ${err.message}`);
        return '';
    }
}

async function rewriteWithLLM(originalContent, refContents) {
    console.log('🤖 Rewriting with AI...');

    if (MOCK_LLM) {
        return `## [UPDATED With AI Insights]\n\n${originalContent.substring(0, 200)}...\n\n### Key Takeaways from Research\nThe original content has been enhanced with insights from related sources. (Note: This is a mock rewrite because no LLM Key was provided).\n\n${originalContent}`;
    }

    // Placeholder for real LLM call logic
    return `[AI Generated Content]\n\n${originalContent}`;
}

async function main() {
    const articles = await getArticlesToUpdate();
    console.log(`found ${articles.length} articles to update.`);

    for (const article of articles) {
        console.log(`\n==========================================`);
        console.log(`Processing: ${article.title}`);

        const searchLinks = await searchGoogle(article.title + " blog post");
        console.log('Found links:', searchLinks);

        const refContents = [];
        const validLinks = [];
        for (const link of searchLinks.slice(0, 2)) {
            const content = await scrapeContent(link);
            if (content && content.length > 100) {
                refContents.push(content);
                validLinks.push(link);
            }
        }

        const newContent = await rewriteWithLLM(article.content, refContents);

        try {
            await axios.put(`${API_URL}/${article._id}`, {
                content: newContent,
                isUpdated: true,
                references: validLinks.length > 0 ? validLinks : searchLinks,
            });
            console.log(`✅ Updated article ${article._id}`);
        } catch (err) {
            console.error('❌ API Update failed:', err.message);
        }
    }
}

main();
