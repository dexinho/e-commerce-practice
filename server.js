const http = require("http");
const fsp = require("fs").promises;
const path = require("path");

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer(async (req, res) => {
  const urlPath = req.url === "/" ? "index.html" : req.url;
  const extname = String(path.extname(urlPath)).toLowerCase();

  const contentType =
    {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "text/javascript",
    }[extname] || "application/octet-stream";

  console.log(contentType);

  res.statusCode = 200;
  res.setHeader = ("Content-Type", contentType);
  const data = await fsp.readFile(path.join(__dirname, urlPath));
  res.end(data, "utf-8");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
