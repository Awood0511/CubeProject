var dbfunctions = require("../db/dbfunctions.js"),
    express = require('express'),
    multer = require('multer'),
    router = express.Router();

var uploads = multer({
  dest: './uploads/'
});

router.route('/cube')
      .get(dbfunctions.getCubes);

router.route('/cube/:cube_id')
  .get(dbfunctions.getCubeCards)
  .post(uploads.single('cubetxt'), dbfunctions.addTxtToCube);

router.param('cube_id', dbfunctions.cubeByID);

module.exports = router;
