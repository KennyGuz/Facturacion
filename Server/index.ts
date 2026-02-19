import express, { Request, Response } from "express";
const port = process.env.PORT || 42069;

const app = express();

app.get("/health", (_req: Request, res: Response) => {
	res.send("OK");
});


app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
