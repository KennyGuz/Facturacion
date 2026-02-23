import { Prisma } from "generated/prisma/browser";
import bcrypt from "bcrypt";
import { runtimeEnv } from "@/env";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "@/utils/prisma";
import { ServeResponse } from "@/types/response";

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

	async register(data: Prisma.UsuarioCreateInput): Promise<Boolean> {
		try {
			const password = await bcrypt.hash(data.Password, runtimeEnv.SALT_ROUNDS);


			await prisma.usuario.create({
				data: {
					Email: data.Email,
					Nombre: data.Nombre,
					Apellido: data.Apellido,
					Cedula: data.Cedula,
					Password: password,
					Active: true,
					Roles: {
						connect: [{
							ID: 2
						}]
					},

				},
			});

			return true;
		} catch (error: unknown) {
			// loggear el error en grafana o prometheus o algo asi
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					return false
				}

			}
			throw error;

		}

	}
};
