const express = require('express');
const airQualityController = require('../controllers/airQuality.controller');
const airQualityValidator = require('../validators/airQuality.validator');

const router = express.Router();

// Basic data endpoints
router.get(
  '/',
  airQualityValidator.validateGetAll,
  airQualityController.getAllAirQualityData
);

// City-based endpoints
router.get(
  '/cities',
  airQualityController.getAllCities
);

router.get(
  '/city/:city',
  airQualityValidator.validateGetByCity,
  airQualityController.getAirQualityByCity
);

router.get(
  '/stats/city',
  airQualityController.getAirQualityStatsByCity
);

router.get(
  '/dates',
  airQualityController.getAllDates
);

router.get(
  '/date-range',
  airQualityController.getDateRange
);

router.get(
  '/date/:date',
  airQualityValidator.validateGetByDate,
  airQualityController.getAirQualityByDate
);

router.get(
  '/date-range-query',
  airQualityValidator.validateGetByDateRange,
  airQualityController.getAirQualityByDateRange
);

// PM2.5 and population density filtering
router.get(
  '/pm25-range',
  airQualityValidator.validateGetByPM25Range,
  airQualityController.getAirQualityByPM25Range
);

router.get(
  '/stats/pm25',
  airQualityController.getPM25Stats
);

router.get(
  '/population-density',
  airQualityValidator.validateGetByPopulationDensity,
  airQualityController.getAirQualityByPopulationDensity
);

router.get(
  '/stats/population-density',
  airQualityController.getPopulationDensityStats
);

// Spatial queries
router.get(
  '/nearby/:lat/:lng/:distance',
  airQualityValidator.validateGetNearby,
  airQualityController.getNearbyAirQuality
);

router.get(
  '/viewport',
  airQualityValidator.validateViewportParams,
  airQualityController.getByViewport
);

// Time series
router.get(
  '/time-series/:city',
  airQualityValidator.validateGetTimeSeries,
  airQualityController.getAirQualityTimeSeries
);

// Map optimization endpoints
router.get(
  '/clusters/:zoom',
  airQualityValidator.validateClusterParams,
  airQualityController.getAirQualityClusters
);

router.get(
  '/clusters/date/:date/:zoom',
  airQualityValidator.validateClustersByDate,
  airQualityController.getClustersByDate
);

router.get(
  '/simplified/:zoom',
  airQualityValidator.validateClusterParams,
  airQualityController.getSimplifiedByViewport
);

router.get(
  '/date-viewport/:date',
  airQualityValidator.validateDataByDateAndViewport,
  airQualityController.getDataByDateAndViewport
);

router.get(
  '/tiles/:z/:x/:y',
  airQualityValidator.validateTileParams,
  airQualityController.getVectorTile
);

module.exports = router;
