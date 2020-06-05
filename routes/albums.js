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
            if(values[id]==undefined){
                res.send("Album does not exist");
                return;
            }
            res.send(values[id]);
        });
    },

    // create new photo
    create_photo: function (req, res) {
        readFile((data) => {
            let pic_index = 1;
            let i = 0;
            let values = {};
            values = JSON.parse(data);
            let pic_name = req.body.name;
            let photographer_n = req.body.photographer;
            let url = req.body.link;
            if (pic_name == undefined || pic_name.trim() == "") {
                res.send("Must enter a Picture Name.");
                return;
            }
            if (photographer_n == undefined || photographer_n.trim() == "") {
                res.send("Must enter a Photographer Name.");
                return;
            }
            if (!validURL(url)) {
                res.send("Url Must be Valid.");
                return;
            }
            let id = req.params.id;
            let album = values[id];
            if (album == undefined) {
                res.send("Album does not exist");
                return;
            }
            let pictures = album["pictures"];
            while (pictures[pic_index] != undefined) {
                pic_index++;
            }
            pictures[pic_index] = req.body;
            pictures[pic_index].id = pic_index + "";
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
            let album_type = req.body.type;
            let album_name = req.body.name;
            let pic_val = req.body.pictures;
            if (album_name == undefined || album_name.trim() == "") {
                res.send("Album Name required.");
                return;
            }
            if (album_type != "People" && album_type != "Nature") {
                res.send("Album Type must be type of Nature or People.");
                return;
            }
            let id = 1;
            while (values[id] != undefined) {
                id++;
            }
            values[id] = req.body;
            if (pic_val == undefined) {
                let album = values[id];
                album["pictures"] = {};
            }

            writeFile(JSON.stringify(values, null, 2), () => {
                res.status(200).send("New album has created.");
            });
        });
    }
};
function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}