const http = require("http");
const fs = require('fs').promises;
let indexFile;
const host = 'localhost';
const port = 8000;

const requestListener = function(req, res){
	res.setHeader("Content-Type", "text/html");
	res.writeHead(200);
	res.end(indexFile);
}

const server = http.createServer(requestListener);

fs.readFile(__dirname + "/BlockyAnimal.html").then(contents =>{
	indexFile = contents;
	server.listen(port, host, () => {
		console.log("test");
	});
}).catch(err =>{
	console.error("doesnt' work");
	process.exit(1);
});

server.listen(port, host, () =>{
console.log("Server is running on http://$(host):$(port)");
});
