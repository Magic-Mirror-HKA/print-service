import express, { Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { handlePostPictureRequest, handleGetPicturesRequest } from "./request-handlers/pictureRequestHandlers";

const app: Express = express();
const port = 3002;

// Enable Cors with specific options
app.use(
    cors({
      //origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Middleware to parse JSON request bodies
app.use(bodyParser.json({ limit: "50mb" }));

app.post("/images", handlePostPictureRequest);

app.get("/images", handleGetPicturesRequest);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
