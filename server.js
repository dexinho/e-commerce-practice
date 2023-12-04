const http = require("http");
const fsp = require("fs").promises;
const path = require("path");
const { parse } = require("querystring");
const querystring = require("querystring");
const multer = require("multer");

const hostname = "127.0.0.1";
const port = 3000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const server = http.createServer(async (req, res) => {
  const urlPath = req.url === "/" ? "index.html" : req.url;
  const extname = String(path.extname(urlPath)).toLowerCase();

  const contentType =
    {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "text/javascript",
    }[extname] || "application/octet-stream";

  if (req.url === "/favicon.ico") {
    res.writeHead(204, { "Content-Type": "image/x-icon" });
    res.end();
    return;
  }

  if (req.method === "GET" && req.url.startsWith("/removeProduct")) {
    const urlParts = req.url.split("?");
    const queryParams = new URLSearchParams(urlParts[1]);
    const productID = Number(queryParams.get("productID"));

    try {
      const data = await fsp.readFile("./products.json", "utf-8");
      let products = JSON.parse(data);

      const i = products.findIndex((product) => product.id === productID);
      products.splice(i, 1);

      fsp.writeFile("./products.json", JSON.stringify(products), "utf-8");

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(products));
    } catch (err) {
      console.log(err);
    }

    return;
  }

  if (req.method === "GET" && req.url.startsWith("/getProducts")) {
    const urlParts = req.url.split("?");
    const queryParams = new URLSearchParams(urlParts[1]);
    const sortBy = queryParams.get("sortBy");
    const searchQuery = queryParams.get("search");

    try {
      const data = await fsp.readFile("./products.json", "utf-8");
      let products = JSON.parse(data);

      if (searchQuery) {
        products = products.filter(
          (product) => product.name.toLowerCase() === searchQuery.toLowerCase()
        );
      }

      if (sortBy === "Price high") {
        products.sort((a, b) => b.price - a.price);
      } else if (sortBy === "Price low") {
        products.sort((a, b) => a.price - b.price);
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(products));
    } catch (error) {
      console.error("Error reading products file:", error.message);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    }
    return;
  }

  if (req.method === "POST" && req.url === "/addProduct") {
    upload.single("product-image-input")(req, res, async (err) => {
      if (err) {
        console.error("Error handling file upload:", err.message);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
        return;
      }

      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", async () => {
        const formData = parse(body);

        const newProduct = {
          name: formData["product-name-input"],
          price: formData["product-price-input"],
          description: formData["product-description-input"],
        };

        if (req.file) {
          const { path: tempPath, filename } = req.file;
          const uploadPath = path.join(__dirname, "uploads", filename);

          await fsp.rename(tempPath, uploadPath);

          newProduct.image = `/uploads/${filename}`;
        }

        try {
          const data = await fsp.readFile("./products.json", "utf-8");
          const products = JSON.parse(data);

          newProduct.id = Date.now();

          products.push(newProduct);

          await fsp.writeFile(
            "./products.json",
            JSON.stringify(products, null, 2),
            "utf-8"
          );

          res.writeHead(302, { Location: "/" });
          res.end();
        } catch (error) {
          console.error("Error updating products file:", error.message);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
        }
      });
    });
  } else if (req.method === "GET" && req.url === "/getProducts") {
    try {
      const data = await fsp.readFile("./products.json", "utf-8");
      const products = JSON.parse(data);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(products));
    } catch (error) {
      console.error("Error reading products file:", error.message);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    }
  } else {
    res.statusCode = 200;
    res.setHeader("Content-Type", contentType);
    const data = await fsp.readFile(path.join(__dirname, urlPath));
    res.end(data, "utf-8");
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
