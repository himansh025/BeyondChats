const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const Article = require('../models/Article');
require('dotenv').config();

const BASE_URL = 'https://beyondchats.com/blogs/';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/beyondchats_blog';

async function connectDB() {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
}

async function scrape() {
    try {
        console.log('🔍 Fetching main page to find last pagination...');
        const { data: mainPageHtml } = await axios.get(BASE_URL);
        const $ = cheerio.load(mainPageHtml);

        let lastPage = 1;
        const pageLinks = $('a.page-numbers');

        if (pageLinks.length > 0) {
            const pageNumbers = [];
            pageLinks.each((i, el) => {
                const num = parseInt($(el).text());
                if (!isNaN(num)) pageNumbers.push(num);
            });
            if (pageNumbers.length > 0) {
                lastPage = Math.max(...pageNumbers);
            }
        }

        console.log(`📄 Last page found: ${lastPage}`);

        let currentArticles = [];
        let page = lastPage;

        // Loop backwards from last page
        while (currentArticles.length < 5 && page > 0) {
            console.log(`🚀 Scraping page: ${page} ...`);
            const targetUrl = `${BASE_URL}page/${page}/`;

            try {
                const { data: pageHtml } = await axios.get(targetUrl);
                const $page = cheerio.load(pageHtml);

                const pageArticles = [];

                let $container = $page('article');
                if (!$container.length) $container = $page('.post');

                $container.each((i, el) => {
                    const titleEl = $page(el).find('h2 a');
                    const title = titleEl.text().trim();
                    const originalUrl = titleEl.attr('href');

                    let content = $page(el).find('.entry-content').text().trim();
                    if (!content) content = $page(el).find('.post-excerpt').text().trim();
                    if (!content) content = $page(el).find('p').first().text().trim();

                    let dateStr = $page(el).find('.entry-date').text().trim() || $page(el).find('time').text().trim();
                    let date = dateStr ? new Date(dateStr) : new Date();
                    if (isNaN(date.getTime())) date = new Date();

                    if (title && originalUrl) {
                        pageArticles.push({
                            title,
                            content,
                            originalUrl,
                            createdAt: date
                        });
                    }
                });

                console.log(`   Found ${pageArticles.length} articles on page ${page}`);

                // Standard blog order: Top = Newest, Bottom = Oldest (on that page)
                // Global Oldest Page is Page 15.
                // On Page 15, Bottom is oldest of all.
                // We want [Oldest ... Newest] list.
                // So we reverse the page articles (Bottom->Top) and append.
                currentArticles = [...currentArticles, ...pageArticles.reverse()];

            } catch (err) {
                console.error(`   Error scraping page ${page}: ${err.message}`);
            }

            page--;
        }

        console.log(`✅ Total gathered: ${currentArticles.length}`);

        const oldestArticles = currentArticles.slice(0, 5);

        console.log('📋 Saving oldest 5 articles to DB...');
        await connectDB();

        for (const art of oldestArticles) {
            const existing = await Article.findOne({ originalUrl: art.originalUrl });
            if (!existing) {
                await Article.create(art);
                console.log(`   Saved: ${art.title}`);
            } else {
                console.log(`   Skipped (Exists): ${art.title}`);
            }
        }

        console.log('🏁 Done.');
        mongoose.disconnect();

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

scrape();
