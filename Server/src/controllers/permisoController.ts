import { permisoService } from "src/services/permisoService.js";
import { querySchema } from "../types/globalSchemas.js";
import { Request, Response } from "express"

export const permisoController = {

	async createPermiso(req: Request, res: Response) {
		try {
			const { nombre } = req.body;
			const result = await permisoService.createPermiso({
				nombre,
			});

			if (!result.success) return res.status(400).json(result);

			return res.status(201).json(result);
		} catch (error) {
			console.log(error)
			res.status(500).json({ success: false, error: "Error Interno del servidor" });
		}
	},

	async updatePermiso(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { nombre } = req.body;



			const result = await permisoService.updatePermiso(Number(id), {
				nombre,
			});

			if (!result.success) return res.status(400).json(result);

			return res.status(200).json(result);
		} catch (error) {
			console.log(error)
			res.status(500).json({ success: false, error: "Error Interno del servidor" });
		}
	},

	async deletePermiso(req: Request, res: Response) {
		try {
			const { id } = req.params;


			const result = await permisoService.inactivarPermiso(Number(id));

			if (!result.success) return res.status(400).json(result);

			return res.status(200).json(result);
		} catch (error) {
			console.log(error)
			res.status(500).json({ success: false, error: "Error Interno del servidor" });
		}
	},

	async getPermiso(req: Request, res: Response) {
		try {
			const { id } = req.params;

			const result = await permisoService.getPermiso(Number(id));

			if (!result.success) return res.status(404).json(result);

			return res.status(200).json(result);
		} catch (error) {
			console.log(error)
			res.status(500).json({ success: false, error: "Error Interno del servidor" });
		}
	},

	async getPermisos(req: Request, res: Response) {
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

			const result = await permisoService.getPermisos(
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
