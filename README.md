#  ZŁOMOTRON

**Retro-styled web vortal for showcasing modded PCs and auctioning scavenged parts.**

Built to look and feel like it was pulled straight out of 2006 — gradients, gifs, chaotic cheap layouts, Web 1.5 vibes — but powered by a modern, minimal SEEN stack.

---

## What is this?

Złomotron is my personal design website where I publish my computer mods and list computer parts I've managed to acquire cheaply. Think of it as a love letter to the traditional, untamed internet, wrapped in a fully functional inventory and content management system.

It's also an **educational non-commercial project** – built from the ground up to help you understand full-stack web development without resorting to complex frameworks and abstractions. It's essentially a simple backend and vanilla JavaScript.
---

## Stack
SEEN - SQLite3, Express, EJS, Node.js

| Layer | Tech |
|---|---|
| **Runtime** | Node.js |
| **Server** | Express |
| **Templating** | EJS + express-ejs-layouts |
| **Database** | SQLite via better-sqlite3 |
| **Frontend JS** | Vanilla JavaScript (no frameworks) |
| **Styling** | Handwritten CSS (no utility frameworks) |
| **Auth** | bcrypt + express-session |
| **Hosting** | Self-hosted on Ubuntu Server via Docker + Cloudflare Tunnel |

---

## Design philosophy

**Simple tools for simple goal.**

- **Server-Side Rendering** — pages are built on the server with EJS and delivered as ready HTML. No client-side hydration, no virtual DOM, no build step.
- **Vanilla JS only** — every line of frontend JavaScript is plain, almost framework-free code. Maximum browser compatibility, zero dependency bloat.
- **Handcrafted CSS** — all styling is custom-written. The retro 2006 aesthetic (think tiled backgrounds, beveled borders, loud gradients, animated gifs) is achieved entirely through CSS — no UI libraries involved.
- **SQLite** — a single-file database. No external DB server to configure, no connection pooling to manage. Perfect for a small personal site.
- **Minimal footprint** — the entire app runs comfortably on an old Optiplex sitting under a desk. Fast cold starts, low memory usage, trivial deployment.

---

## Features

- Admin panel with login and session-based auth
- Page CMS — create, edit, delete site pages with a WYSIWYG editor
- Parts inventory — categorized component database with category-specific specs (motherboards, CPUs, GPUs, RAM, PSUs, cases)
- Filterable parts table with text search, category select, and price range
- Modular admin hub with expandable module grid

---

## Upcomming features

- A fully functioning landing page with current project news
- PC set design module based on dataflow from the inventory module
- User login and account creation system
- Working guestbook and shoutbox
- Integration with external scrapping services

---

## Deployment

The app is containerized with Docker and exposed to the internet through a Cloudflare Tunnel — no open ports, no static IP needed.

```
git clone https://github.com/medulec/zlomotron.git
cd zlomotron
docker compose up -d
```

SQLite database is stored as a host volume outside the container for persistence.

---

## Why this stack?

Because it's enough. No ORM, no React, no Tailwind, no Webpack. Just a pure server that renders HTML, a database that's a single file, and CSS written by hand. It's fast to build, fast to run, easy to deploy, and easy to understand top to bottom.
If something breaks, there are very few layers to dig through.

---

## UI Kit

Interested? [Check out the UI Kit](https://medulec.github.io/zlomotron/zlomotron-ui-kit.html) and a simple landing page mockup to learn more about the Złomotron concept!


## License

[MIT License](./LICENSE)