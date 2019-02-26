var dbfunctions = require("../db/dbfunctions.js"),
    express = require('express'),
    multer = require('multer'),
    router = express.Router();

var uploads = multer({
  dest: './uploads/'
});

router.route('/cube')
      .get(dbfunctions.getCubes);

router.route('/cube/create')
  .post(dbfunctions.createCube);

router.route('/cube/edit/:cube_id')
  .get(dbfunctions.getCubeCards, dbfunctions.getEditCards)
  .post(dbfunctions.updateCube);

router.route('/cube/:cube_id')
  .get(dbfunctions.getCubeCards, dbfunctions.getCubeMFCards)
  .post(uploads.single('cubetxt'), dbfunctions.addTxtToCube);

router.param('cube_id', dbfunctions.cubeByID);

module.exports = router;
