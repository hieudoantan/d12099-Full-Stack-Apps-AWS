import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util.js";
const app = express();
const port = process.env.PORT || 8082;
app.use(bodyParser.json());
app.get("/filteredimage", async (req, res) => {
  try {
    const queryUrl = req.query.image_url.trim();
    if (!queryUrl) {
      res.status(400).send("Bad request");
    }
    const path = await filterImageFromURL(queryUrl);
    res.sendFile(path);
    res.on("finish", () => {
      deleteLocalFiles([path]);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
});
app.get("/", async (req, res) => {
  res.send("try GET /filteredimage?image_url={{}}");
});
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log(`press CTRL+C to stopserver`);
});
