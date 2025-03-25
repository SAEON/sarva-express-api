const airQualityRepository = require('../db/repositories/airQuality.repository');

exports.getAllAirQualityData = async (limit, offset) => {
  return airQualityRepository.findAll(limit, offset);
};

exports.getAirQualityByCity = async (city) => {
  return airQualityRepository.findByCity(city);
};

exports.getAirQualityByDate = async (date) => {
  return airQualityRepository.findByDate(date);
};

exports.getAirQualityByDateRange = async (startDate, endDate) => {
  return airQualityRepository.findByDateRange(startDate, endDate);
};

exports.getAirQualityByPM25Range = async (minPm25, maxPm25, limit) => {
  return airQualityRepository.findByPM25Range(minPm25, maxPm25, limit);
};

exports.getAirQualityByPopulationDensity = async (minDensity, maxDensity, limit) => {
  return airQualityRepository.findByPopulationDensity(minDensity, maxDensity, limit);
};

exports.getNearbyAirQuality = async (lat, lng, distance, date) => {
  return airQualityRepository.findNearby(lat, lng, distance, date);
};

exports.getAirQualityStatsByCity = async () => {
  return airQualityRepository.getAvgPM25ByCity();
};

exports.getAirQualityTimeSeries = async (city, startDate, endDate) => {
  return airQualityRepository.getTimeSeries(city, startDate, endDate);
};

exports.getAirQualityClusters = async (zoom, bounds, date) => {
  return airQualityRepository.getClusters(zoom, bounds, date);
};

exports.getClustersByDate = async (date, zoom, bounds) => {
  return airQualityRepository.getClustersByDate(date, zoom, bounds);
};

exports.getSimplifiedByViewport = async (zoom, bounds, date) => {
  return airQualityRepository.getSimplifiedByViewport(zoom, bounds, date);
};

exports.getByViewport = async (bounds, date, limit) => {
  return airQualityRepository.getByViewport(bounds, date, limit);
};

exports.getDataByDateAndViewport = async (date, bounds, limit) => {
  return airQualityRepository.getDataByDateAndViewport(date, bounds, limit);
};

exports.getVectorTile = async (z, x, y, date) => {
  return airQualityRepository.getVectorTile(z, x, y, date);
};

exports.getAllCities = async () => {
  return airQualityRepository.getCities();
};

exports.getAllDates = async () => {
  return airQualityRepository.getDates();
};

exports.getDateRange = async () => {
  return airQualityRepository.getDateRange();
};

exports.getPM25Stats = async () => {
  return airQualityRepository.getPM25Stats();
};

exports.getPopulationDensityStats = async () => {
  return airQualityRepository.getPopulationDensityStats();
};
