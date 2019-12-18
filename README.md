# Swagger Express Router

Sets up express routes bound to middleware and controller functions out of a swagger document.

All routing is therefore driven from the swagger file.

## Installation

```
$ npm install --save @coldrift/swagger-router-express
```

## Example Swagger file

The following sample code will set up a **GET** endpoint with URL **http://localhost:8000/api/v1/test1** bound to the function named **test** in the controller module **controller1** proxied by middleware function **requireAuth** in middleware module **middleware1**.

Swagger document `swagger.json`

```yaml
swagger: "2.0"
info:
  version: "0.0.1"
  title: ""
  description: ""
basePath: /api/v1
consumes:
  - application/json
produces:
  - application/json
paths:
  /test1:
    get:
      x-controller: "controller1.test"
      x-middleware:
        - "middleware1.requireAuth"
      tags:
        - /test
      description:
      parameters:
      responses:
```

## How to set up routes with express

```javascript
const YAML = require('yaml-js');
const swaggerRouter = require('@coldrift/swagger-router-express');

const app = express();
const swaggerDocument = YAML.load(fs.readFileSync(path.join(__dirname, './swagger.yaml')))

// this makes the module use the basePath from the swagger document
// when setting up the routes (defaults to false). Makes sense if
// you are attaching swagger router to a nester router
const useBasePath = true;

const middlewareObj = {
    middleware1: require('./middleware/middleware1'),
    controller1: require('./controllers/controller1'),
    controller2: require('./controllers/controller2')
};

swaggerRouter.setUpRoutes(middlewareObj, app, swaggerDocument, useBasePath);
```

## Example of controllers and middleware

Example of a controller `controllers/controller1.js`

```javascript
'use strict';

exports.test = (req, res) => res.json({success: true});
```

Example of a middleware `middleware/middleware1.js`

```javascript
'use strict';

exports.requireAuth = (req, res, next) => {
  if(!res.headers["authorization"]) {
    return res.status(401);
  }

  next();
}

```

## License

MIT
