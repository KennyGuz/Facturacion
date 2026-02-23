import bcrypt from "bcrypt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../utils/prisma.js";
import { ServeResponse } from "../types/response.js";
import { z } from 'zod'

export const UserSchema = z.object({
	nombre: z.string()
		.min(1, 'Nombre del usuario es requerido')
		.max(50, 'El nombre del usuario no puede superar los 50 caracteres'),
	apellido: z.string()
		.min(1, 'Apellido del usuario es requerido')
		.max(50, 'El apellido del usuario no puede superar los 50 caracteres'),
	cedula: z.string()
		.min(1, 'Cedula del usuario es requerido')
		.max(12, 'La cedula del usuario no puede superar los 12 caracteres')
		.regex(/^\d+$/, 'La cedula del usuario debe ser unicamente numeros')
	,
	password: z.string()
		.min(1, 'Contraseña del usuario es requerido')
		.max(36, 'La contraseña del usuario no puede superar los 36 caracteres')
		.regex(/^(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
			'La contraseña del usuario debe contener al menos un numero y un caracter especial'),

	email: z.email(
		{
			pattern: z.regexes.html5Email,
			message: 'El email del usuario debe ser valido'
		}),
	// el rol default es bartender
	rol: z.array(z.number()).optional(),

})
export type UserData = z.infer<typeof UserSchema>

export const userService = {

	async updateUser(id: number, data: Partial<UserData>): Promise<ServeResponse> {
		try {

			const userSchemaPartial = UserSchema.partial();
			const validationResult = userSchemaPartial.safeParse(data);

			if (!validationResult.success) {
				return {
					success: false,
					message: "Datos invalidos",
					errors: validationResult.error.flatten().fieldErrors
				};
			}

			const validatedData = validationResult.data
			const updateData: Record<string, unknown> = {}
			if (validatedData.nombre !== undefined)
				updateData.Nombre = validatedData.nombre
			if (validatedData.apellido !== undefined)
				updateData.Apellido = validatedData.apellido
			if (validatedData.cedula !== undefined)
				updateData.Cedula = validatedData.cedula
			// si se cambio la contraseña se hashea y se actualiza
			if (validatedData.password !== undefined) {
				const hashedPassword = await bcrypt.hash(validatedData.password, 10);
				updateData.Password = hashedPassword
			}
			if (validatedData.email !== undefined)
				updateData.Email = validatedData.email
			if (validatedData.rol !== undefined)
				updateData.Roles = validatedData.rol

			await prisma.usuario.update({
				where: {
					ID: id
				},
				data: updateData,
			})

			return {
				success: true,
				message: "OK",
			};
		} catch (error) {
			// loggear el error en grafana o prometheus o algo asi
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					return {
						success: false,
						message: "Usuario o contraseña incorrectos",
						error: "Error al actualizar usuario"
					}
				}

			}
			throw error;
		}


	},

	async deleteUser(id: number): Promise<ServeResponse> {

		try {

			await prisma.usuario.update({
				where: {
					ID: id
				},
				data: {
					Active: false
				}
			})

			return {
				success: true,
				message: "Usuario inactivo",
			};

		} catch (error) {
			// loggear el error en grafana o prometheus o algo asi
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					return {
						success: false,
						message: "Error al inactivar usuario",
						error: "Error al inactivar usuario"
					}
				}

			}
			throw error;
		}
	},

	async getUser(id: number): Promise<ServeResponse> {
		try {
			const user = await prisma.usuario.findUnique({
				where: {
					ID: id
				}
			})
			if (!user) return {
				success: false,
				message: "Usuario no encontrado",
				error: "Usuario no encontrado"
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
						message: "Error al obtener usuario",
						error: "Error al obtener usuario"
					}
				}

			}
			throw error;
		}

	},

	async getUsers(search?: string, activo?: boolean, page = 1, limit = 10): Promise<ServeResponse> {
		try {
			const skip = (page - 1) * limit;
			// validamos que queremos buscar :V
			const where: any = {};
			if (search) {
				where.OR = [
					{ Nombre: { contains: search } },
					{ Apellido: { contains: search } },
					{ Cedula: { contains: search } },
					{ Email: { contains: search } },
				]
			}
			console.log("activo: ", activo)
			if (activo !== undefined) where.Active = activo


			const [users, total] = await Promise.all([prisma.usuario.findMany({
				where: where,
				skip: skip,
				take: limit,
				orderBy: { Nombre: 'asc' }
			}),
			prisma.usuario.count({ where })
			]);
			return {
				success: true,
				message: "OK",
				data: {
					users,
					pagination: {
						page,
						limit,
						total,
						pages: Math.ceil(total / limit)
					}
				},
			};
		} catch (error) {
			// loggear el error en grafana o prometheus o algo asi
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					return {
						success: false,
						message: "Error al obtener usuarios",
						error: "Error al obtener usuarios"
					}
				}
			}
			throw error;

		}
	},


}
