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
  //get array of all cubes
  .get(cubeFunctions.getCubes);

router.route('/cube/player')
  //get array of all cubes owned by req.user
  .get(cubeFunctions.getPlayerCubes);

router.route('/cube/create')
  //takes a name field and makes a cube for req.user
  .post(cubeFunctions.createCube);

router.route('/cube/edit/:cube_id')
  //get all card and cube_card info for a cube as well as all card info for duplicates in other sets
  .get(cubeFunctions.checkCubeOwner, cubeFunctions.getCubeCards, cubeFunctions.getEditCards)
  //sends an update for a certain cube_card field for a specific card in the cube
  .post(cubeFunctions.checkCubeOwner, cubeFunctions.updateCube);

router.route('/cube/:cube_id')
  //gets all necessary card information for all cards in a cube
  .get(cubeFunctions.getCubeCards, cubeFunctions.getCubeMFCards)
  //adds cards in a text file to a cube
  .post(uploads.single('cubetxt'), cubeFunctions.addTxtToCube);

//calls to /api/draft
router.route('/draft')
  //get all draft inforamtion as well as name of the drafted cube from mtgcube
  .get(draftFunctions.getAllDrafts);

router.route('/draft/player')
  //get all draft information for drafts done by req.user
  .get(draftFunctions.getPlayerDrafts);

router.route('/draft/pick/:draft_id')
  //get all card information for cards picked in a draft
  .get(draftFunctions.getCardsFromDraft)
  //save a pick to a draft at draft_id given an id, pack, and pick
  .post(draftFunctions.saveDraft);

router.route('/draft/:cube_id')
  //get all draft picks for all cards in a cube to calculate AI statistics
  .get(draftFunctions.getDraftStats)
  //creates a new draft for a cube to add picks to
  .post(draftFunctions.createDraft);

//calls to /api/user
router.route('/user')
  //get the current user
  .get(userFunctions.getUser)
  //create a new user
  .post(userFunctions.createAccount);

router.route('/user/login')
  //login process
  .post(passport.authenticate('local', { successRedirect: '/'}));

//parameter middleware
router.param('cube_id', cubeFunctions.cubeByID);
router.param('draft_id', draftFunctions.draftByID);

module.exports = router;
