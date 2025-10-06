const express = require("express");
const axios = require("axios");
const authMiddleware = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(400).json({ message: "User not found" });

    const handle = user.handle;
    if (!handle) return res.status(400).json({ message: "Codeforces handle not set" });

    // --- Fetch submissions ---
    const submissionsRes = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}`);
    const submissions = submissionsRes.data.result || [];

    // --- Fetch rating changes ---
    const ratingRes = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`);
    const ratingChanges = ratingRes.data.result || [];

    // --- Total solved problems ---
    const totalSolved = new Set(submissions.filter(s => s.verdict === "OK").map(s => s.problem.name)).size;

    // --- Verdict distribution ---
    const verdicts = submissions.reduce((acc, cur) => {
      acc[cur.verdict] = (acc[cur.verdict] || 0) + 1;
      return acc;
    }, {});

    // --- Solved by rating ---
    const ratingSolved = submissions.reduce((acc, cur) => {
      if (cur.verdict === "OK" && cur.problem.rating) {
        acc[cur.problem.rating] = (acc[cur.problem.rating] || 0) + 1;
      }
      return acc;
    }, {});

    // --- Overall accuracy ---
    const accuracy = submissions.length
      ? (submissions.filter(s => s.verdict === "OK").length / submissions.length) * 100
      : 0;

    // --- Best rating ---
    const bestRating = ratingChanges.length ? Math.max(...ratingChanges.map(r => r.newRating)) : 0;

    // --- Current streak ---
    let streak = 0;
    const solvedDates = submissions.filter(s => s.verdict === "OK")
      .map(s => new Date(s.creationTimeSeconds * 1000).toDateString());

    const today = new Date().toDateString();
    let streakDate = today;
    while (solvedDates.includes(streakDate)) {
      streak += 1;
      const prevDate = new Date(streakDate);
      prevDate.setDate(prevDate.getDate() - 1);
      streakDate = prevDate.toDateString();
    }

    // --- Weak and strong topics ---
    const tagStats = {};
    submissions.forEach(sub => {
      if (sub.verdict === "OK" && sub.problem.tags) {
        sub.problem.tags.forEach(tag => {
          if (!tagStats[tag]) tagStats[tag] = { solved: 0, total: 0 };
          tagStats[tag].solved += 1;
          tagStats[tag].total += 1;
        });
      } else if (sub.problem.tags) {
        sub.problem.tags.forEach(tag => {
          if (!tagStats[tag]) tagStats[tag] = { solved: 0, total: 0 };
          tagStats[tag].total += 1;
        });
      }
    });

    const weakTopics = [];
    const strongTopics = [];
    for (let tag in tagStats) {
      const acc = tagStats[tag].total ? (tagStats[tag].solved / tagStats[tag].total) * 100 : 0;
      if (acc < 60) weakTopics.push({ topic: tag, accuracy: Math.round(acc) });
      else strongTopics.push({ topic: tag, accuracy: Math.round(acc) });
    }

    // --- Daily progress for chart ---
    const progress = submissions
      .filter(s => s.verdict === "OK")
      .map(s => new Date(s.creationTimeSeconds * 1000).toDateString())
      .reduce((acc, date) => {
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

    const progressArray = Object.entries(progress)
      .map(([date, solved]) => ({ date, solved }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // --- Rating graph for chart ---
    const ratingGraph = ratingChanges
      .map(r => ({
        contestName: r.contestName,
        rating: r.newRating,
        date: new Date(r.ratingUpdateTimeSeconds * 1000).toDateString()
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({
      handle,
      totalSolved,
      bestRating,
      accuracy: Math.round(accuracy),
      streak,
      verdicts,
      ratingSolved,
      progress: progressArray,
      weakTopics,
      strongTopics,
      ratingGraph
    });
  } catch (err) {
    console.error("Stats API error:", err.message);
    res.status(500).json({ message: "Failed to fetch Codeforces stats" });
  }
});

module.exports = router;
