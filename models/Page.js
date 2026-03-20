const { db } = require('../config/database');

const Page = {
    getAll: function() {
        return db.prepare('SELECT * FROM pages').all();
    },
    getByID: function(id) {
        return db.prepare('SELECT * FROM pages WHERE id = ?').get(id);
    },
    getBySlug: function(slug) {
        return db.prepare('SELECT * FROM pages WHERE slug = ?').get(slug);
    },
    create: function(data) { 
        const createdAT = new Date().toISOString();
        const query = db.prepare('INSERT INTO pages (pageName, slug, category, created_at, public, access, author, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        return query.run(data.pageName, data.slug, data.category, createdAT, data.public, data.access, data.author, data.content);
    },
    getAllPublic: function() {
        return db.prepare('SELECT * FROM pages WHERE public = 1').all();
    },
    update: function(id, data) {
        const modifiedAT = new Date().toISOString();
        const query = db.prepare('UPDATE pages SET pageName = ?, slug = ?, category = ?, modified_at = ?, public = ?, access = ?, content = ? WHERE id = ?');
        return query.run(data.pageName, data.slug, data.category, modifiedAT, data.public, data.access, data.content, id);
    },
    getFromAuthor: function(author) {
        return db.prepare('SELECT * FROM pages WHERE author = ?').all(author);
    },

    getByPublicSlug: function(slug) {
    return db.prepare('SELECT * FROM pages WHERE slug = ? AND public = 1').get(slug);
    },

    delete: function(id) {
        const query = db.prepare('DELETE FROM pages WHERE id = ?');
        return query.run(id);
    }
} 

module.exports = Page;

//ALL CRUD
