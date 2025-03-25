const db = require('../../config/database');
const logger = require('../../config/logger');

exports.findAll = async (limit = 100, offset = 0) => {
  try {
    const query = `
      SELECT
        city, 
        observation_date, 
        predicted_pm25, 
        pop_density_2010, 
        ST_AsGeoJSON(geom)::json as geometry
      FROM environmental.air_quality
      ORDER BY observation_date DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await db.query(query, [limit, offset]);
    return result.rows;
  } catch (error) {
    logger.error('Database error in airQuality.repository.findAll:', error);
    throw error;
  }
};

exports.findByCity = async (city) => {
  try {
    const query = `
      SELECT 
        city, 
        observation_date, 
        predicted_pm25, 
        pop_density_2010, 
        ST_AsGeoJSON(geom)::json as geometry
      FROM environmental.air_quality
      WHERE city = $1
      ORDER BY observation_date DESC
    `;
    const result = await db.query(query, [city]);
    return result.rows;
  } catch (error) {
    logger.error(`Database error in airQuality.repository.findByCity with city ${city}:`, error);
    throw error;
  }
};

exports.findByDate = async (date) => {
  try {
    const query = `
      SELECT
        city, 
        observation_date, 
        predicted_pm25, 
        pop_density_2010, 
        ST_AsGeoJSON(geom)::json as geometry
      FROM environmental.air_quality
      WHERE observation_date = $1
      ORDER BY city, predicted_pm25 DESC
    `;
    const result = await db.query(query, [date]);
    return result.rows;
  } catch (error) {
    logger.error(`Database error in airQuality.repository.findByDate with date ${date}:`, error);
    throw error;
  }
};

exports.findByDateRange = async (startDate, endDate) => {
  try {
    const query = `
      SELECT 
        city, 
        observation_date, 
        predicted_pm25, 
        pop_density_2010, 
        ST_AsGeoJSON(geom)::json as geometry
      FROM environmental.air_quality
      WHERE observation_date BETWEEN $1 AND $2
      ORDER BY observation_date, city
    `;
    const result = await db.query(query, [startDate, endDate]);
    return result.rows;
  } catch (error) {
    logger.error('Database error in airQuality.repository.findByDateRange:', error);
    throw error;
  }
};

exports.findByPM25Range = async (minPm25, maxPm25, limit = 1000) => {
  try {
    const query = `
      SELECT 
        city, 
        observation_date, 
        predicted_pm25, 
        pop_density_2010,
        ST_AsGeoJSON(geom)::json as geometry
      FROM environmental.air_quality
      WHERE predicted_pm25 BETWEEN $1 AND $2
      ORDER BY predicted_pm25 DESC
      LIMIT $3
    `;
    const result = await db.query(query, [minPm25, maxPm25, limit]);
    return result.rows;
  } catch (error) {
    logger.error('Database error in airQuality.repository.findByPM25Range:', error);
    throw error;
  }
};

exports.findByPopulationDensity = async (minDensity, maxDensity, limit = 1000) => {
  try {
    const query = `
      SELECT 
        city, 
        observation_date, 
        predicted_pm25, 
        pop_density_2010,
        ST_AsGeoJSON(geom)::json as geometry
      FROM environmental.air_quality
      WHERE pop_density_2010 BETWEEN $1 AND $2
      ORDER BY pop_density_2010 DESC
      LIMIT $3
    `;
    const result = await db.query(query, [minDensity, maxDensity, limit]);
    return result.rows;
  } catch (error) {
    logger.error('Database error in airQuality.repository.findByPopulationDensity:', error);
    throw error;
  }
};

exports.findNearby = async (lat, lng, distance, date = null) => {
  try {
    let query = `
      SELECT 
        city, 
        observation_date, 
        predicted_pm25, 
        pop_density_2010,
        ST_AsGeoJSON(geom)::json as geometry,
        ST_Distance(
          geom, 
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
        ) as distance
      FROM environmental.air_quality
      WHERE ST_DWithin(
        geom,
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
        $3
      )
    `;

    const params = [lng, lat, distance];

    if (date) {
      query += ' AND observation_date = $4';
      params.push(date);
    }

    query += ' ORDER BY distance, observation_date DESC';

    const result = await db.query(query, params);
    return result.rows;
  } catch (error) {
    logger.error('Database error in airQuality.repository.findNearby:', error);
    throw error;
  }
};

exports.getAvgPM25ByCity = async () => {
  try {
    const query = `
      SELECT 
        city, 
        AVG(predicted_pm25)::numeric(10,2) as avg_pm25,
        MIN(predicted_pm25)::numeric(10,2) as min_pm25,
        MAX(predicted_pm25)::numeric(10,2) as max_pm25,
        COUNT(*) as observation_count
      FROM environmental.air_quality
      GROUP BY city
      ORDER BY avg_pm25 DESC
    `;
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    logger.error('Database error in airQuality.repository.getAvgPM25ByCity:', error);
    throw error;
  }
};

exports.getTimeSeries = async (city, startDate, endDate) => {
  try {
    const query = `
      SELECT 
        observation_date, 
        AVG(predicted_pm25)::numeric(10,2) AS avg_pm25,
        MIN(predicted_pm25)::numeric(10,2) AS min_pm25,
        MAX(predicted_pm25)::numeric(10,2) AS max_pm25,
        COUNT(*) as data_points
      FROM environmental.air_quality
      WHERE city = $1
        AND observation_date BETWEEN $2 AND $3
      GROUP BY observation_date
      ORDER BY observation_date
    `;
    const result = await db.query(query, [city, startDate, endDate]);
    return result.rows;
  } catch (error) {
    logger.error('Database error in airQuality.repository.getTimeSeries:', error);
    throw error;
  }
};

exports.getClusters = async (zoom, bounds, date = null) => {
  try {
    const { north, south, east, west } = bounds;

    const gridSize = 20 - parseInt(zoom);

    let query = `
      SELECT 
        ST_AsGeoJSON(ST_Centroid(cluster_geom))::json as centroid,
        AVG(predicted_pm25)::numeric(10,2) as avg_pm25,
        COUNT(*) as point_count,
        array_agg(DISTINCT city) as cities
      FROM (
        SELECT
          predicted_pm25,
          city,
          ST_ClusterDBSCAN(geom, eps := $1, minpoints := 2) OVER () as cid,
          ST_Collect(geom) OVER (PARTITION BY ST_ClusterDBSCAN(geom, eps := $1, minpoints := 2) OVER ()) as cluster_geom
        FROM environmental.air_quality
        WHERE ST_MakeEnvelope($2, $3, $4, $5, 4326) && geom
    `;

    const params = [gridSize * 0.01, west, south, east, north];

    if (date) {
      query += ' AND observation_date = $6';
      params.push(date);
    }

    query += `
      ) clusters
      WHERE cid IS NOT NULL
      GROUP BY cid, cluster_geom
    `;

    const result = await db.query(query, params);
    return result.rows;
  } catch (error) {
    logger.error('Database error in airQuality.repository.getClusters:', error);
    throw error;
  }
};

exports.getSimplifiedByViewport = async (zoom, bounds, date = null) => {
  try {
    const { north, south, east, west } = bounds;

    const tolerance = Math.pow(2, 20 - parseInt(zoom)) / 1000;

    let query = `
      SELECT 
        city,
        observation_date,
        AVG(predicted_pm25)::numeric(10,2) as avg_pm25,
        AVG(pop_density_2010)::numeric(10,2) as avg_density,
        COUNT(*) as data_points,
        ST_AsGeoJSON(ST_Simplify(ST_Centroid(ST_Collect(geom)), $1))::json as geometry
      FROM environmental.air_quality
      WHERE ST_MakeEnvelope($2, $3, $4, $5, 4326) && geom
    `;

    const params = [tolerance, west, south, east, north];

    if (date) {
      query += ' AND observation_date = $6';
      params.push(date);
    }

    query += `
      GROUP BY city, observation_date
      ORDER BY avg_pm25 DESC
    `;

    const result = await db.query(query, params);
    return result.rows;
  } catch (error) {
    logger.error('Database error in airQuality.repository.getSimplifiedByViewport:', error);
    throw error;
  }
};

exports.getByViewport = async (bounds, date = null, limit = 500) => {
  try {
    const { north, south, east, west } = bounds;

    let query = `
      SELECT 
        city, 
        observation_date, 
        predicted_pm25, 
        pop_density_2010,
        ST_AsGeoJSON(geom)::json as geometry
      FROM environmental.air_quality
      WHERE ST_MakeEnvelope($1, $2, $3, $4, 4326) && geom
    `;

    const params = [west, south, east, north];

    if (date) {
      query += ' AND observation_date = $5';
      params.push(date);
    }

    query += ` LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await db.query(query, params);
    return result.rows;
  } catch (error) {
    logger.error('Database error in airQuality.repository.getByViewport:', error);
    throw error;
  }
};

exports.getVectorTile = async (z, x, y, date = null) => {
  try {
    let query = `
      WITH bounds AS (
        SELECT ST_TileEnvelope($1, $2, $3) AS geom
      )
      SELECT ST_AsMVT(tile, 'air_quality', 4096, 'geom') AS mvt
      FROM (
        SELECT
          city,
          AVG(predicted_pm25)::numeric(10,2) as avg_pm25,
          COUNT(*) as point_count,
          ST_AsMVTGeom(
            ST_Centroid(ST_Collect(geom)),
            bounds.geom,
            4096,
            256,
            true
          ) AS geom
        FROM environmental.air_quality, bounds
        WHERE ST_Intersects(geom, bounds.geom)
    `;

    const params = [z, x, y];

    if (date) {
      query += ' AND observation_date = $4';
      params.push(date);
    }

    query += `
        GROUP BY city
      ) AS tile
    `;

    const result = await db.query(query, params);
    return result.rows.length > 0 ? result.rows[0].mvt : null;
  } catch (error) {
    logger.error('Database error in airQuality.repository.getVectorTile:', error);
    throw error;
  }
};

exports.getCities = async () => {
  try {
    const query = `
      SELECT DISTINCT city
      FROM environmental.air_quality
      ORDER BY city
    `;
    const result = await db.query(query);
    return result.rows.map((row) => row.city);
  } catch (error) {
    logger.error('Database error in airQuality.repository.getCities:', error);
    throw error;
  }
};

exports.getDates = async () => {
  try {
    const query = `
      SELECT DISTINCT observation_date
      FROM environmental.air_quality
      ORDER BY observation_date
    `;
    const result = await db.query(query);
    return result.rows.map((row) => row.observation_date);
  } catch (error) {
    logger.error('Database error in airQuality.repository.getDates:', error);
    throw error;
  }
};

exports.getPM25Stats = async () => {
  try {
    const query = `
      SELECT 
        MIN(predicted_pm25)::numeric(10,2) as min_pm25,
        MAX(predicted_pm25)::numeric(10,2) as max_pm25,
        AVG(predicted_pm25)::numeric(10,2) as avg_pm25,
        PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY predicted_pm25)::numeric(10,2) as q1_pm25,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY predicted_pm25)::numeric(10,2) as median_pm25,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY predicted_pm25)::numeric(10,2) as q3_pm25
      FROM environmental.air_quality
    `;
    const result = await db.query(query);
    return result.rows[0];
  } catch (error) {
    logger.error('Database error in airQuality.repository.getPM25Stats:', error);
    throw error;
  }
};

exports.getPopulationDensityStats = async () => {
  try {
    const query = `
      SELECT 
        MIN(pop_density_2010)::numeric(10,2) as min_density,
        MAX(pop_density_2010)::numeric(10,2) as max_density,
        AVG(pop_density_2010)::numeric(10,2) as avg_density,
        PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY pop_density_2010)::numeric(10,2) as q1_density,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY pop_density_2010)::numeric(10,2) as median_density,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY pop_density_2010)::numeric(10,2) as q3_density
      FROM environmental.air_quality
    `;
    const result = await db.query(query);
    return result.rows[0];
  } catch (error) {
    logger.error('Database error in airQuality.repository.getPopulationDensityStats:', error);
    throw error;
  }
};

exports.getDateRange = async () => {
  try {
    const query = `
      SELECT 
        MIN(observation_date) as min_date,
        MAX(observation_date) as max_date
      FROM environmental.air_quality
    `;
    const result = await db.query(query);
    return result.rows[0];
  } catch (error) {
    logger.error('Database error in airQuality.repository.getDateRange:', error);
    throw error;
  }
};

exports.getDataByDateAndViewport = async (date, bounds, limit = 1000) => {
  try {
    const { north, south, east, west } = bounds;

    const query = `
      SELECT 
        id, 
        city, 
        observation_date, 
        predicted_pm25, 
        pop_density_2010,
        ST_AsGeoJSON(geom)::json as geometry
      FROM environmental.air_quality
      WHERE observation_date = $1
        AND ST_MakeEnvelope($2, $3, $4, $5, 4326) && geom
      ORDER BY predicted_pm25 DESC
      LIMIT $6
    `;

    const result = await db.query(query, [date, west, south, east, north, limit]);
    return result.rows;
  } catch (error) {
    logger.error('Database error in airQuality.repository.getDataByDateAndViewport:', error);
    throw error;
  }
};

exports.getClustersByDate = async (date, zoom, bounds) => {
  try {
    const { north, south, east, west } = bounds;

    const gridSize = 20 - parseInt(zoom);

    const query = `
      SELECT 
        ST_AsGeoJSON(ST_Centroid(cluster_geom))::json as centroid,
        AVG(predicted_pm25)::numeric(10,2) as avg_pm25,
        COUNT(*) as point_count,
        array_agg(DISTINCT city) as cities
      FROM (
        SELECT
          predicted_pm25,
          city,
          ST_ClusterDBSCAN(geom, eps := $1, minpoints := 2) OVER () as cid,
          ST_Collect(geom) OVER (PARTITION BY ST_ClusterDBSCAN(geom, eps := $1, minpoints := 2) OVER ()) as cluster_geom
        FROM environmental.air_quality
        WHERE observation_date = $2
          AND ST_MakeEnvelope($3, $4, $5, $6, 4326) && geom
      ) clusters
      WHERE cid IS NOT NULL
      GROUP BY cid, cluster_geom
    `;

    const result = await db.query(query, [gridSize * 0.01, date, west, south, east, north]);
    return result.rows;
  } catch (error) {
    logger.error('Database error in airQuality.repository.getClustersByDate:', error);
    throw error;
  }
};
