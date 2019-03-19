var cubeFunctions = require("../db/cubeFunctions.js"),
    draftFunctions = require("../db/draftFunctions.js"),
    userFunctions = require("../db/userFunctions.js"),
    express = require('express'),
    passport = require('passport'),
    multer = require('multer'),
    router = express.Router();

var uploads = multer({
  dest: './uploads/'
});

//calls to /api/cube
router.route('/cube')
  .get(cubeFunctions.getCubes);

router.route('/cube/create')
  .post(cubeFunctions.createCube);

router.route('/cube/edit/:cube_id')
  .get(cubeFunctions.getCubeCards, cubeFunctions.getEditCards)
  .post(cubeFunctions.updateCube);

router.route('/cube/:cube_id')
  .get(cubeFunctions.getCubeCards, cubeFunctions.getCubeMFCards)
  .post(uploads.single('cubetxt'), cubeFunctions.addTxtToCube);

//calls to /api/draft
router.route('/draft')
  .get(draftFunctions.getAllDrafts);

router.route('/draft/pick/:draft_id')
  .get(draftFunctions.getCardsFromDraft)
  .post(draftFunctions.saveDraft);

router.route('/draft/:cube_id')
  .get(draftFunctions.getDraftStats)
  .post(draftFunctions.createDraft);

//calls to /api/user
router.route('/user')
  .get(userFunctions.getUser)
  .post(userFunctions.createAccount);

router.route('/user/login')
  .post(passport.authenticate('local', { successRedirect: '/'}));

//parameter middleware
router.param('cube_id', cubeFunctions.cubeByID);
router.param('draft_id', draftFunctions.draftByID);

module.exports = router;
