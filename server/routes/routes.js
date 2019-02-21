var dbfunctions = require("../db/dbfunctions.js"),
    express = require('express'),
    router = express.Router();

router.route('/cube')
      .get(dbfunctions.getCubes);

router.route('/cube/:cube_id')
  .get(dbfunctions.getCubeCards);

router.param('cube_id', dbfunctions.cubeByID);

module.exports = router;
