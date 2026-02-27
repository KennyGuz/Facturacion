import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../utils/prisma.js";
import { ServeResponse } from "../types/response.js";
import { z } from 'zod'

export const permisoSchema = z.object({
	nombre: z.string()
		.min(1, 'Nombre del permiso es requerido')
		.max(50, 'El nombre del permiso no puede supoerar los 50 caracteres'),

})
export type permisoData = z.infer<typeof permisoSchema>

export const permisoService = {

	async createPermiso(data: permisoData): Promise<ServeResponse> {
		try {
			const validationResult = permisoSchema.safeParse(data);

			if (!validationResult.success) {
				return {
					success: false,
					message: "Datos invalidos",
					errors: validationResult.error.flatten().fieldErrors
				};
			}

			const validatedData = validationResult.data

			const permiso = await prisma.permisos.create({
				data: {
					Name: validatedData.nombre,
				}
			})

			return {
				success: true,
				message: "OK",
				data: permiso
			};
		} catch (error) {
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					return {
						success: false,
						message: "Ya existe un permiso con ese nombre",
						error: "Error al crear permiso"
					}
				}
			}
			throw error;
		}
	},

	async updatePermiso(id: number, data: Partial<permisoData>): Promise<ServeResponse> {
		try {
			const roleSchemaPartial = permisoSchema.partial();
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


			const permiso = await prisma.permisos.update({
				where: {
					ID: id
				},
				data: updateData,
			})

			return {
				success: true,
				message: "OK",
				data: permiso
			};
		} catch (error) {
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					return {
						success: false,
						message: "Ya existe un permiso con ese nombre",
						error: "Error al actualizar permiso"
					}
				}
				if (error.code === 'P2025') {
					return {
						success: false,
						message: "permiso no encontrado",
						error: "Error al actualizar permiso"
					}
				}
			}
			throw error;
		}
	},

	async inactivarPermiso(id: number): Promise<ServeResponse> {
		try {

			const permiso = await prisma.permisos.findUnique({
				where: {
					ID: id,
				},
			})

			if (!permiso) return {
				success: false,
				message: "Permiso no encontrado",
				error: "Permiso no encontrado"
			};

			await prisma.permisos.update({
				where: {
					ID: id
				},
				data: {
					Active: !permiso.Active
				}
			})

			return {
				success: true,
				message: "Permiso modificado",
			};
		} catch (error) {
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					return {
						success: false,
						message: "permiso no encontrado",
						error: "Error al inactivar permiso"
					}
				}
			}
			throw error;
		}
	},

	async getPermiso(id: number): Promise<ServeResponse> {
		try {
			const permiso = await prisma.permisos.findUnique({
				where: {
					ID: id,
				},
			})

			if (!permiso) return {
				success: false,
				message: "permiso no encontrado",
				error: "permiso no encontrado"
			};

			return {
				success: true,
				message: "OK",
				data: permiso
			};
		} catch (error) {
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					return {
						success: false,
						message: "permiso no encontrado",
						error: "Error al obtener permiso"
					}
				}
			}
			throw error;
		}
	},

	async getPermisos(search?: string, activo?: boolean, page = 1, limit = 10): Promise<ServeResponse> {
		try {
			const skip = (page - 1) * limit;

			const where: any = {};
			if (search) {
				where.OR = [
					{ Nombre: { contains: search } },
				]
			}
			if (activo !== undefined) where.Active = activo

			const [permisos, total] = await Promise.all([
				prisma.permisos.findMany({
					where: where,
					skip: skip,
					take: limit,
					orderBy: { Name: 'asc' }
				}),
				prisma.permisos.count({ where })
			]);

			return {
				success: true,
				message: "OK",
				data: {
					permisos,
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
						message: "Error al obtener los permisos",
						error: "Error al obtener los permisos"
					}
				}
			}
			throw error;
		}
	},
}
