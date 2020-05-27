const express = require('express'),
    path = require('path'),
    bodyParser = require("body-parser"),
    cors = require("cors"),
    routes = require("./routes/routes.js"),
    fs = require('fs');

const app = express();
const port = 3001;

app.get('/', (req, res) => {
    fs.readFile("html/index.html", (err, html) => {
        if (err) {
            throw err;
        }

        res.writeHeader(200, { "Content-Type": "text/html" });
        res.write(html);
        res.end();
    })
});
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




app.use('/', routes);
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/create-album', express.static(path.join(__dirname, 'html/Create_Album_Form.html')));
app.use('/add-picture', express.static(path.join(__dirname, 'html/Pic_Form.html')));


const server = app.listen(port, () => {
    console.log('listening on port %s...', server.address().port);
});