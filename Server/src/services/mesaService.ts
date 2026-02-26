import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../utils/prisma.js";
import { ServeResponse } from "../types/response.js";
import { z } from 'zod'

export const MesaSchema = z.object({
	numeroMesa: z.number()
		.min(1, 'El número de mesa es requerido'),
	estaOcupada: z.boolean()
		.default(false),
})
export type MesaData = z.infer<typeof MesaSchema>

export const mesaService = {

	async createMesa(data: MesaData): Promise<ServeResponse> {
		try {
			const validationResult = MesaSchema.safeParse(data);

			if (!validationResult.success) {
				return {
					success: false,
					message: "Datos invalidos",
					errors: validationResult.error.flatten().fieldErrors as Record<string, string[]>
				};
			}

			const validatedData = validationResult.data

			const mesa = await prisma.mesa.create({
				data: {
					NumeroMesa: validatedData.numeroMesa,
					EstaOcupada: validatedData.estaOcupada,
				}
			})

			return {
				success: true,
				message: "OK",
				data: mesa
			};
		} catch (error) {
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					return {
						success: false,
						message: "Ya existe una mesa con ese número",
						error: "Error al crear mesa"
					}
				}
			}
			throw error;
		}
	},

	async updateMesa(id: number, data: Partial<MesaData>): Promise<ServeResponse> {
		try {
			const mesaSchemaPartial = MesaSchema.partial();
			const validationResult = mesaSchemaPartial.safeParse(data);

			if (!validationResult.success) {
				return {
					success: false,
					message: "Datos invalidos",
					errors: validationResult.error.flatten().fieldErrors as Record<string, string[]>
				};
			}

			const validatedData = validationResult.data
			const updateData: Record<string, unknown> = {}

			if (validatedData.numeroMesa !== undefined)
				updateData.NumeroMesa = validatedData.numeroMesa
			if (validatedData.estaOcupada !== undefined)
				updateData.EstaOcupada = validatedData.estaOcupada

			const mesa = await prisma.mesa.update({
				where: {
					ID: id
				},
				data: updateData,
			})

			return {
				success: true,
				message: "OK",
				data: mesa
			};
		} catch (error) {
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					return {
						success: false,
						message: "Ya existe una mesa con ese número",
						error: "Error al actualizar mesa"
					}
				}
				if (error.code === 'P2025') {
					return {
						success: false,
						message: "Mesa no encontrada",
						error: "Error al actualizar mesa"
					}
				}
			}
			throw error;
		}
	},

	async deleteMesa(id: number): Promise<ServeResponse> {
		try {
			await prisma.mesa.update({
				where: {
					ID: id
				},
				data: {
					Active: false
				}
			})

			return {
				success: true,
				message: "Mesa inactiva",
			};
		} catch (error) {
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					return {
						success: false,
						message: "Mesa no encontrada",
						error: "Error al inactivar mesa"
					}
				}
			}
			throw error;
		}
	},

	async getMesa(id: number): Promise<ServeResponse> {
		try {
			const mesa = await prisma.mesa.findUnique({
				where: {
					ID: id,
					Active: true
				},
			})

			if (!mesa) return {
				success: false,
				message: "Mesa no encontrada",
				error: "Mesa no encontrada"
			};

			return {
				success: true,
				message: "OK",
				data: mesa
			};
		} catch (error) {
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					return {
						success: false,
						message: "Mesa no encontrada",
						error: "Error al obtener mesa"
					}
				}
			}
			throw error;
		}
	},

	async getMesas(search?: string, activo?: boolean, page = 1, limit = 10): Promise<ServeResponse> {
		try {
			const skip = (page - 1) * limit;

			const where: any = {};
			if (search) {
				where.OR = [
					{ NumeroMesa: { equals: Number(search) } },
				]
			}
			if (activo !== undefined) where.Active = activo

			const [mesas, total] = await Promise.all([
				prisma.mesa.findMany({
					where: where,
					skip: skip,
					take: limit,
					orderBy: { NumeroMesa: 'asc' }
				}),
				prisma.mesa.count({ where })
			]);

			return {
				success: true,
				message: "OK",
				data: {
					mesas,
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
						message: "Error al obtener mesas",
						error: "Error al obtener mesas"
					}
				}
			}
			throw error;
		}
	},
}
