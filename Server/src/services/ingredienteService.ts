import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../utils/prisma.js";
import { ServeResponse } from "../types/response.js";
import { z } from 'zod'

export const IngredienteSchema = z.object({
	nombre: z.string()
		.min(1, 'Nombre del ingrediente es requerido')
		.max(100, 'El nombre del ingrediente no puede superar los 100 caracteres'),
	cantidadKilos: z.number()
		.min(0, 'La cantidad de kilos debe ser mayor o igual a 0')
		.default(0),
})
export type IngredienteData = z.infer<typeof IngredienteSchema>

export const ingredienteService = {

	async createIngrediente(data: IngredienteData): Promise<ServeResponse> {
		try {
			const validationResult = IngredienteSchema.safeParse(data);

			if (!validationResult.success) {
				return {
					success: false,
					message: "Datos invalidos",
					errors: validationResult.error.flatten().fieldErrors
				};
			}

			const validatedData = validationResult.data

			const ingrediente = await prisma.ingrediente.create({
				data: {
					Nombre: validatedData.nombre,
					CantidadKilos: validatedData.cantidadKilos,
				}
			})

			return {
				success: true,
				message: "OK",
				data: ingrediente
			};
		} catch (error) {
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					return {
						success: false,
						message: "Ya existe un ingrediente con ese nombre",
						error: "Error al crear ingrediente"
					}
				}
			}
			throw error;
		}
	},

	async updateIngrediente(id: number, data: Partial<IngredienteData>): Promise<ServeResponse> {
		try {
			const ingredienteSchemaPartial = IngredienteSchema.partial();
			const validationResult = ingredienteSchemaPartial.safeParse(data);

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
			if (validatedData.cantidadKilos !== undefined)
				updateData.CantidadKilos = validatedData.cantidadKilos

			const ingrediente = await prisma.ingrediente.update({
				where: {
					ID: id
				},
				data: updateData,
			})

			return {
				success: true,
				message: "OK",
				data: ingrediente
			};
		} catch (error) {
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					return {
						success: false,
						message: "Ya existe un ingrediente con ese nombre",
						error: "Error al actualizar ingrediente"
					}
				}
				if (error.code === 'P2025') {
					return {
						success: false,
						message: "Ingrediente no encontrado",
						error: "Error al actualizar ingrediente"
					}
				}
			}
			throw error;
		}
	},

	async deleteIngrediente(id: number): Promise<ServeResponse> {
		try {
			await prisma.ingrediente.update({
				where: {
					ID: id
				},
				data: {
					Active: false
				}
			})

			return {
				success: true,
				message: "Ingrediente inactivo",
			};
		} catch (error) {
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					return {
						success: false,
						message: "Ingrediente no encontrado",
						error: "Error al inactivar ingrediente"
					}
				}
			}
			throw error;
		}
	},

	async getIngrediente(id: number): Promise<ServeResponse> {
		try {
			const ingrediente = await prisma.ingrediente.findUnique({
				where: {
					ID: id,
				},
			})

			if (!ingrediente) return {
				success: false,
				message: "Ingrediente no encontrado",
				error: "Ingrediente no encontrado"
			};

			return {
				success: true,
				message: "OK",
				data: ingrediente
			};
		} catch (error) {
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					return {
						success: false,
						message: "Ingrediente no encontrado",
						error: "Error al obtener ingrediente"
					}
				}
			}
			throw error;
		}
	},

	async getIngredientes(search?: string, activo?: boolean, page = 1, limit = 10): Promise<ServeResponse> {
		try {
			const skip = (page - 1) * limit;

			const where: any = {};
			if (search) {
				where.OR = [
					{ Nombre: { contains: search } },
				]
			}
			if (activo !== undefined) where.Active = activo

			const [ingredientes, total] = await Promise.all([
				prisma.ingrediente.findMany({
					where: where,
					skip: skip,
					take: limit,
					orderBy: { Nombre: 'asc' }
				}),
				prisma.ingrediente.count({ where })
			]);

			return {
				success: true,
				message: "OK",
				data: {
					ingredientes,
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
						message: "Error al obtener ingredientes",
						error: "Error al obtener ingredientes"
					}
				}
			}
			throw error;
		}
	},
}
