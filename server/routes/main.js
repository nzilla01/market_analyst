const express = require('express');
const router = express.Router();
const articles = require('../modules/articles');

// Simulated pre-fetched videos (this prevents extra fetch requests)
const videos = [
    { title: "Forex Trading Basics", summary: "Learn the fundamentals of forex trading." },
    { title: "Technical Analysis", summary: "How to use indicators to predict market movements." },
    { title: "Market Psychology", summary: "Understanding trader psychology in forex." }
];

// ✅ Home route (fetches latest articles and displays pre-fetched videos)
router.get('', async (req, res) => {
    const local = {
        title: 'The Market Analyst',
        description: 'Stay updated with the latest market analysis',
        keywords: 'market, analysis, stock, forex, crypto'
    };

    try {
        const trendingArticles = await articles.find({ trending: true }).sort({ date: 'desc' }).limit(3).exec();
        const latestArticles = await articles.find({ category:  { $in: ['articles', 'news'] }}).sort({ date: 'desc' }).limit(9).exec();
        const suggestedArticles = await articles.find({ category: 'education' }).sort({ date: 'desc' }).limit(20).exec(); // Fetch education articles

        res.render('index', { local, trendingArticles, latestArticles, suggestedArticles, videos });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});


// ✅ Single article page (displays full article and pre-fetched videos)
router.get('/article/:id', async (req, res) => {
    try {

        let slug = req.params.id;
        const data = await articles.findOne({ _id: slug }).exec();

        if (!data) {
            return res.status(404).send("Article not found");
        }

        const local = {
            title: 'data.title ',
            description: 'data.body?.silce(0, 150)',
            keywords: 'market, analysis, stock, forex, crypto'
        };

        // Fetch related articles (same category, excluding the current one)
        const relatedArticles = await articles.find({ 
            category: data.category, 
            _id: { $ne: data._id }  // Use `data._id` instead of `slug`
        }).sort({ date: 'desc' }).limit(20).exec();

        res.render('article', { 
            local, 
            data, 
            relatedArticles, 
            isSingleArticlePage: true // Ensure this flag is included
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});



// ✅ Paginated articles list page
router.get('/articles', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 30;
        const skip = (page - 1) * limit;

        const data = await articles.find({category: "articles"}).sort({ date: 'desc' }).skip(skip).limit(limit).exec();

        if (req.xhr) {
            return res.json(data);
        }

        const local = {
            title: 'All Articles - The Market Analyst',
            description: 'Browse through all market analysis articles',
            keywords: 'market, analysis, stock, forex, crypto'
        };

        res.render('articles', { local, data, videos });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Search route (allows users to search articles)
router.post("/search", async (req, res) => {
    try {
        const local = {
            title: 'Search Results - The Market Analyst',
            description: 'Find market insights that matter to you',
            keywords: 'market, analysis, stock, forex, crypto'
        };

        let searchTerm = req.body.searchTerm;
        
        // If no search term is provided, return a message
        if (!searchTerm || searchTerm.trim() === "") {
            return res.render('search', { data: [], local, message: 'Please enter a search term.' });
        }

        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

        // Search for articles matching title or body
        const data = await articles.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
            ]
        });

        res.render('search', { data, local, message: data.length ? null : 'No articles found for your search.' });
    } catch (err) {
        console.error("Search error:", err);
        res.status(500).send("Search failed");
    }
});

router.get('/about', (req, res) => {
    const local = {
        title: 'Market Signals - The Market Analyst',
        description: 'Get expert trading signals',
        keywords: 'market, analysis, stock, forex, crypto, trading signals'
    };

    res.render('about', { local });
});





// ✅ Signal Page
router.get('/signal', (req, res) => {
    const local = {
        title: 'Market Signals - The Market Analyst',
        description: 'Get expert trading signals',
        keywords: 'market, analysis, stock, forex, crypto, trading signals'
    };

    res.render('signal', { local });
});

// ✅ Sign-In Page
router.get('/signIn', (req, res) => {
    const local = {
        title: 'Sign In - The Market Analyst',
        description: 'Access your account and exclusive content',
        keywords: 'market, analysis, stock, forex, crypto, sign in'
    };

    res.render('signIn', { local });
});

// News Page
router.get('/news', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 30;
        const skip = (page - 1) * limit;

        const data = await articles.find({category: "news"}).sort({ date: 'desc' }).skip(skip).limit(limit).exec();

        // Fetch related news articles (same category, excluding current article)
        const relatedArticles = await articles.find({ category: 'news' }).sort({ date: 'desc' }).limit(5).exec();

        // Suggested articles from education
        const suggestedArticles = await articles.find({ category: 'education' }).sort({ date: 'desc' }).limit(5).exec();

        if (req.xhr) {
            return res.json(data);
        }

        const local = {
            title: 'All News - The Market Analyst',
            description: 'Browse through all market news articles',
            keywords: 'market, news, stock, forex, crypto'
        };

        res.render('news', { local, data, relatedArticles, suggestedArticles, videos });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

router.get('/education', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 30;
        const skip = (page - 1) * limit;

        const data = await articles.find({category: "education"}).sort({ date: 'desc' }).skip(skip).limit(limit).exec();

        // Fetch related education articles
        const relatedArticles = await articles.find({ category: 'education' }).sort({ date: 'desc' }).limit(5).exec();

        // Suggested articles from education
        const suggestedArticles = await articles.find({ category: 'education' }).sort({ date: 'desc' }).limit(5).exec();

        if (req.xhr) {
            return res.json(data);
        }

        const local = {
            title: 'All Education Articles - The Market Analyst',
            description: 'Browse through all market education articles',
            keywords: 'education, trading, forex, crypto'
        };

        res.render('education', { local, data, relatedArticles, suggestedArticles, videos });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
