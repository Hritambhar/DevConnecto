const express = require('express');
const axios = require('axios');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const checkObjectId = require('../../middleware/checkObjectId');

// @route    GET api/profile/me
// @desc     Get current user's profile
// @access   Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Custom function to ensure URLs start with 'https://'
const ensureHttps = (url) => {
  if (url && !/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
};

// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
router.post(
  '/',
  auth,
  check('status', 'Status is required').notEmpty(),
  check('skills', 'Skills is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // destructure the request
    const {
      status,
      company,
      website,
      bio,
      location,
      skills,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
      ...rest
    } = req.body;

    // build a profile
    const profileFields = {
      user: req.user.id,
      website: website && website !== '' ? ensureHttps(website) : '',
      skills: Array.isArray(skills)
        ? skills
        : skills.split(',').map((skill) => skill.trim()),
      ...rest,
    };

    // Build socialFields object
    const socialFields = { youtube, twitter, instagram, linkedin, facebook };

    // normalize social fields to ensure valid URL
    for (const [key, value] of Object.entries(socialFields)) {
      if (value && value.length > 0) {
        socialFields[key] = ensureHttps(value);
      }
    }

    // add to profileFields
    profileFields.social = socialFields;

    try {
      // Using upsert option (creates new doc if no match is found):
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get('/user/:user_id', checkObjectId('user_id'), async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) return res.status(400).json({ msg: 'Profile not found' });

    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete('/', auth, async (req, res) => {
  try {
    // Remove user posts (if you have a Post model, uncomment the next line)
    await Post.deleteMany({ user: req.user.id });

    // Remove profile
    await Profile.findOneAndDelete({ user: req.user.id });

    // Remove user
    await User.findOneAndDelete({ _id: req.user.id });

    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required').notEmpty(),
      check('company', 'Company is required').notEmpty(),
      check('from', 'From Date is required').notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, company, location, from, to, current, description } =
      req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      if (!profile) {
        return res.status(400).json({ msg: 'Profile not found' });
      }

      profile.experience.unshift(newExp);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required').notEmpty(),
      check('degree', 'Degree is required').notEmpty(),
      check('from', 'From Date is required').notEmpty(),
      check('fieldofstudy', 'Field Of Study is required').notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      if (!profile) {
        return res.status(400).json({ msg: 'Profile not found' });
      }

      profile.education.unshift(newEdu);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public
router.get('/github/:username', async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ msg: 'Username parameter is required' });
    }

    const uri = `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc`;
    const headers = {
      'user-agent': 'node.js',
      Authorization: `token ${config.get('githubToken')}`,
    };

    const gitHubResponse = await axios.get(uri, { headers });

    // Handle different response statuses
    if (gitHubResponse.status === 404) {
      return res
        .status(404)
        .json({ msg: 'No GitHub profile found for this user' });
    }

    return res.json(gitHubResponse.data);
  } catch (err) {
    console.error('GitHub API Error:', err.message);
    // Handle different types of errors
    if (err.response && err.response.status === 404) {
      return res
        .status(404)
        .json({ msg: 'No GitHub profile found for this user' });
    }
    return res.status(500).json({ msg: 'Server Error' });
  }
});
module.exports = router;
