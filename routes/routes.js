const express = require("express"),
    fs = require("fs"),
    album_route = require("./albums");

var router = express.Router();

router.get("/albums", album_route.get_all_albums);
router.get("/albums/:id", album_route.get_album);
router.post("/albums/:id", album_route.create_photo);
router.delete("/albums/:id", album_route.delete_album);
router.post("/albums", album_route.create_album);

module.exports = router;
