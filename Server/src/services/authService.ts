import bcrypt from "bcrypt";
import { runtimeEnv } from "@/env";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "@/utils/prisma";
import { ServeResponse } from "@/types/response";
import { UserData, UserSchema } from "./userService";

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

	}
};
