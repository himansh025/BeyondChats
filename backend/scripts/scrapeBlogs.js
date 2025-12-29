const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const Article = require('../models/Article');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);

(async () => {
  const { data } = await axios.get('https://beyondchats.com/blogs/page/15/');
  const $ = cheerio.load(data);

  const articles = [];

  $('article').slice(-5).each((i, el) => {
    articles.push({
      title: $(el).find('h2').text(),
      content: $(el).find('p').first().text(),
      originalUrl: $(el).find('a').attr('href'),
      isUpdated: false
    });
  });

  await Article.insertMany(articles);
  console.log('✅ Original articles saved');
  process.exit();
})();
