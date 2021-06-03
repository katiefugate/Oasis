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

app.post('/api/host', (req, res, next) => {
  const name = req.body.name;
  const sql = `
    insert into "hosts"("name", "hostId", "poolId")
    values($1, $2, $3)
    returning *`;
  const params = [name, 1, null];

  db.query(sql, params)
    .then(result => {
      res.status(201).json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.post('/api/pools/:hostId', uploadsMiddleware, (req, res, next) => {
  const location = req.body.location;
  const price = parseInt(req.body.price, 10);
  const description = req.body.description;
  const rules = req.body.rules;
  const amenities = req.body.amenities;
  const hostId = req.params.hostId;
  const url = req.file.location;
  if (!Number.isInteger(price) || Math.sign(price) !== 1) {
    throw new ClientError(400, 'price must be a positive integer');
  }
  if (!location || !price || !description || !rules || !amenities) {
    throw new ClientError(400, 'name, location, price, description, rules, and amenities are required fields!');
  }
  const sql = `insert into "pools"("hostId", "location", "price", "description", "rules", "amenities", "image", "poolId")
    values($1, $2, $3, $4, $5, $6, $7, $8)
    returning *`;
  const params = [hostId, location, price, description, rules, amenities, url, 1];

  const sql2 = `update "hosts"
  set "poolId" = $1
  where "hostId" = $2`;
  const params2 = [1, hostId];

  db.query(sql, params)
    .then(result => {
      db.query(sql2, params2)
        .catch(err => next(err));
      res.status(201).json(result.rows[0]);
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
  const sql1 = `
  select "pools"."poolId",
         "hosts"."hostId"
    from "pools"
    join "hosts" using ("poolId")
    where "poolId" = $1`;
  const params1 = [poolId];
  db.query(sql1, params1)
    .then(result => {
      const hostId = result.rows[0].hostId;
      const params2 = [swimmerId, poolId, hostId, date, startTime, endTime];
      const sql2 = `
      insert into "bookingRequests"("swimmerId", "poolId", "hostId", "date", "startTime", "endTime", "status")
                            values ($1, $2, $3, $4, $5, $6, 'pending')
      returning *`;
      db.query(sql2, params2)
        .then(result => {
          res.status(201).json(result.rows[0]);
        })
        .catch(err => next(err));
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
    })
    .catch(err => next(err));
});

app.get('/api/host/booking-requests/:hostId', (req, res, next) => {
  const hostId = req.params.hostId;

  const sql = `
  select "swimmers"."name",
         "bookingRequests"."date",
         "bookingRequests"."startTime",
         "bookingRequests"."endTime",
         "bookingRequests"."bookingId"
    from "bookingRequests"
    join "swimmers" using ("swimmerId")
   where "hostId" = $1 AND "status" = 'pending'`;
  const params = [hostId];

  db.query(sql, params)
    .then(result => {
      res.status(200).json(result.rows);
    })
    .catch(err => next(err));
});

app.put('/api/host/booking-status/:bookingId', (req, res, next) => {
  const bookingId = req.params.bookingId;
  const status = req.body.status;
  if (!status) {
    throw new ClientError(400, 'status is required!');
  }
  const sql = `
    update "bookingRequests"
    set "status" = $1
    where "bookingId" = $2
    returning*`;
  const params = [status, bookingId];

  db.query(sql, params)
    .then(result => {
      res.status(200).json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
