import express, { Request, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import welcomeRoutes from "./routes/welcomeroutes";
import geminiRoutes from "./routes/geminiRoutes";
import dbconnect from "./utils/dbconnect";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import cookieParser = require("cookie-parser");
import { UserModel } from "./schema/userModel";

dotenv.config();

const app = express();
const port = 3000;
const jwtsec = process.env.JWT_SECRET || " ";

app.use(express.json());

app.use(cookieParser());
app.use(cors());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", welcomeRoutes);
app.use("/api/v1/", geminiRoutes);

//@ts-ignore
app.post("/", async (req, res) => {
  const body = req.body;
  const user = await UserModel.findOne({ email: body.email });
  return res.json({
    //@ts-ignore
    user: user,
  });
});

//@ts-ignore
app.post("/check", async (req: Request, res: Response) => {
  const body = req.body;
  if (body.token == "a") {
    return res.json({
      msg: "false",
    });
  } else {
    const verify = await jwt.verify(body.token, jwtsec);
    if (verify) {
      return res.json({
        msg: "true",
      });
    } else {
      return res.json({
        msg: "false",
      });
    }
  }
});

dbconnect();

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
