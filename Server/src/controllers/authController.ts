import { runtimeEnv } from "../env.js";
import { authService } from "../services/authService.js";
import { Request, Response } from "express"
import jwt from "jsonwebtoken";

export const authController = {
	async register(req: Request, res: Response) {
		try {
			const { email, password, nombre, apellido, cedula } = req.body;

			const result = await authService.register({
				email,
				password,
				nombre,
				apellido,
				cedula,
			});

			// enviar al frontend el error 
			if (!result.success) return res.status(400).json( result );

			return res.status(201).json(result );
		} catch (error) {
			res.status(500).json({ success: false, message: "Error interno del servidor", error: "Error Interno del servidor" });
		}

	},



	async login(req: Request, res: Response) {
		try {
			const { email, password } = req.body;
			if (!email || !password) return res.status(400).json({ success: false, message: "Bad Request", error: "Email y contraseña son requeridos" });
			const result = await authService.login(email, password);
			if (!result.success) return res.status(400).json({ success: false, message: result.message, error: result.error });

			const token = jwt.sign({ userid: result.data.ID }, runtimeEnv.JWT_SECRET, {expiresIn: '5d'});

			res.cookie("_tk", token, {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				maxAge: 60 * 60 * 24 * 30 * 1000,

			})
			return res.status(200).json({ success: true, message: "Sesión iniciada", data: { token } });
		} catch (error) {
			console.log(error)
			res.status(500).json({ success: false, message: "Error interno del servidor", error: "Error Interno del servidor" });
		}
	},

	async logout(_req: Request, res: Response) {
		try {
			res.clearCookie("_tk", {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				maxAge: 60 * 60 * 24 * 30 * 1000,
			});

			return res.status(200).json({ success: true, message: "Sesion cerrada" });
		} catch (error) {
			console.log(error)
			res.status(500).json({ success: false, message: "Error interno del servidor", error: "Error Interno del servidor" });
		}
	},

	async sendResetPassword(req: Request, res: Response) {
		try {
			const { email } = req.body;
			if (!email) return res.status(400).json({ success: false, message: "Bad Request", error: "Email es requerido" });
			const result = await authService.sendResetPassword(email);
			if (!result.success) return res.status(400).json(result);

			return res.status(200).json({ success: result.success, message: result.message });


		} catch (error) {
			console.log(error)
			res.status(500).json({ success: false, message: "Error interno del servidor", error: "Error Interno del servidor" });
		}
	},


	async resetPassword(req: Request, res: Response) {
		try {
			const { password } = req.body;
			if (!password) return res.status(400).json({ success: false, message: "Bad Request", error: "Contraseña es requerida" });

			const user = req.user!;
			const result = await authService.resetPassword(Number(user.userid), password, user.jit!);
			if (!result.success) return res.status(400).json(result);

			return res.status(200).json({ success: result.success, message: result.message });


		} catch (error) {
			console.log(error)
			res.status(500).json({ success: false, message: "Error interno del servidor", error: "Error Interno del servidor" });
		}
	},


}
