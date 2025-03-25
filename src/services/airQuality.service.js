const airQualityRepository = require('../db/repositories/airQuality.repository');

exports.getAllAirQualityData = async (limit, offset) => airQualityRepository.findAll(limit, offset);

exports.getAirQualityByCity = async (city) => airQualityRepository.findByCity(city);

exports.getAirQualityByDate = async (date) => airQualityRepository.findByDate(date);

exports.getAirQualityByDateRange = async (startDate, endDate) => airQualityRepository.findByDateRange(startDate, endDate);

exports.getAirQualityByPM25Range = async (minPm25, maxPm25, limit) => airQualityRepository.findByPM25Range(minPm25, maxPm25, limit);

exports.getAirQualityByPopulationDensity = async (minDensity, maxDensity, limit) => airQualityRepository.findByPopulationDensity(minDensity, maxDensity, limit);

exports.getNearbyAirQuality = async (lat, lng, distance, date) => airQualityRepository.findNearby(lat, lng, distance, date);

exports.getAirQualityStatsByCity = async () => airQualityRepository.getAvgPM25ByCity();

exports.getAirQualityTimeSeries = async (city, startDate, endDate) => airQualityRepository.getTimeSeries(city, startDate, endDate);

exports.getAirQualityClusters = async (zoom, bounds, date) => airQualityRepository.getClusters(zoom, bounds, date);

exports.getClustersByDate = async (date, zoom, bounds) => airQualityRepository.getClustersByDate(date, zoom, bounds);

exports.getSimplifiedByViewport = async (zoom, bounds, date) => airQualityRepository.getSimplifiedByViewport(zoom, bounds, date);

exports.getByViewport = async (bounds, date, limit) => airQualityRepository.getByViewport(bounds, date, limit);

exports.getDataByDateAndViewport = async (date, bounds, limit) => airQualityRepository.getDataByDateAndViewport(date, bounds, limit);

exports.getVectorTile = async (z, x, y, date) => airQualityRepository.getVectorTile(z, x, y, date);

exports.getAllCities = async () => airQualityRepository.getCities();

exports.getAllDates = async () => airQualityRepository.getDates();

exports.getDateRange = async () => airQualityRepository.getDateRange();

exports.getPM25Stats = async () => airQualityRepository.getPM25Stats();

exports.getPopulationDensityStats = async () => airQualityRepository.getPopulationDensityStats();
