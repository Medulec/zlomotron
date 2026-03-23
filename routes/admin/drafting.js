const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Build = require('../../models/Build');
const Parts = require('../../models/Parts');

router.get('/', auth, (req, res) => {  
  const builds = Build.getAllBuild();
  const lastBuilds = builds[0];
  const parts = Parts.getAll();

  res.render('admin/drafting-module/drafting-table', {
    title: "DESKA KRESLARSKA",
    layout: 'admin/drafting-module/drafting-lay',
    builds: builds,
    lastBuilds: lastBuilds,
    allParts: parts
  });
});

router.post('/new', (req, res) => {
try {
const data = {
            name: req.body.name,
            layout_data: req.body.layout_data
};

const create = Build.createBuild(data);

res.json({success: true, lastBuild: create })

} catch (error) {
console.error("Błąd dodania ", error);
res.status(500).send("Coś poszlo nie tak...");
}
});

router.post('/save/:id', auth, (req, res) => {

try {
const slots = req.body.slots

const save = Build.saveBuild(req.params.id, slots);

res.json({success: true})

} catch (error) {
console.error("Błąd zapisu ", error);
res.status(500).send("Coś poszlo nie tak...");
}
});

router.post('/delete/:id', auth, (req, res) => {
    try {
    const id = req.params.id;
    Build.deleteBuild(id)

    res.redirect('/admin/drafting');
    } catch (error) {
        console.error('Błąd usuwania projektu, błąd: ', error);
        res.status(500).send('Coś sie popsuło podczas usuwania projektu...');
    }

});

module.exports = router;