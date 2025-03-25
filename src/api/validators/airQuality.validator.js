const { query, param } = require('express-validator');
const { validationMiddleware } = require('../middlewares/validation');

exports.validateGetAll = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Limit must be a number between 1 and 1000'),

  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative number'),

  validationMiddleware
];

exports.validateGetByCity = [
  param('city')
    .notEmpty()
    .withMessage('City name is required')
    .isString()
    .withMessage('City must be a string'),

  validationMiddleware
];

exports.validateGetByDate = [
  param('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be a valid date in ISO 8601 format (YYYY-MM-DD)'),

  validationMiddleware
];

exports.validateGetByDateRange = [
  query('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid date in ISO 8601 format (YYYY-MM-DD)'),

  query('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('End date must be a valid date in ISO 8601 format (YYYY-MM-DD)')
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.query.startDate)) {
        throw new Error('End date must be greater than or equal to start date');
      }
      return true;
    }),

  validationMiddleware
];

exports.validateGetByPM25Range = [
  query('minPm25')
    .notEmpty()
    .withMessage('Minimum PM2.5 value is required')
    .isFloat({ min: 0 })
    .withMessage('Minimum PM2.5 value must be a positive number'),

  query('maxPm25')
    .notEmpty()
    .withMessage('Maximum PM2.5 value is required')
    .isFloat({ min: 0 })
    .withMessage('Maximum PM2.5 value must be a positive number')
    .custom((value, { req }) => {
      if (parseFloat(value) < parseFloat(req.query.minPm25)) {
        throw new Error('Maximum PM2.5 value must be greater than or equal to minimum value');
      }
      return true;
    }),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 5000 })
    .withMessage('Limit must be a number between 1 and 5000'),

  validationMiddleware
];

exports.validateGetByPopulationDensity = [
  query('minDensity')
    .notEmpty()
    .withMessage('Minimum density value is required')
    .isFloat({ min: 0 })
    .withMessage('Minimum density value must be a positive number'),

  query('maxDensity')
    .notEmpty()
    .withMessage('Maximum density value is required')
    .isFloat({ min: 0 })
    .withMessage('Maximum density value must be a positive number')
    .custom((value, { req }) => {
      if (parseFloat(value) < parseFloat(req.query.minDensity)) {
        throw new Error('Maximum density value must be greater than or equal to minimum value');
      }
      return true;
    }),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 5000 })
    .withMessage('Limit must be a number between 1 and 5000'),

  validationMiddleware
];

exports.validateGetNearby = [
  param('lat')
    .notEmpty()
    .withMessage('Latitude is required')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be a number between -90 and 90'),

  param('lng')
    .notEmpty()
    .withMessage('Longitude is required')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be a number between -180 and 180'),

  param('distance')
    .notEmpty()
    .withMessage('Distance is required')
    .isFloat({ min: 0, max: 100000 })
    .withMessage('Distance must be a number between 0 and 100000 meters'),

  query('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid date in ISO 8601 format (YYYY-MM-DD)'),

  validationMiddleware
];

exports.validateGetTimeSeries = [
  param('city')
    .notEmpty()
    .withMessage('City name is required')
    .isString()
    .withMessage('City must be a string'),

  query('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid date in ISO 8601 format (YYYY-MM-DD)'),

  query('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('End date must be a valid date in ISO 8601 format (YYYY-MM-DD)')
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.query.startDate)) {
        throw new Error('End date must be greater than or equal to start date');
      }
      return true;
    }),

  validationMiddleware
];

exports.validateViewportParams = [
  query('north')
    .notEmpty()
    .withMessage('North boundary is required')
    .isFloat({ min: -90, max: 90 })
    .withMessage('North boundary must be a latitude between -90 and 90'),

  query('south')
    .notEmpty()
    .withMessage('South boundary is required')
    .isFloat({ min: -90, max: 90 })
    .withMessage('South boundary must be a latitude between -90 and 90')
    .custom((value, { req }) => {
      if (parseFloat(value) > parseFloat(req.query.north)) {
        throw new Error('South boundary must be less than north boundary');
      }
      return true;
    }),

  query('east')
    .notEmpty()
    .withMessage('East boundary is required')
    .isFloat({ min: -180, max: 180 })
    .withMessage('East boundary must be a longitude between -180 and 180'),

  query('west')
    .notEmpty()
    .withMessage('West boundary is required')
    .isFloat({ min: -180, max: 180 })
    .withMessage('West boundary must be a longitude between -180 and 180'),

  query('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid date in ISO 8601 format (YYYY-MM-DD)'),

  validationMiddleware
];

exports.validateClusterParams = [
  param('zoom')
    .notEmpty()
    .withMessage('Zoom level is required')
    .isInt({ min: 0, max: 22 })
    .withMessage('Zoom level must be between 0 and 22'),

  ...this.validateViewportParams,
];

exports.validateClustersByDate = [
  param('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be a valid date in ISO 8601 format (YYYY-MM-DD)'),

  param('zoom')
    .notEmpty()
    .withMessage('Zoom level is required')
    .isInt({ min: 0, max: 22 })
    .withMessage('Zoom level must be between 0 and 22'),

  query('north')
    .notEmpty()
    .withMessage('North boundary is required')
    .isFloat({ min: -90, max: 90 })
    .withMessage('North boundary must be a latitude between -90 and 90'),

  query('south')
    .notEmpty()
    .withMessage('South boundary is required')
    .isFloat({ min: -90, max: 90 })
    .withMessage('South boundary must be a latitude between -90 and 90'),

  query('east')
    .notEmpty()
    .withMessage('East boundary is required')
    .isFloat({ min: -180, max: 180 })
    .withMessage('East boundary must be a longitude between -180 and 180'),

  query('west')
    .notEmpty()
    .withMessage('West boundary is required')
    .isFloat({ min: -180, max: 180 })
    .withMessage('West boundary must be a longitude between -180 and 180'),

  validationMiddleware
];

exports.validateTileParams = [
  param('z')
    .notEmpty()
    .withMessage('Z (zoom) value is required')
    .isInt({ min: 0, max: 22 })
    .withMessage('Z (zoom) value must be between 0 and 22'),

  param('x')
    .notEmpty()
    .withMessage('X tile coordinate is required')
    .isInt({ min: 0 })
    .withMessage('X tile coordinate must be a non-negative integer'),

  param('y')
    .notEmpty()
    .withMessage('Y tile coordinate is required')
    .isInt({ min: 0 })
    .withMessage('Y tile coordinate must be a non-negative integer'),

  query('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid date in ISO 8601 format (YYYY-MM-DD)'),

  validationMiddleware
];

exports.validateDataByDateAndViewport = [
  param('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be a valid date in ISO 8601 format (YYYY-MM-DD)'),

  ...this.validateViewportParams.slice(0, -1), // Remove the validation middleware

  query('limit')
    .optional()
    .isInt({ min: 1, max: 5000 })
    .withMessage('Limit must be a number between 1 and 5000'),

  validationMiddleware
];
