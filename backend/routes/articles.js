const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const axios = require('axios');
const cheerio = require('cheerio');

// GET all articles with filtering
router.get('/', async (req, res) => {
    try {
        const { type } = req.query;
        let query = {};
        if (type === 'original') {
            query = { isUpdated: false };
        } else if (type === 'updated') {
            query = { isUpdated: true };
        }

        const articles = await Article.find(query).sort({ createdAt: -1 });
        res.json(articles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// NEW: GET live original articles from BeyondChats (without saving to DB)
router.get('/live-originals', async (req, res) => {
    try {
        console.log('🔍 Fetching live articles from BeyondChats...');

        // Fetch the last page (oldest articles)
        const { data: mainPageHtml } = await axios.get('https://beyondchats.com/blogs/');
        const $ = cheerio.load(mainPageHtml);

        // Find last page number
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

        console.log(`📄 Last page: ${lastPage}`);

        // Scrape from last page
        const articles = [];
        let page = lastPage;

        while (articles.length < 5 && page > 0) {
            const targetUrl = `https://beyondchats.com/blogs/page/${page}/`;
            const { data: pageHtml } = await axios.get(targetUrl);
            const $page = cheerio.load(pageHtml);

            let $container = $page('article');
            if (!$container.length) $container = $page('.post');

            $container.each((i, el) => {
                if (articles.length >= 5) return;

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
                    articles.push({
                        _id: `live-${articles.length}`, // Temporary ID for frontend
                        title,
                        content,
                        originalUrl,
                        isUpdated: false,
                        references: [],
                        createdAt: date
                    });
                }
            });

            page--;
        }

        // Reverse to get oldest first
        articles.reverse();

        console.log(`✅ Fetched ${articles.length} live articles`);
        res.json(articles.slice(0, 5));

    } catch (err) {
        console.error('❌ Error fetching live articles:', err.message);
        res.status(500).json({ message: 'Failed to fetch live articles', error: err.message });
    }
});

// GET one article
router.get('/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ message: 'Article not found' });
        res.json(article);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create article
router.post('/', async (req, res) => {
    const article = new Article({
        title: req.body.title,
        content: req.body.content,
        originalUrl: req.body.originalUrl,
        isUpdated: req.body.isUpdated || false,
        references: req.body.references || []
    });

    try {
        const newArticle = await article.save();
        res.status(201).json(newArticle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update article
router.put('/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ message: 'Article not found' });

        if (req.body.title != null) article.title = req.body.title;
        if (req.body.content != null) article.content = req.body.content;
        if (req.body.originalUrl != null) article.originalUrl = req.body.originalUrl;
        if (req.body.isUpdated != null) article.isUpdated = req.body.isUpdated;
        if (req.body.references != null) article.references = req.body.references;

        const updatedArticle = await article.save();
        res.json(updatedArticle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE article
router.delete('/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ message: 'Article not found' });

        await article.deleteOne();
        res.json({ message: 'Article deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
