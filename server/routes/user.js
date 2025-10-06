const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/submissions', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if(!user){
        return res.status(404).json({ message: 'User not found' });
    }

    const apiUrl = `https://codeforces.com/api/user.status?handle=${user.handle}&from=1&count=20`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/update-last-checked', auth, async (req, res) => {
    try{
        const {lastCheckedSubmissionID} = req.body;
        if(!lastCheckedSubmissionID) {
            return res.status(400).json({ message: 'Last checked submission ID is required' });
        }

        const user = await User.findByIdAndUpdate(
            req.user,
            { lastCheckedSubmissionID },
            { new: true }
        );

        res.status(200).json({
            message: 'Last checked submission ID updated successfully',
            user: {
                lastCheckedSubmissionID: user.lastCheckedSubmissionID
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/new-failed-submissions', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const apiUrl = `https://codeforces.com/api/user.status?handle=${user.handle}&from=1&count=20`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.status !== 'OK') {
            return res.status(500).json({ message: 'Error fetching submissions from Codeforces' });
        }

        const newSubmissions = data.result.filter(sub => sub.id > user.lastCheckedSubmissionID);

        const failedSubmissions = newSubmissions.filter(sub => sub.verdict !== 'OK');
        res.json(failedSubmissions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/suggestions', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Fetch recent submissions (limit to 100 for faster load)
    const submissionsResponse = await fetch(`https://codeforces.com/api/user.status?handle=${user.handle}&from=1&count=100`);
    const submissionsData = await submissionsResponse.json();
    if (submissionsData.status !== 'OK') {
      return res.status(500).json({ message: 'Error fetching submissions from Codeforces' });
    }

    const solvedSet = new Set();
    const failedSubs = [];

    for (const sub of submissionsData.result) {
      const key = sub.problem.contestId + sub.problem.index;
      if (sub.verdict === 'OK') {
        solvedSet.add(key);
      } else {
        failedSubs.push(sub);
        if (failedSubs.length >= 5) break; // max 5 failed
      }
    }

    if (failedSubs.length === 0) {
      return res.json({ message: 'No failed submissions found to generate suggestions.' });
    }

    // Fetch all problems
    const problemsResponse = await fetch('https://codeforces.com/api/problemset.problems');
    const problemsData = await problemsResponse.json();
    if (problemsData.status !== 'OK') {
      return res.status(500).json({ message: 'Error fetching problemset from Codeforces' });
    }

    const allProblems = problemsData.result.problems;

    const candidateProblems = allProblems.filter(p => {
      const key = p.contestId + p.index;
      return !solvedSet.has(key) && p.rating;
    });

    const usedKeys = new Set();
    const allSuggestions = [];

    for (const failed of failedSubs) {
      const { tags = [], rating } = failed.problem;
      if (!rating) continue;

      const minRating = rating - 200;
      const maxRating = rating + 200;

      // Get matching problems
      const matching = candidateProblems.filter(p => {
        const key = p.contestId + p.index;
        const sharesTag = p.tags.some(tag => tags.includes(tag));
        return sharesTag && p.rating >= minRating && p.rating <= maxRating && !usedKeys.has(key);
      });

      // Shuffle and pick 7
      const top7 = matching.sort(() => Math.random() - 0.5).slice(0, 7);

      for (const prob of top7) {
        const key = prob.contestId + prob.index;
        usedKeys.add(key);
        allSuggestions.push(prob);
      }
    }

    const response = allSuggestions.map(p => ({
      contestId: p.contestId,
      index: p.index,
      name: p.name,
      rating: p.rating || 'Unrated',
      tags: p.tags,
      link: `https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`
    }));

    res.json(response);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});







module.exports = router;
