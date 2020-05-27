const fs = require("fs");
// variables
const data_path = "./routes/assets/album.json";

// helper methods
const readFile = (callback, returnJson = false, filePath = data_path, encoding = "utf8") => {
    fs.readFile(filePath, encoding, (err, data) => {
        if (err) {
            console.log(err);
        }
        callback(returnJson ? JSON.parse(data) : data);
    });
};

const writeFile = (fileData, callback, filePath = data_path, encoding = "utf8") => {
    fs.writeFile(filePath, fileData, encoding, (err) => {
        if (err) {
            console.log(err);
        }
        callback();
    });
};

module.exports = {

    get_all_albums: function (req, res) {
        readFile((data) => {
            let values = {};
            values = JSON.parse(data);
            res.send(values);
        });
    },
    // read -
    get_album: function (req, res) {
        readFile((data) => {
            let values = {};
            values = JSON.parse(data);
            let id = req.params.id;
            res.send(values[id]);
        });
    },

    // create new photo
    create_photo: function (req, res) {
        readFile((data) => {
            let i = 0;
            let values = {};
            values = JSON.parse(data);
            if (!req.body.id) return res.send("ERROR: No ID received, add failure.");
            let id = req.params.id;
            let album = values[id];
            let pictures = album["pictures"];
            if (pictures[req.body.id] != undefined) {
                return res.send("ERROR: photo id is allready exist.");
            }
            pictures[req.body.id] = req.body;
            writeFile(JSON.stringify(values, null, 2), () => {
                res.status(200).send("New photo added to album.");
            });
        });
    },

    // delete album
    delete_album: function (req, res) {
        readFile((data) => {
            let values = {};
            values = JSON.parse(data);
            let id = req.params.id;
            if (values[id] != undefined) {
                delete values[id];
                writeFile(JSON.stringify(values, null, 2), () => {
                    res.status(200).send("Album " + id + " has deleted.");
                });
            } else {
                res.send("Error, this album does not exist");
            }
        });
    },

    // create new album
    create_album: function (req, res) {
        readFile((data) => {
            
            let values = {};
            values = JSON.parse(data);
            let id =1;
            while (values[id] != undefined) {
                id++;
            }
            values[id] = req.body;

            writeFile(JSON.stringify(values, null, 2), () => {
                res.status(200).send("New album has created.");
            });
        });
    }
};
