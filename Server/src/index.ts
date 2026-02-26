import express, { Request, Response } from "express";
import cors from "cors";
import logger from "morgan";
import compression from "compression";
import { errorHandlingMiddleware } from "./middlewares/errorhandlingMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import ingredienteRoutes from "./routes/ingredienteRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import platilloRoutes from "./routes/platilloRoutes.js";
import cookieParser from "cookie-parser";
import swaggerUI from "swagger-ui-express";
import specs from "./swagger/swagger.js";

const port = process.env.PORT || 42069;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api-docs",swaggerUI.serve, swaggerUI.setup(specs));

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
app.use('/api', ingredienteRoutes)
app.use('/api', platilloRoutes)
app.use('/api', roleRoutes)


// debe ir ultimo
app.use(errorHandlingMiddleware)

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
