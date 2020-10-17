const express = require('express');
const { addFine } = require('../controllers/fine-controller');
const router = express.Router();

router.post('/add-fine', addFine);
router.get('/test', (req, res) => {
  res.status(200).json({
    msg: 'we are up!!!',
  });
});
module.exports = router;
