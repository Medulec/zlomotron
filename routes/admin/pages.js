const express = require('express');
const router = express.Router();
const Page = require('../../models/Page');
const auth = require('../../middleware/auth');
const bcrypt = require('bcrypt');

router.post('/delete/:id', auth, (req, res) => {
    try {
    const pageID = req.params.id;
    Page.delete(pageID);
    res.redirect('/admin/pages');
    } catch (error) {
        console.error('Błąd usuwania strony, błąd: ', error);
        res.status(500).send('Coś sie popsuło podczas usuwania strony...');
    }

});

router.get('/edit/:id', auth, (req, res) => {
const id = req.params.id;
const page = Page.getByID(id);
if (!page) {
return res.status(404).send("Strona chyba nie istnieje");
}

res.render('admin/edit', {
title: 'Edytuj strone',
page: page,
layout: 'admin/admin-lay'
});
});

router.post('/edit/:id', auth, (req, res) => {
    try {
        const id = req.params.id;
        const data = {
            pageName: req.body.pageName,
            slug: req.body.slug,
            category: req.body.category,
            author: req.body.author,
            content: req.body.content,
            public: req.body.public ? 1 : 0,
            access: req.body.access
        };
        Page.update(id, data);
        res.redirect('/admin/pages');
    } catch (error) {
        console.error('Blad zapisu:', error);
        res.status(500).send("Jakis blad");
    }
});

router.get('/new', auth, (req, res) => {
try { 
res.render('admin/new', {
title: "Nowa strona",
layout: 'admin/admin-lay',
title: "Nowa strona"
});
} catch (error) {
console.error("Blad zapisu", error);
res.status(500).send("Cos jest nie tak");
}
});

router.post('/new', auth, (req, res) => {
try {
const data = {
            pageName: req.body.pageName,
            slug: req.body.slug,
            category: req.body.category,
            author: req.body.author,
            content: req.body.content,
            public: req.body.public ? 1 : 0,
            access: req.body.access
};
Page.create(data);
res.redirect('/admin/pages');
} catch (error) {
console.error("Blad dodania", error);
res.status(500).send("Cos poszlo nie tak");
}
});

router.get('/logout', (req, res) => {
 req.session.destroy((err) => {
 if (err) {
 console.error("Cos jest nie tak z wylogowaniem...: ", err);
 }
 res.render('admin/logout', {
 title: "Wylogowano"
 });
 
 });
 
});

module.exports = router;
