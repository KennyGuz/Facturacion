import { userService } from "../services/userService.js";
import { querySchema } from "../types/globalSchemas.js";
import { Request, Response } from "express"

export const userController = {
	async updateUser(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { email, password, nombre, apellido, cedula } = req.body;

			const result = await userService.updateUser(Number(id), {
				email,
				password,
				nombre,
				apellido,
				cedula
			});
			if (!result.success) return res.status(400).json(result);

			return res.status(200).json(result);
		} catch (error) {
			console.log(error)
			res.status(500).json({ success: false, error: "Error Interno del servidor" });
		}

	},


	async deleteUser(req: Request, res: Response) {
		try {
			const { id } = req.params;
			if (!id || !Number(id)) return res.status(400).json({
				success: false,
				message: "id no valido",
				error: "Bad Request"
			});

			const result = await userService.deleteUser(Number(id));
			if (!result.success) return res.status(400).json(result);

			return res.status(200).json(result);
		} catch (error) {
			console.log(error)
			res.status(500).json({ success: false, error: "Error Interno del servidor" });
		}
	},

	async getUser(req: Request, res: Response) {
		try {
			const { id } = req.params;
			if (!id || !Number(id)) return res.status(400).json({
				success: false,
				message: "id no valido",
				error: "Bad Request"
			});
			const currentUser = req.user;

			const result = await userService.getUser(Number(id), currentUser!);
			if (!result.success) return res.status(400).json(result);

			return res.status(200).json(result);
		} catch (error) {
			console.log(error)
			res.status(500).json({ success: false, error: "Error Interno del servidor" });
		}
	},

	async getUsers(req: Request, res: Response) {
		try {
			const { activo, search, page, limit } = req.query;

			// todo: una funcion que parsea los query params
			const validationResult = querySchema.safeParse({ activo, search, page, limit });

			// validamos los query params
			if (!validationResult.success) {
				return res.status(400).json({
					success: false,
					message: "Datos invalidos",
					errors: validationResult.error.flatten().fieldErrors
				});
			}
			const validatedData = validationResult.data

			const result = await userService.getUsers(
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

	async getProfile(req: Request, res: Response) {
		try {
			const currentUser = req.user;

			const result = await userService.getProfile( currentUser!);
			if (!result.success) return res.status(400).json(result);

			return res.status(200).json(result);
		} catch (error) {
			console.log(error)
			res.status(500).json({ success: false, error: "Error Interno del servidor" });
		}
	},



}
