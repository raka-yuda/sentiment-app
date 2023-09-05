var express = require('express');
var router = express.Router();
const { getDataSeminar, scrappingSeminar, getDataCompetition, scrappingCompetition, scrappingSeminarNew, getDataSeminarNew, getListDataCompetition } = require("./controller");

router.get('/seminar', getDataSeminar);
router.get('/scrape-seminar', scrappingSeminar);
router.get('/competition', getDataCompetition);
router.get('/scrape-competition', scrappingCompetition);
router.get('/seminar-new', getDataSeminarNew);
router.get('/scrape-seminar-new', scrappingSeminarNew);
router.get('/list-competition', getListDataCompetition);


module.exports = router;
