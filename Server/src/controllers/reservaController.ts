import { reservaService } from "../services/reservaService.js";
import { querySchema } from "../types/globalSchemas.js";
import { Request, Response } from "express"

export const reservaController = {

	async createReserva(req: Request, res: Response) {
		try {
			const { cedulaCliente, nombreCliente, telefonoCliente, idMesa, fechaReserva, horaReserva, numeroPersonas, nota } = req.body;
			const currentUser = req.user;

			const result = await reservaService.createReserva({
				cedulaCliente,
				nombreCliente,
				telefonoCliente,
				idMesa,
				fechaReserva,
				horaReserva,
				numeroPersonas,
				nota
			}, currentUser!);

			if (!result.success) return res.status(400).json(result);

			return res.status(201).json(result);
		} catch (error) {
			console.log(error)
			res.status(500).json({ success: false, error: "Error Interno del servidor" });
		}
	},

	async updateReserva(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { cedulaCliente, nombreCliente, telefonoCliente, idMesa, fechaReserva, horaReserva, numeroPersonas, nota } = req.body;

			if (!id || !Number(id)) return res.status(400).json({
				success: false,
				message: "id no valido",
				error: "Bad Request"
			});

			const result = await reservaService.updateReserva(Number(id), {
				cedulaCliente,
				nombreCliente,
				telefonoCliente,
				idMesa,
				fechaReserva,
				horaReserva,
				numeroPersonas,
				nota
			});

			if (!result.success) return res.status(400).json(result);

			return res.status(200).json(result);
		} catch (error) {
			console.log(error)
			res.status(500).json({ success: false, error: "Error Interno del servidor" });
		}
	},

	async deleteReserva(req: Request, res: Response) {
		try {
			const { id } = req.params;

			if (!id || !Number(id)) return res.status(400).json({
				success: false,
				message: "id no valido",
				error: "Bad Request"
			});

			const result = await reservaService.deleteReserva(Number(id));

			if (!result.success) return res.status(400).json(result);

			return res.status(200).json(result);
		} catch (error) {
			console.log(error)
			res.status(500).json({ success: false, error: "Error Interno del servidor" });
		}
	},

	async getReserva(req: Request, res: Response) {
		try {
			const { id } = req.params;

			if (!id || !Number(id)) return res.status(400).json({
				success: false,
				message: "id no valido",
				error: "Bad Request"
			});

			const result = await reservaService.getReserva(Number(id));

			if (!result.success) return res.status(404).json(result);

			return res.status(200).json(result);
		} catch (error) {
			console.log(error)
			res.status(500).json({ success: false, error: "Error Interno del servidor" });
		}
	},

	async getReservas(req: Request, res: Response) {
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

			const result = await reservaService.getReservas(
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
