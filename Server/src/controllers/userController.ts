import { userService } from "@/services/userService";
import { Request, Response } from "express"

export const userController = {
	async updateUser(req: Request, res: Response) {
		try {
			console.log(req.params)
			const { id } = req.params;
			const { email, password, nombre, apellido, cedula } = req.body;

			const result = await userService.updateUser(Number(id), {
				email,
				password,
				nombre,
				apellido,
				cedula
			});
			if (!result.success) return res.status(400).json({ sucess: result.success, errors: result.errors });

			return res.status(200).json({ sucess: result.success, message: result.message });
		} catch (error) {
			console.log(error)
			res.status(500).json({ success: false, error: "Error Interno del servidor" });
		}

	},

}
