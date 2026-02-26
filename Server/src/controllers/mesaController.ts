import { mesaService } from "../services/mesaService.js";
import { querySchema } from "../types/globalSchemas.js";
import { Request, Response } from "express"

export const mesaController = {

	async createMesa(req: Request, res: Response) {
		try {
			const { numeroMesa, estaOcupada } = req.body;

			const result = await mesaService.createMesa({
				numeroMesa: Number(numeroMesa),
				estaOcupada
			});

			if (!result.success) return res.status(400).json(result);

			return res.status(201).json(result);
		} catch (error) {
			console.log(error)
			res.status(500).json({ success: false, error: "Error Interno del servidor" });
		}
	},

	async updateMesa(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { numeroMesa, estaOcupada } = req.body;

			if (!id || !Number(id)) return res.status(400).json({
				success: false,
				message: "id no valido",
				error: "Bad Request"
			});

			const result = await mesaService.updateMesa(Number(id), {
				numeroMesa: Number(numeroMesa),
				estaOcupada
			});

			if (!result.success) return res.status(400).json(result);

			return res.status(200).json(result);
		} catch (error) {
			console.log(error)
			res.status(500).json({ success: false, error: "Error Interno del servidor" });
		}
	},

	async deleteMesa(req: Request, res: Response) {
		try {
			const { id } = req.params;

			if (!id || !Number(id)) return res.status(400).json({
				success: false,
				message: "id no valido",
				error: "Bad Request"
			});

			const result = await mesaService.deleteMesa(Number(id));

			if (!result.success) return res.status(400).json(result);

			return res.status(200).json(result);
		} catch (error) {
			console.log(error)
			res.status(500).json({ success: false, error: "Error Interno del servidor" });
		}
	},

	async getMesa(req: Request, res: Response) {
		try {
			const { id } = req.params;

			if (!id || !Number(id)) return res.status(400).json({
				success: false,
				message: "id no valido",
				error: "Bad Request"
			});

			const result = await mesaService.getMesa(Number(id));

			if (!result.success) return res.status(404).json(result);

			return res.status(200).json(result);
		} catch (error) {
			console.log(error)
			res.status(500).json({ success: false, error: "Error Interno del servidor" });
		}
	},

	async getMesas(req: Request, res: Response) {
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

			const result = await mesaService.getMesas(
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
