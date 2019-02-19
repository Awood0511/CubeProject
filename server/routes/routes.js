var dbfunctions = require("../db/dbfunctions.js"),
    express = require('express'),
    router = express.Router();

/* for calls to /api/cubecards*/
router.route('/cubecards')
  .get(dbfunctions.getCards);

module.exports = router;
