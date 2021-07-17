require('dotenv/config');
const express = require('express');
const pg = require('pg');
const ClientError = require('./client-error');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const uploadsMiddleware = require('./uploads-middlewear');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

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

app.post('/api/sign-up', (req, res, next) => {
  const { name, username, password } = req.body;
  if (!name || !username || !password) {
    throw new ClientError(400, 'name, username, and password are required!');
  }
  argon2
    .hash(password)
    .then(hashedPassword => {
      const sql = `
        insert into "users"("name", "username", "password")
                    values ($1, $2, $3)
        returning "name", "username"`;
      const params = [name, username, hashedPassword];

      return db.query(sql, params);
    })
    .then(result => {
      const [user] = result.rows;
      res.status(201).json(user);
    })
    .catch(err => next(err));
});

app.post('/api/sign-in', (req, res, next) => {
  const { username, password, type } = req.body;
  if (!username || !password) {
    throw new ClientError(400, 'username and password are required!');
  }
  const sql = `
  select "username",
         "password" as "hashedPassword",
         "userId"
         from "users"
  where "username" = $1`;
  const params = [username];
  db.query(sql, params)
    .then(result => {
      const [user] = result.rows;
      if (!user) {
        throw new ClientError(401, 'invalid login');
      }
      const { userId, hashedPassword } = user;
      return argon2
        .verify(hashedPassword, password)
        .then(isMatching => {
          if (!isMatching) {
            throw new ClientError(401, 'invalid login!');
          }
          const payload = { userId, username, type };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.status(200).json({ token, user: payload });
        });
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
  const sql = `insert into "pools"("hostId", "location", "price", "description", "rules", "amenities", "image")
    values($1, $2, $3, $4, $5, $6, $7)
    returning *`;
  const params = [hostId, location, price, description, rules, amenities, url];

  db.query(sql, params)
    .then(result => {
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
           "users"."name"
      from "pools"
      join "users" on "users"."userId" = "pools"."hostId"
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
    throw new ClientError(400, 'swimmerId, poolId, date, startTime, and endTime are required fields!');
  }
  const sql1 = `
  select "pools"."poolId",
         "pools"."hostId"
    from "pools"
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

app.get('/api/host/booking-requests/:hostId', (req, res, next) => {
  const hostId = req.params.hostId;
  const sql = `
  select "users"."name",
         "bookingRequests"."date",
         "bookingRequests"."startTime",
         "bookingRequests"."endTime",
         "bookingRequests"."bookingId"
    from "bookingRequests"
    join "users" on "users"."userId" = "bookingRequests"."swimmerId"
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

app.get('/api/host/pools/:hostId', (req, res, next) => {
  const hostId = parseInt(req.params.hostId, 10);
  if (!Number.isInteger(hostId) || Math.sign(hostId) !== 1) {
    throw new ClientError(400, 'hostId must be a positive integer');
  }

  const sql = `
  select "poolId",
         "location",
         "image"
    from "pools"
  where "hostId" = $1`;
  const params = [hostId];

  db.query(sql, params)
    .then(result => {
      res.status(200).json(result.rows);
    });
});

app.put('/api/edit-pool/:poolId/:ifImage', uploadsMiddleware, (req, res, next) => {
  const ifImage = req.params.ifImage;
  const poolId = parseInt(req.params.poolId, 10);
  const location = req.body.location;
  const price = parseInt(req.body.price, 10);
  const description = req.body.description;
  const rules = req.body.rules;
  const amenities = req.body.amenities;
  let url = null;
  if (ifImage === 'true') {
    url = req.file.location;
  }
  if (!Number.isInteger(poolId) || Math.sign(poolId) !== 1) {
    throw new ClientError(400, 'poolId must be a positive integer!');
  }
  let sql = `
  update "pools"
  set "location" = $1,
      "price" = $2,
      "description" = $3,
      "rules" = $4,
      "amenities" = $5,
      "image" = $6
  where "poolId" = $7
  returning*`;
  let params = [location, price, description, rules, amenities, url, poolId];
  if (ifImage === 'false') {
    sql = `
  update "pools"
  set "location" = $1,
      "price" = $2,
      "description" = $3,
      "rules" = $4,
      "amenities" = $5
  where "poolId" = $6
  returning*`;
    params = [location, price, description, rules, amenities, poolId];
  }
  db.query(sql, params)
    .then(result => {
      res.status(200).json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.get('/api/swimmer/booking-requests/:swimmerId', (req, res, next) => {
  const swimmerId = parseInt(req.params.swimmerId, 10);
  if (!Number.isInteger(swimmerId) || Math.sign(swimmerId) !== 1) {
    throw new ClientError(400, 'swimmerId must be a positive integer!');
  }
  const sql = `
  select "poolId",
         "date",
         "startTime",
         "endTime",
         "status",
 "pools"."location",
 "pools"."price",
 "pools"."image"
  from "bookingRequests"
  join "pools" using ("poolId")
  where "swimmerId" = $1`;
  const params = [swimmerId];

  db.query(sql, params)
    .then(result => {
      res.status(200).json(result.rows);
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
