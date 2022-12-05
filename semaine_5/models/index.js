//  models/index.js
const Playlist = require("./playlist")
const Artist = require("./artist")
const Album = require("./album")
const Track = require("./track")
const PlaylistTrack = require("./playlist.track");
const Passport = require("./artist.passport");


module.exports = {
    Playlist : Playlist,
    Artist : Artist,
    Album: Album,
    Track: Track,
    PlaylistTrack: PlaylistTrack,
    Passport: Passport
}
