const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const { uploadCV } = require('../controllers/cv.controller');

router.post('/upload', upload.single('cv'), uploadCV);

module.exports = router;
