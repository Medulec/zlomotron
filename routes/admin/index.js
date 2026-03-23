const express = require('express');
const router = express.Router();
const Page = require('../../models/Page');
const auth = require('../../middleware/auth');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {

    if (req.session && req.session.isLoggedIn) {
    return res.render('admin/hub/admin-hub', {
        title: "CENTRUM ADMINOWSKIE 1.0",
        layout: 'admin/admin-lay'
    })
    } else {
    res.redirect('/admin/login');
    }
});

router.get('/login', (req, res) => {
    if (req.session && req.session.isLoggedIn) {
        return res.redirect('/admin/admin-hub');
    }
    res.render('admin/auth/login', {
        title : 'Panel Adminowski'
    });
});

router.post('/login', async (req, res) => {
    const password = req.body.password;
    const hash = process.env.ADMIN_PASSWORD_HASH;

    try {
        const isValid = await bcrypt.compare(password, hash);
        if (isValid) {
            req.session.isLoggedIn = true;
            res.json({success: true});

            } else {
            res.json({success: false});
        }
    } catch (error) {
        console.error('Błąd podczas logowania:', error);
        res.json({ success: false})
    }
});


router.get('/admin-hub', auth, (req, res) => {
    res.redirect('/admin/')
});

router.get('/logout/', (req, res) =>{
    req.session.destroy((err) => {
        if(err) {
            return res.status(500).send("Błąd wylogowania")
        }
        res.clearCookie('connect.sid');
        res.render('admin/logout', {
            title: "Wylogowanie"
        })
    })
});

router.get('/pages', auth, (req, res) => {
    const pages = Page.getAll();
    res.render('admin/pages', {
        title: 'Zarządzanie Stronami',
        pages: pages,
        layout: 'admin/admin-lay'
    });
});

router.use('/pages', require('./pages'));
router.use('/drafting', require('./drafting'));
router.use('/inventory', require('./inventory'));

module.exports = router;