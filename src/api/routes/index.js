const express = require('express');
const router = express.Router();

const airQualityRoutes = require('./airQuality.routes');

router.use('/air-quality', airQualityRoutes);

module.exports = router;