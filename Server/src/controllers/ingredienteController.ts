import { ingredienteService } from "../services/ingredienteService.js";
import { querySchema } from "../types/globalSchemas.js";
import { Request, Response } from "express"

export const ingredienteController = {

	async createIngrediente(req: Request, res: Response) {
		try {
			const { nombre, cantidadKilos } = req.body;
			if (!nombre || !cantidadKilos) return res.status(400).json({
				success: false,
				message: "Datos invalidos",
				error: "Bad Request"
			});



			const result = await ingredienteService.createIngrediente({
				nombre,
				cantidadKilos: Number(cantidadKilos)
			});

			if (!result.success) return res.status(400).json(result);

			return res.status(201).json(result);
		} catch (error) {
			console.log(error)
			res.status(500).json({ success: false, error: "Error Interno del servidor" });
		}
	},

	async updateIngrediente(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { nombre, cantidadKilos } = req.body;

			if (!id || !Number(id)) return res.status(400).json({
				success: false,
				message: "id no valido",
				error: "Bad Request"
			});


			const result = await ingredienteService.updateIngrediente(Number(id), {
				nombre,
				cantidadKilos: Number(cantidadKilos)
			});

			if (!result.success) return res.status(400).json(result);

			return res.status(200).json(result);
		} catch (error) {
			console.log(error)
			res.status(500).json({ success: false, error: "Error Interno del servidor" });
		}
	},

	async deleteIngrediente(req: Request, res: Response) {
		try {
			const { id } = req.params;

			if (!id || !Number(id)) return res.status(400).json({
				success: false,
				message: "id no valido",
				error: "Bad Request"
			});

			const result = await ingredienteService.deleteIngrediente(Number(id));

			if (!result.success) return res.status(400).json(result);

			return res.status(200).json(result);
		} catch (error) {
			console.log(error)
			res.status(500).json({ success: false, error: "Error Interno del servidor" });
		}
	},

	async getIngrediente(req: Request, res: Response) {
		try {
			const { id } = req.params;

			if (!id || !Number(id)) return res.status(400).json({
				success: false,
				message: "id no valido",
				error: "Bad Request"
			});

			const result = await ingredienteService.getIngrediente(Number(id));

			if (!result.success) return res.status(404).json(result);

			return res.status(200).json(result);
		} catch (error) {
			console.log(error)
			res.status(500).json({ success: false, error: "Error Interno del servidor" });
		}
	},

	async getIngredientes(req: Request, res: Response) {
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

			const result = await ingredienteService.getIngredientes(
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
