// const express = require("express");
// const axios = require("axios");
// const blogPost = require("../modules/blogPost"); // MongoDB model for blog posts
// const OpenAI = require("openai");
// require("dotenv").config();

// const router = express.Router();
// const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// // Initialize OpenAI SDK (Fixed)
// const openai = new OpenAI({
//   apiKey: OPENAI_API_KEY,
// });

// // Keywords for fetching YouTube videos
// const keywords = [
//   "inflation", "interest rate", "manufacturing PMI",
//   "services PMI", "GBP growth", "COT report"
// ];

// // Fetch YouTube Videos, Summarize, and Create Blog Posts
// router.get("/videos", async (req, res) => {
//   try {
//     let allVideos = [];

//     for (const keyword of keywords) {
//       const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(keyword)}&type=video&maxResults=5&key=${YOUTUBE_API_KEY}`;
//       const response = await axios.get(url);

//       const videos = response.data.items.map(video => ({
//         title: video.snippet.title,
//         videoId: video.id.videoId,
//         description: video.snippet.description,
//         publishedAt: video.snippet.publishedAt,
//         keyword
//       }));

//       allVideos = [...allVideos, ...videos];
//     }

//     // Summarize Descriptions
//     for (let video of allVideos) {
//       if (video.description) {
//         video.summary = await summarizeText(video.description);
//       }
//     }

//     // Save Videos to Database (Ensure `Video` is imported)
//     // Uncomment and use the correct model name
//     // await Video.insertMany(allVideos, { ordered: false });

//     // Generate Blog Posts
//     const blogPosts = await generateblogPosts(allVideos);

//     // Save Blog Posts to Database
//     await blogPost.insertMany(blogPosts, { ordered: false });

//     res.json({ videos: allVideos, blogPosts });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Error fetching and summarizing YouTube videos" });
//   }
// });

// // Summarize text using OpenAI (Fixed)
// async function summarizeText(text) {
//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "user", content: `Summarize this in 2 sentences: ${text}` }]
//     });
//     return response.choices[0].message.content;
//   } catch (err) {
//     console.error("Error summarizing:", err);
//     return "Summary not available.";
//   }
// }

// // Generate Blog Posts from Summarized Videos
// async function generateblogPosts(videos) {
//   let groupedVideos = {};

//   // Group videos by keyword
//   videos.forEach(video => {
//     if (!groupedVideos[video.keyword]) {
//       groupedVideos[video.keyword] = [];
//     }
//     groupedVideos[video.keyword].push(video);
//   });

//   let blogPosts = [];

//   for (let keyword in groupedVideos) {
//     const videoSummaries = groupedVideos[keyword].map(v => `- ${v.summary}`).join("\n");

//     // Generate blog post content using AI
//     const prompt = `Create a blog post about ${keyword} using the following insights:\n${videoSummaries}\nWrite a detailed post with an engaging introduction and a conclusion.`;
//     const blogContent = await generateTextWithAI(prompt);

//     const titlePrompt = `Generate a compelling blog title about ${keyword}.`;
//     const blogTitle = await generateTextWithAI(titlePrompt);

//     blogPosts.push({
//       title: blogTitle,
//       content: blogContent,
//       keyword,
//       createdAt: new Date()
//     });
//   }

//   return blogPosts;
// }

// // Generate Text Using OpenAI (Fixed)
// async function generateTextWithAI(prompt) {
//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "user", content: prompt }]
//     });
//     return response.choices[0].message.content;
//   } catch (err) {
//     console.error("Error generating text:", err);
//     return "Content not available.";
//   }
// }

// module.exports = router;
