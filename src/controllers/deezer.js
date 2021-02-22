const axios = require("axios");

const rapidApiKey = process.env.RAPID_API_KEY,
  rapidApiHost = process.env.RAPID_API_HOST,
  rapidApiBaseUrl = process.env.RAPID_API_BASE_URL,
  headers = {
    "x-rapidapi-key": `${rapidApiKey}`,
    "x-rapidapi-host": `${rapidApiHost}`,
  },
  deezerOptions = (url, params) => {
    if (params) {
      return {
        method: "GET",
        url: `${url}`,
        params: params,
        headers: headers,
      };
    } else {
      return {
        method: "GET",
        url: `${url}`,
        headers: headers,
      };
    }
  };

//SEARCH
const deezerSearch = async (req, res, next) => {
  let url = `${rapidApiBaseUrl}/search`;
  let params = { q: req.query.search };
  let options = deezerOptions(url, params);
  try {
    axios
      .request(options)
      .then(function (response) {
        // console.log(response.data);
        let result = response.data;
        res.send(result);
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//FETCH ARTIST
const deezerArtists = async (req, res, next) => {
  let url = `${rapidApiBaseUrl}/artist/${req.query.artistId}`,
    options = deezerOptions(url);
  try {
    axios
      .request(options)
      .then(function (response) {
        // console.log(response.data);
        let result = response.data;
        res.send(result);
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//FETCH ALBUM
const deezerAlbums = async (req, res, next) => {
  let url = `${rapidApiBaseUrl}/album/${req.query.albumId}`,
    options = deezerOptions(url);
  try {
    axios
      .request(options)
      .then(function (response) {
        // console.log(response.data);
        let result = response.data;
        res.send(result);
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//FETCH TRACK
const deezerTracks = async (req, res, next) => {
  let url = `${rapidApiBaseUrl}/album/${req.query.trackId}`,
    options = deezerOptions(url);
  try {
    axios
      .request(options)
      .then(function (response) {
        // console.log(response.data);
        let result = response.data;
        res.send(result);
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { deezerSearch, deezerArtists, deezerAlbums, deezerTracks };
