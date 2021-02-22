const deezerRoute = require("express").Router();

//METHODS IMPORTS
const {
  deezerSearch,
  deezerArtists,
  deezerAlbums,
  deezerTracks,
} = require("../controllers/deezer");

//ENDPOINT
deezerRoute.get("/search", deezerSearch);
deezerRoute.get("/artist", deezerArtists);
deezerRoute.get("/album", deezerAlbums);
deezerRoute.get("/track", deezerTracks);

//EXPORTS
module.exports = deezerRoute;
