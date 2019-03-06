var dbfunctions = require("../db/dbfunctions.js"),
    draftFunctions = require("../db/draftFunctions.js"),
    express = require('express'),
    multer = require('multer'),
    router = express.Router();

var uploads = multer({
  dest: './uploads/'
});

//calls to /api/cube
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

//calls to /api/draft
router.route('/draft/pick/:draft_id')
  //.get() will get all picks of a particular draft
  .post(draftFunctions.saveDraft);

router.route('/draft/:cube_id')
  .get(draftFunctions.getDraftStats)
  .post(draftFunctions.createDraft);

//parameter middleware
router.param('cube_id', dbfunctions.cubeByID);
router.param('draft_id', draftFunctions.draftByID);

module.exports = router;
