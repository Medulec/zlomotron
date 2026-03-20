const express = require('express');
const router = express.Router();

// User wchodzi na /contact i express ogarnia to jako slug
const Page = require('../../models/Page');

router.get('/:slug', (req, res) => {
	const slug = req.params.slug;
    const isAdmin = req.session && req.session.isLoggedIn === true;
	//wyciaga URL z slug (req.params.slug)
	let page;
    if (isAdmin) {
        page = Page.getBySlug(slug);
    } else {
        page = Page.getByPublicSlug(slug);
    }
	if (!page) {
        return res.status(404).render('404', {
            title: 'Nie ma takiej strony!!!',
            redirect: 3
        });
    } else {
        res.render('page', {page: page,
        title: page.pageName
        })
    }
	//Jesli jest to pokazuje page
	//'Page' to nazwa pliku Strone bierze z Page bo views/ zostao ustawione w server.js -
	//page: page
	//^ nazwa zmiennej : wartosc z bazy
});

module.exports = router;
