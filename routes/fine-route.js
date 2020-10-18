const express = require('express');
const {
  addFine,
  getAllFinesByManagerId,
} = require('../controllers/fine-controller');
const router = express.Router();

router.post('/add-fine', addFine);
router.get('/:managerId', getAllFinesByManagerId);
router.get('/test', (req, res) => {
  res.status(200).json({
    msg: 'we are up!!!',
  });
});
module.exports = router;
