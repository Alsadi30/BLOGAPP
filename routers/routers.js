const authRoute = require("./authRoute");
const dashboardRoute = require("./dashboardRoute");
const uploadRoute = require("./uploadRoute");
const postRoute = require("./postRoute");
const exploreRoute = require("./exploreRoute");
const searchRoute = require('./searchRoute')
const authorRoute = require('../routers/authorRoute')
const apiRoute = require("../api/routes/aptRoutes");

const routes = [
  {
    path: "/auth",
    handler: authRoute,
  },
  {
    path: "/dashboard",
    handler: dashboardRoute,
  },
  {
    path: "/uploads",
    handler: uploadRoute,
  },
  {
    path: "/posts",
    handler: postRoute,
  },
  {
    path: "/explorer",
    handler: exploreRoute,
  },{
    path:'/search',
    handler:searchRoute
  },{
    path:'/author',
    handler:authorRoute
  },
  {
    path: "/api",
    handler: apiRoute,
  },

  {
    path: "/",
    handler: (req, res) => {
      res.redirect('/explorer')
    },
  },
];

module.exports = (app) => {
  routes.forEach((r) => {
    if (r.path === "/") {
      app.get(r.path, r.handler);
    } else {
      app.use(r.path, r.handler);
    }
  });
};
