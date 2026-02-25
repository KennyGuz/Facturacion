import express, { Request, Response } from "express";
import cors from "cors";
import logger from "morgan";
import compression from "compression";
import { errorHandlingMiddleware } from "./middlewares/errorhandlingMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";

const port = process.env.PORT || 42069;

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
	origin: "http://localhost:4200",
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	credentials: true,
}))
app.disable('x-powered-by');
if (process.env.NODE_ENV === "development") {
  app.use(logger('dev'));

}
app.use(compression({
	level: 4,
	threshold: 1024,
}));

app.get("/health", (_req: Request, res: Response) => {
	res.send("OK");
});

app.use('/api', authRoutes)

app.use('/api', userRoutes)


// debe ir ultimo
app.use(errorHandlingMiddleware)

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
