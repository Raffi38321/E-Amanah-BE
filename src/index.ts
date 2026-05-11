import express from "express";
import ENV from "./utils/ENV";
import connect from "./services/Mongo";
import authRouter from "./routes/auth.route";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./utils/swagger";
import cors from "cors";
import userRouter from "./routes/user.route";
import laporBarangRouter from "./routes/laporBarang.route";

const PORT = ENV.PORT;
const app = express();

connect();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ message: "server jalan" });
});
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/lapor-barang", laporBarangRouter);

app.use("/docs", swaggerUi.serve);
app.get("/docs", swaggerUi.setup(swaggerSpec));
app.get("/docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.listen(PORT, () => {
  console.log(`jalan di port ${PORT}`);
});
