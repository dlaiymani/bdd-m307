const express = require("express");
const {Op} = require('sequelize');
const { QueryTypes } = require('sequelize');
require('dotenv').config();
const bodyParser = require("body-parser");

const {Playlist,Artist,Album,Track,PlaylistTrack,Passport} = require("./models")

const sequelize = require("./database/sequelize");
const port = process.env.PORT;
const app = express();
async function verifyDbCon(){
    try{
        await sequelize.authenticate();
        console.log("Connexion réussie!");
    }catch (error){
        console.log("échec de la connexion");
    }
}
async function syncModels(){
    try{
        await Passport.sync({alter:true});
        await Artist.sync({force:false, alter:true});
        await Playlist.sync({force:false});
        await Track.sync({force:false});
        await PlaylistTrack.sync({force:false});
        await Album.sync({force:false});
    } catch (error){
        console.error(error);
    }
}

verifyDbCon();
// **************************
// *** ASSOCIATIONS ***

// An artist has one passport (One-to-One)
Artist.hasOne(Passport);
Passport.belongsTo(Artist);

// An artist has many albums
Artist.hasMany(Album,{
    foreignKey: 'ArtistId'
});
// An album has one artist
Album.belongsTo(Artist,{
   foreignKey: 'ArtistId'
});

// define the many-to-many relationship of playlists and tracks
Playlist.belongsToMany(Track,{
   through: PlaylistTrack,
   foreignKey: 'PlaylistId',
});
Track.belongsToMany(Playlist,{ // track belongs to many playlists
    through: PlaylistTrack,
    foreignKey: 'TrackId'
})
// we need to sync the models with the existing database given that we are using the database-first approach
syncModels();

app.use(bodyParser.json());

app.get("/api/playlists",(req,res)=>{
    // add filtering in case a query string q is provided
    // ex ==> localhost:3000/api/playlist?q=m
    /*
    sequelize.query(`SELECT * FROM "Playlist" WHERE "Name" LIKE :search_name`,
        {     replacements: { search_name: `${req.query.q}%` },
            type: QueryTypes.SELECT })
        .then((playlists) => {
            res.status(200).send({success: 1, data: playlists});
        })
        .catch((e)=> {
            res.status(400).send({success: 0, data: e});
        })
    */

    let filter = {attributes: ['id','Name'],};
    if (req.query.q){
        filter = {
            attributes: ['id','Name'],
            where: {
                name: {
                    [Op.like] : `${req.query.q}%`
                }
            }
        };
    }
    Playlist.findAll(filter).then((playlists)=>{
       res.status(200).json(playlists);
    })
        .catch((e)=> {res.status(400).json("Not found!")});

});

// find playlist by primary key with the associated tracks
app.get("/api/playlists/:id",(req,res)=>{
    let { id } = req.params;
    Playlist.findByPk(id,{
        include: [Track]
    }).then((playlist)=>{
        if (playlist){
            res.status(200).json(playlist);
        } else {
            res.status(400).send();
        }
    }).catch((err)=>{
        console.log(err)
        res.status(400).send("Not found!");
    });
});

// find track by primary key with the associated playlist
app.get("/api/tracks/:id",(req,res)=>{
    let { id } = req.params;
    Track.findByPk(id,{
        include: [Playlist]
    }).then((track)=>{
        if (track){
            res.status(200).json(track);
        } else {
            res.status(400).send();
        }
    }).catch((err)=>{
        console.log(err)
        res.status(400).send("Not found!");
    });
});

// return artist with albums
app.get("/api/artists/:id",(req,res)=>{
    let { id } = req.params;
    Artist.findByPk(id,
        {
            include: [Album]
        }).then((artist)=>{
        if (artist){
            res.status(200).json(artist);
        } else {
            res.status(400).send();
        }
    }).catch((err)=>{
        res.status(400).send("Not found!");
    });
});

// add a new artist
app.post("/api/artists",(req,res)=>{
    let {  name, surname, email, age, password } = req.body;
    Artist.create({
        name: name,
        surname: surname,
        email: email,
        age: age,
        password: password
    }).then((artist)=>{
       res.json(artist);
    },(response)=>{
        res.status(422).json({errors:response.errors.map((error)=>{
                return {
                   attribute: error.path,
                   message: error.message
                }
            })
        });
    }).catch(err=> console.error(err));
});

// delete a playlist
app.delete('/api/playlists/:id',(req,res)=>{
   let { id } = req.params;
   Playlist
       .findByPk(id)
       .then((playlist)=>{
           if (playlist){
               // nous devrions supprimer tous les enregistrements
               // de la table de jointure PlaylistTrack
               return playlist.setTracks([]).then(()=>{
                   // après avoir supprimé la liste de lecture dans la table de jointure,
                   // nous pouvons supprimer de la table Playlist
                   return playlist.destroy();
               });
           }else {
               return Promise.reject();
           }
       })
       .then(() => {
           res.status(204).send(); // 204 No Content
       })
       .catch(()=> {
           res.status(404).send();
       })
});

// return album with associated artist
app.get("/api/albums/:id",(req,res)=>{
    let { id } = req.params;
    Album.findByPk(id,
        {
            include: [Artist] // here we can pass other relationships
        }).then((album)=>{
        if (album){
            res.status(200).json(album);
        } else {
            res.status(400).send();
        }
    }).catch((err)=>{
        res.status(400).send("Not found!");
    });
});

app.listen(port,()=>{
    console.log(`Le serveur ecoute sur le port ${port}`);
})
