require('dotenv/config');
const express = require('express');
const pg = require('pg');
const ClientError = require('./client-error');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const uploadsMiddleware = require('./uploads-middlewear');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

const json = express.json();

app.use(json);

app.use(staticMiddleware);

app.post('/api/hosts', uploadsMiddleware, (req, res, next) => {
  const name = req.body.name;
  const location = req.body.location;
  const price = parseInt(req.body.price, 10);
  const description = req.body.description;
  const rules = req.body.rules;
  const amenities = req.body.amenities;
  const url = '/images/' + req.file.filename;
  if (!Number.isInteger(price) || Math.sign(price) !== 1) {
    throw new ClientError(400, 'price must be a positive integer');
  }
  if (!name || !location || !price || !description || !rules || !amenities) {
    throw new ClientError(400, 'name, location, price, description, rules, and amenities are required fields!');
  }
  const sql1 = `
    insert into "hosts"("name", "hostId", "poolId")
    values($1, $2, $3)
    returning *`;
  const sql2 = `insert into "pools"("location", "price", "description", "rules", "amenities", "image", "poolId")
    values($1, $2, $3, $4, $5, $6, $7)
    returning *`;
  const params1 = [name, 1, 1];
  const params2 = [location, price, description, rules, amenities, url, 1];

  db.query(sql1, params1)
    .then(result => {
      const firstResult = result.rows[0];
      db.query(sql2, params2)
        .then(result => {
          const secondResult = result.rows[0];
          secondResult.name = firstResult.name;
          res.status(201).json(secondResult);
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

app.get('/api/pools/:location', (req, res, next) => {
  const location = req.params.location;
  const sql = `
    select "location",
           "price",
           "image",
           "poolId"
      from "pools"
    where "location" = $1`;
  const params = [location];
  db.query(sql, params)
    .then(result => {
      res.status(200).json(result.rows);
    })
    .catch(err => next(err));
});

app.get('/api/pool/:poolId', (req, res, next) => {
  const poolId = parseInt(req.params.poolId, 10);
  if (!Number.isInteger(poolId) || Math.sign(poolId) !== 1) {
    throw new ClientError(400, 'poolId must be a positive integer');
  }
  const sql = `
    select "pools"."poolId",
           "pools"."location",
           "pools"."price",
           "pools"."description",
           "pools"."rules",
           "pools"."amenities",
           "pools"."image",
           "pools"."hostId",
           "hosts"."name"
      from "pools"
      join "hosts" using ("poolId")
      where "poolId" = $1`;
  const params = [poolId];
  db.query(sql, params)
    .then(result => {
      if (!result.rows[0]) {
        throw new ClientError(404, `Pool with poolId of ${poolId} was not found`);
      }
      res.status(200).json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.post('/api/book', (req, res, next) => {
  const { swimmerId, poolId, date, startTime, endTime } = req.body;
  if (!swimmerId || !poolId || !date || !startTime || !endTime) {
    throw new ClientError(400, 'swimmerId, hostId, poolId, date, startTime, and endTime are required fields!');
  }
  const sql = `
    insert into "bookingRequests"("swimmerId", "poolId", "date", "startTime", "endTime", "status")
                          values ($1, $2, $3, $4, $5, 'pending')
    returning *`;
  const params = [swimmerId, poolId, date, startTime, endTime];
  db.query(sql, params)
    .then(result => {
      res.status(201).json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.post('/api/swimmer', (req, res, next) => {
  const name = req.body.name;

  const sql = `
    insert into swimmers ("name", "swimmerId")
                  values($1 , $2)
                  returning *`;
  const params = [name, 1];

  db.query(sql, params)
    .then(result => {
      res.status(201).json(result.rows[0]);
    });
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
