const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

router.post('/', async (req, res) => {
  const c = await Contact.create(req.body);
  res.status(201).json({ success: true, c });
});

router.get('/', async (req, res) => {
  const list = await Contact.find().sort('-createdAt');
  res.json(list);
});

module.exports = router;