import { Prisma } from "generated/prisma/browser";
import bcrypt from "bcrypt";
import { runtimeEnv } from "@/env";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "@/utils/prisma";
import { ServeResponse } from "@/types/response";
import { z } from 'zod'

const UserSchema = z.object({
	nombre: z.string().min(1, 'Nombre del usuario es requerido'),
	apellido: z.string().min(1, 'Apellido del usuario es requerido'),
	cedula: z.string().min(1, 'Cedula del usuario es requerido'),
	password: z.string().min(1, 'Contraseña del usuario es requerido'),
	email: z.string().min(1, 'Email del usuario es requerido'),
	rol: z.array(z.number().min(1, 'Rol del usuario es requerido')),

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
			if (validatedData.password !== undefined)
				updateData.Password = validatedData.password
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


}
