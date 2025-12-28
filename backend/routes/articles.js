const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

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
