const express = require('express');

const server = express();

server.use('/', express.static(__dirname + '/public'));
server.use('/3D-Work', express.static(__dirname + '/public'));
server.listen(8080);