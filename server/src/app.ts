import express, { Application } from "express";

// Controllers (route handlers)
import * as DataController from "./controllers/Data";

// Create Express server
const app: Application = express();
// Express configuration
app.set("port", process.env.SERVER_PORT || 4001);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Cache-control", `no-store`);
  next();
});

/**
 * Primary app routes.
 */
app.get("/tree", DataController.getData);
app.get("/node/:id", DataController.getNode);
app.post("/add-tree", DataController.postData);
app.get("/init-tree", DataController.getInitData);

export default app;
