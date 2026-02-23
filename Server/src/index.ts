import express, { Request, Response } from "express";
import authRoutes from "@/routes/authRoutes";
import userRoutes from "@/routes/userRouter";
import cors from "cors";
import logger from "morgan";
import compression from "compression";


const port = process.env.PORT || 42069;

const app = express();
app.use(express.json())

app.use(cors({
	origin: "*",
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
