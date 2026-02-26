import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../utils/prisma.js";
import { ServeResponse } from "../types/response.js";
import { z } from 'zod'

export const rolesSchema = z.object({
	nombre: z.string()
		.min(1, 'Nombre del rol es requerido')
		.max(50, 'El nombre del rol no puede supoerar los 50 caracteres'),

})
export type rolesData = z.infer<typeof rolesSchema>

export const rolesService = {

	async createRole(data: rolesData): Promise<ServeResponse> {
		try {
			const validationResult = rolesSchema.safeParse(data);

			if (!validationResult.success) {
				return {
					success: false,
					message: "Datos invalidos",
					errors: validationResult.error.flatten().fieldErrors
				};
			}

			const validatedData = validationResult.data

			const rol = await prisma.role.create({
				data: {
					Name: validatedData.nombre,
				}
			})

			return {
				success: true,
				message: "OK",
				data: rol
			};
		} catch (error) {
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					return {
						success: false,
						message: "Ya existe un rol con ese nombre",
						error: "Error al crear rol"
					}
				}
			}
			throw error;
		}
	},

	async updateRole(id: number, data: Partial<rolesData>): Promise<ServeResponse> {
		try {
			const roleSchemaPartial = rolesSchema.partial();
			const validationResult = roleSchemaPartial.safeParse(data);

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
				updateData.Name = validatedData.nombre


			const rol = await prisma.role.update({
				where: {
					ID: id
				},
				data: updateData,
			})

			return {
				success: true,
				message: "OK",
				data: rol
			};
		} catch (error) {
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					return {
						success: false,
						message: "Ya existe un rol con ese nombre",
						error: "Error al actualizar rol"
					}
				}
				if (error.code === 'P2025') {
					return {
						success: false,
						message: "rol no encontrado",
						error: "Error al actualizar rol"
					}
				}
			}
			throw error;
		}
	},

	async deleteRole(id: number): Promise<ServeResponse> {
		try {
			await prisma.role.update({
				where: {
					ID: id
				},
				data: {
					Active: false
				}
			})

			return {
				success: true,
				message: "Rol inactivo",
			};
		} catch (error) {
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					return {
						success: false,
						message: "rol no encontrado",
						error: "Error al inactivar rol"
					}
				}
			}
			throw error;
		}
	},

	async getRole(id: number): Promise<ServeResponse> {
		try {
			const rol = await prisma.role.findUnique({
				where: {
					ID: id,
				},
			})

			if (!rol) return {
				success: false,
				message: "rol no encontrado",
				error: "rol no encontrado"
			};

			return {
				success: true,
				message: "OK",
				data: rol
			};
		} catch (error) {
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					return {
						success: false,
						message: "rol no encontrado",
						error: "Error al obtener rol"
					}
				}
			}
			throw error;
		}
	},

	async getRoles(search?: string, activo?: boolean, page = 1, limit = 10): Promise<ServeResponse> {
		try {
			const skip = (page - 1) * limit;

			const where: any = {};
			if (search) {
				where.OR = [
					{ Nombre: { contains: search } },
				]
			}
			if (activo !== undefined) where.Active = activo

			const [roles, total] = await Promise.all([
				prisma.role.findMany({
					where: where,
					skip: skip,
					take: limit,
					orderBy: { Name: 'asc' }
				}),
				prisma.role.count({ where })
			]);

			return {
				success: true,
				message: "OK",
				data: {
					roles,
					pagination: {
						page,
						limit,
						total,
						pages: Math.ceil(total / limit)
					}
				},
			};
		} catch (error) {
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					return {
						success: false,
						message: "Error al obtener los roles",
						error: "Error al obtener los roles"
					}
				}
			}
			throw error;
		}
	},
}
