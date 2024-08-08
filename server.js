const http = require('http');
const fs = require('fs');
const port = 1000;

const server = http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.readFile('index.html', function (error, data) {
        if (error) {
            res.writeHead(404);
            res.write("File not found!");
        } else {
            res.write(data);
        }
        res.end();
    });
});

server.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}/`);
});
