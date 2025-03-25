const airQualityService = require('../../services/airQuality.service');
const logger = require('../../config/logger');

exports.getAllAirQualityData = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const data = await airQualityService.getAllAirQualityData(limit, offset);
    res.json({
      count: data.length,
      data
    });
  } catch (error) {
    logger.error('Error getting all air quality data:', error);
    next(error);
  }
};

exports.getAirQualityByCity = async (req, res, next) => {
  try {
    const { city } = req.params;
    const data = await airQualityService.getAirQualityByCity(city);

    if (data.length === 0) {
      return res.status(404).json({ message: `No air quality data found for city: ${city}` });
    }

    res.json({
      count: data.length,
      city,
      data
    });
  } catch (error) {
    logger.error(`Error getting air quality data for city ${req.params.city}:`, error);
    next(error);
  }
};

exports.getAirQualityByDate = async (req, res, next) => {
  try {
    const { date } = req.params;
    const data = await airQualityService.getAirQualityByDate(date);

    res.json({
      count: data.length,
      date,
      data
    });
  } catch (error) {
    logger.error(`Error getting air quality data for date ${req.params.date}:`, error);
    next(error);
  }
};

exports.getAirQualityByDateRange = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await airQualityService.getAirQualityByDateRange(startDate, endDate);

    res.json({
      count: data.length,
      startDate,
      endDate,
      data
    });
  } catch (error) {
    logger.error('Error getting air quality data by date range:', error);
    next(error);
  }
};

exports.getAirQualityByPM25Range = async (req, res, next) => {
  try {
    const { minPm25, maxPm25 } = req.query;
    const limit = parseInt(req.query.limit) || 1000;

    const data = await airQualityService.getAirQualityByPM25Range(
      parseFloat(minPm25),
      parseFloat(maxPm25),
      limit
    );

    res.json({
      count: data.length,
      minPm25: parseFloat(minPm25),
      maxPm25: parseFloat(maxPm25),
      data
    });
  } catch (error) {
    logger.error('Error getting air quality data by PM2.5 range:', error);
    next(error);
  }
};

exports.getAirQualityByPopulationDensity = async (req, res, next) => {
  try {
    const { minDensity, maxDensity } = req.query;
    const limit = parseInt(req.query.limit) || 1000;

    const data = await airQualityService.getAirQualityByPopulationDensity(
      parseFloat(minDensity),
      parseFloat(maxDensity),
      limit
    );

    res.json({
      count: data.length,
      minDensity: parseFloat(minDensity),
      maxDensity: parseFloat(maxDensity),
      data
    });
  } catch (error) {
    logger.error('Error getting air quality data by population density:', error);
    next(error);
  }
};

exports.getNearbyAirQuality = async (req, res, next) => {
  try {
    const { lat, lng, distance } = req.params;
    const date = req.query.date || null;

    const data = await airQualityService.getNearbyAirQuality(
      parseFloat(lat),
      parseFloat(lng),
      parseFloat(distance),
      date
    );

    res.json({
      count: data.length,
      location: { lat: parseFloat(lat), lng: parseFloat(lng) },
      distance: parseFloat(distance),
      date,
      data
    });
  } catch (error) {
    logger.error('Error getting nearby air quality data:', error);
    next(error);
  }
};

exports.getAirQualityStatsByCity = async (req, res, next) => {
  try {
    const stats = await airQualityService.getAirQualityStatsByCity();

    res.json({
      count: stats.length,
      data: stats
    });
  } catch (error) {
    logger.error('Error getting air quality stats by city:', error);
    next(error);
  }
};

exports.getAirQualityTimeSeries = async (req, res, next) => {
  try {
    const { city } = req.params;
    const { startDate, endDate } = req.query;

    const data = await airQualityService.getAirQualityTimeSeries(city, startDate, endDate);

    if (data.length === 0) {
      return res.status(404).json({
        message: `No air quality time series data found for city: ${city} between ${startDate} and ${endDate}`
      });
    }

    res.json({
      count: data.length,
      city,
      startDate,
      endDate,
      data
    });
  } catch (error) {
    logger.error(`Error getting air quality time series for city ${req.params.city}:`, error);
    next(error);
  }
};

exports.getAirQualityClusters = async (req, res, next) => {
  try {
    const { zoom } = req.params;
    const { north, south, east, west, date } = req.query;

    const bounds = { north, south, east, west };
    const data = await airQualityService.getAirQualityClusters(zoom, bounds, date);

    res.json({
      count: data.length,
      zoom,
      bounds,
      date,
      data
    });
  } catch (error) {
    logger.error('Error getting air quality clusters:', error);
    next(error);
  }
};

exports.getClustersByDate = async (req, res, next) => {
  try {
    const { date, zoom } = req.params;
    const { north, south, east, west } = req.query;

    const bounds = { north, south, east, west };
    const data = await airQualityService.getClustersByDate(date, zoom, bounds);

    res.json({
      count: data.length,
      date,
      zoom,
      bounds,
      data
    });
  } catch (error) {
    logger.error(`Error getting clusters for date ${req.params.date}:`, error);
    next(error);
  }
};

exports.getSimplifiedByViewport = async (req, res, next) => {
  try {
    const { zoom } = req.params;
    const { north, south, east, west, date } = req.query;

    const bounds = { north, south, east, west };
    const data = await airQualityService.getSimplifiedByViewport(zoom, bounds, date);

    res.json({
      count: data.length,
      zoom,
      bounds,
      date,
      data
    });
  } catch (error) {
    logger.error('Error getting simplified data by viewport:', error);
    next(error);
  }
};

exports.getByViewport = async (req, res, next) => {
  try {
    const { north, south, east, west, date } = req.query;
    const limit = parseInt(req.query.limit) || 500;

    const bounds = { north, south, east, west };
    const data = await airQualityService.getByViewport(bounds, date, limit);

    res.json({
      count: data.length,
      bounds,
      date,
      data
    });
  } catch (error) {
    logger.error('Error getting data by viewport:', error);
    next(error);
  }
};

exports.getDataByDateAndViewport = async (req, res, next) => {
  try {
    const { date } = req.params;
    const { north, south, east, west } = req.query;
    const limit = parseInt(req.query.limit) || 1000;

    const bounds = { north, south, east, west };
    const data = await airQualityService.getDataByDateAndViewport(date, bounds, limit);

    res.json({
      count: data.length,
      date,
      bounds,
      data
    });
  } catch (error) {
    logger.error(`Error getting data for date ${req.params.date} by viewport:`, error);
    next(error);
  }
};

exports.getVectorTile = async (req, res, next) => {
  try {
    const { z, x, y } = req.params;
    const { date } = req.query;

    const tile = await airQualityService.getVectorTile(
      parseInt(z),
      parseInt(x),
      parseInt(y),
      date
    );

    if (tile) {
      res.setHeader('Content-Type', 'application/x-protobuf');
      res.send(tile);
    } else {
      res.status(204).end();
    }
  } catch (error) {
    logger.error(`Error getting vector tile z:${req.params.z}, x:${req.params.x}, y:${req.params.y}:`, error);
    next(error);
  }
};

exports.getAllCities = async (req, res, next) => {
  try {
    const cities = await airQualityService.getAllCities();

    res.json({
      count: cities.length,
      cities
    });
  } catch (error) {
    logger.error('Error getting all cities:', error);
    next(error);
  }
};

exports.getAllDates = async (req, res, next) => {
  try {
    const dates = await airQualityService.getAllDates();

    res.json({
      count: dates.length,
      dates
    });
  } catch (error) {
    logger.error('Error getting all dates:', error);
    next(error);
  }
};

exports.getDateRange = async (req, res, next) => {
  try {
    const dateRange = await airQualityService.getDateRange();

    res.json(dateRange);
  } catch (error) {
    logger.error('Error getting date range:', error);
    next(error);
  }
};

exports.getPM25Stats = async (req, res, next) => {
  try {
    const stats = await airQualityService.getPM25Stats();

    res.json(stats);
  } catch (error) {
    logger.error('Error getting PM2.5 statistics:', error);
    next(error);
  }
};

exports.getPopulationDensityStats = async (req, res, next) => {
  try {
    const stats = await airQualityService.getPopulationDensityStats();

    res.json(stats);
  } catch (error) {
    logger.error('Error getting population density statistics:', error);
    next(error);
  }
};
