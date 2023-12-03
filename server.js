const http = require("http");
const fsp = require("fs").promises;
const path = require("path");
const { parse } = require("querystring");

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

  if (req.method === "GET") {
    res.statusCode = 200;
    res.setHeader("Content-Type", contentType);
    const data = await fsp.readFile(path.join(__dirname, urlPath));
    res.end(data, "utf-8");
  } else if (req.method === "POST") {
    let body = "";
    req.on("data", async () => {
      const formData = parse(body);
      console.log("Form data received", formData);
      res.writeHead(302, { Location: "/" });
      res.end();
    });
  } else {
    res.statusCode = 405;
    res.end("Method not allowed");
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
