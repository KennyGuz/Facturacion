import bcrypt from "bcrypt";
import { runtimeEnv } from "../env.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../utils/prisma.js";
import { ServeResponse } from "../types/response.js";
import { UserData, UserSchema } from "./userService.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { nodemailerMjmlPlugin } from "nodemailer-mjml";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";
import { redisClient } from "src/lib/redis.js";



export const authService = {

	async login(email: string, password: string): Promise<ServeResponse> {
		try {
			const user = await prisma.usuario.findUnique({
				where: {
					Email: email,
					Active: true
				}
			})

			if (!user) return {
				success: false,
				message: "Usuario o contraseña incorrectos"
			};
			const passwordMatch = await bcrypt.compare(password, user.Password);
			if (!passwordMatch) return {
				success: false,
				message: "Usuario o contraseña incorrectos"
			};

			return {
				success: true,
				message: "OK",
				data: user
			};
		} catch (error) {
			// loggear el error en grafana o prometheus o algo asi
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					return {
						success: false,
						message: "Usuario o contraseña incorrectos"
					}
				}

			}
			throw error;
		}


	},

	async register(data: UserData): Promise<ServeResponse> {
		try {

			const validationResult = UserSchema.safeParse(data);

			if (!validationResult.success) {
				return {
					success: false,
					message: "Datos invalidos",
					errors: validationResult.error.flatten().fieldErrors
				};
			}
			const validatedData = validationResult.data

			const password = await bcrypt.hash(validatedData.password, runtimeEnv.SALT_ROUNDS);


			await prisma.usuario.create({
				data: {
					Email: validatedData.email,
					Nombre: validatedData.nombre,
					Apellido: validatedData.apellido,
					Cedula: validatedData.cedula,
					Password: password,
					Active: true,
					Roles: {
						connect: [{
							ID: 2
						}]
					},

				},
			});

			return {
				success: true,
				message: "OK",
			};
		} catch (error: unknown) {
			// loggear el error en grafana o prometheus o algo asi
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					return {
						success: false,
						message: "Usuario o contraseña incorrectos",
						error: "Error al crear usuario"
					}
				}

			}
			throw error;

		}

	},


	async sendResetPassword(email: string): Promise<ServeResponse> {
		try {

			const validationResult = UserSchema.pick({email: true}).safeParse({email});

			if (!validationResult.success) {
				return {
					success: false,
					message: "Datos invalidos",
					errors: validationResult.error.flatten().fieldErrors
				};
			}
			const validatedData = validationResult.data

			
			const user = await prisma.usuario.findUnique({
				where: {
					Email: validatedData.email,
					Active: true
				}
			})
			if (!user) return {
				success: false,
				message: "Usuario no encontrado"
			};
			const jit = uuidv4();

			const token = jwt.sign({ userid: user.ID, jit },
				runtimeEnv.JWT_RESET_SECRET,
				{ expiresIn: '5m' });


			// guardamos en redis el token para que no se pueda resetear mas de una vez
			await redisClient.set(`rst:${jit}`, "pending", { ex: 300 });


			const transporter = nodemailer.createTransport({

				service: "gmail",
				auth: {
					user: runtimeEnv.SMPT_HOST,
					pass: runtimeEnv.SMPT_PASS
				}

			});
			transporter.use("compile", nodemailerMjmlPlugin(
				{
					templateFolder: path.join(process.cwd(), "src/templates"),
				}
			));

			await transporter.sendMail({
				from: runtimeEnv.SMPT_HOST,
				to: user.Email,
				subject: "Reseteo de contraseña",
				templateLayoutName: "reset",
				templateData: {
					FirstName: user.Nombre,
					LastName: user.Apellido,
					Token: token,
				},
			})
			return {
				success: true,
				message: "OK",
				data: user
			};
		} catch (error) {
			// loggear el error en grafana o prometheus o algo asi
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					return {
						success: false,
						message: "Usuario o contraseña incorrectos"
					}
				}

			}
			throw error;
		}
	},


	async resetPassword(userid: number, password: string): Promise<ServeResponse> {
		try {
			const validationResult = UserSchema.pick({password: true}).safeParse({password});

			if (!validationResult.success) {
				return {
					success: false,
					message: "Datos invalidos",
					errors: validationResult.error.flatten().fieldErrors
				};
			}

			const validatedData = validationResult.data

			const passwordHash = await bcrypt.hash(validatedData.password, runtimeEnv.SALT_ROUNDS);

			await prisma.usuario.update({
				where: {
					ID: userid
				},
				data: {
					Password: passwordHash
				}
			});

			return {
				success: true,
				message: "Contraseña reseteada",
			};
		} catch (error) {
			// loggear el error en grafana o prometheus o algo asi
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					return {
						success: false,
						message: "Por favor contactar con el administrador"
					}
				}

			}
			throw error;
		}
	}
};
