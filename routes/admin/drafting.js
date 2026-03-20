const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

router.get('/', auth, (req, res) => {  
  res.render('admin/drafting-table', {
    title: "DESKA KRESLARSKA",
    layout: 'admin/drafting-lay'
  });
});

module.exports = router;