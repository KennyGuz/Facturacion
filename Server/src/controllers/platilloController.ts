import { platilloService } from "../services/platilloService.js";
import { querySchema } from "../types/globalSchemas.js";
import { Request, Response } from "express"

export const platilloController = {

	async createPlatillo(req: Request, res: Response) {
		try {
			const { nombre, precio, ingredientes } = req.body;

			const result = await platilloService.createPlatillo({
				nombre,
				precio,
				ingredientes
			});

			if (!result.success) return res.status(400).json(result);

			return res.status(201).json(result);
		} catch (error) {
			console.log(error)
			res.status(500).json({ success: false, error: "Error Interno del servidor" });
		}
	},

	async updatePlatillo(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { nombre, precio, ingredientes } = req.body;

			if (!id || !Number(id)) return res.status(400).json({
				success: false,
				message: "id no valido",
				error: "Bad Request"
			});

			const result = await platilloService.updatePlatillo(Number(id), {
				nombre,
				precio,
				ingredientes
			});

			if (!result.success) return res.status(400).json(result);

			return res.status(200).json(result);
		} catch (error) {
			console.log(error)
			res.status(500).json({ success: false, error: "Error Interno del servidor" });
		}
	},

	async deletePlatillo(req: Request, res: Response) {
		try {
			const { id } = req.params;

			if (!id || !Number(id)) return res.status(400).json({
				success: false,
				message: "id no valido",
				error: "Bad Request"
			});

			const result = await platilloService.deletePlatillo(Number(id));

			if (!result.success) return res.status(400).json(result);

			return res.status(200).json(result);
		} catch (error) {
			console.log(error)
			res.status(500).json({ success: false, error: "Error Interno del servidor" });
		}
	},

	async getPlatillo(req: Request, res: Response) {
		try {
			const { id } = req.params;

			if (!id || !Number(id)) return res.status(400).json({
				success: false,
				message: "id no valido",
				error: "Bad Request"
			});

			const result = await platilloService.getPlatillo(Number(id));

			if (!result.success) return res.status(404).json(result);

			return res.status(200).json(result);
		} catch (error) {
			console.log(error)
			res.status(500).json({ success: false, error: "Error Interno del servidor" });
		}
	},

	async getPlatillos(req: Request, res: Response) {
		try {
			const { activo, search, page, limit } = req.query;

			const validationResult = querySchema.safeParse({ activo, search, page, limit });

			if (!validationResult.success) {
				return res.status(400).json({
					success: false,
					message: "Datos invalidos",
					errors: validationResult.error.flatten().fieldErrors
				});
			}
			const validatedData = validationResult.data

			const result = await platilloService.getPlatillos(
				validatedData.search,
				validatedData.activo,
				validatedData.page,
				validatedData.limit
			)

			if (!result.success) return res.status(400).json(result);

			return res.status(200).json(result);
		} catch (error) {
			console.log(error)
			res.status(500).json({ success: false, error: "Error Interno del servidor" });
		}
	},
}
