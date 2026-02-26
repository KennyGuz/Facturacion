import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../utils/prisma.js";
import { ServeResponse } from "../types/response.js";
import { z } from 'zod'

const IngredientePlatilloSchema = z.object({
	idIngrediente: z.number()
		.min(1, 'ID del ingrediente es requerido'),
	cantidadKilos: z.number()
		.min(0.001, 'La cantidad de kilos debe ser mayor a 0')
})

export const PlatilloSchema = z.object({
	nombre: z.string()
		.min(1, 'Nombre del platillo es requerido')
		.max(100, 'El nombre del platillo no puede superar los 100 caracteres'),
	precio: z.number()
		.min(0.01, 'El precio debe ser mayor a 0'),
	ingredientes: z.array(IngredientePlatilloSchema)
		.min(1, 'Debe tener al menos un ingrediente')
})

export type PlatilloData = z.infer<typeof PlatilloSchema>

export const platilloService = {

	async createPlatillo(data: PlatilloData): Promise<ServeResponse> {
		try {
			const validationResult = PlatilloSchema.safeParse(data);

			if (!validationResult.success) {
				return {
					success: false,
					message: "Datos invalidos",
					errors: validationResult.error.flatten().fieldErrors
				};
			}

			const validatedData = validationResult.data

			const existingIngredients = await prisma.ingrediente.findMany({
				where: {
					ID: { in: validatedData.ingredientes.map(i => i.idIngrediente) },
					Active: true
				}
			})

			if (existingIngredients.length !== validatedData.ingredientes.length) {
				return {
					success: false,
					message: "Uno o más ingredientes no existen o están inactivos",
					error: "Error al crear platillo"
				}
			}

			const platillo = await prisma.platillo.create({
				data: {
					Nombre: validatedData.nombre,
					Precio: validatedData.precio,
					PlatilloIngredientes: {
						create: validatedData.ingredientes.map(ing => ({
							IDIngrediente: ing.idIngrediente,
							CantidadKilosIngrediente: ing.cantidadKilos
						}))
					}
				},
				include: {
					PlatilloIngredientes: {
						include: {
							Ingrediente: true
						}
					}
				}
			})

			return {
				success: true,
				message: "OK",
				data: platillo
			};
		} catch (error) {
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					return {
						success: false,
						message: "Ya existe un platillo con ese nombre",
						error: "Error al crear platillo"
					}
				}
			}
			throw error;
		}
	},

	async updatePlatillo(id: number, data: Partial<PlatilloData>): Promise<ServeResponse> {
		try {
			const platilloSchemaPartial = PlatilloSchema.partial();
			const validationResult = platilloSchemaPartial.safeParse(data);

			if (!validationResult.success) {
				return {
					success: false,
					message: "Datos invalidos",
					errors: validationResult.error.flatten().fieldErrors
				};
			}

			const validatedData = validationResult.data

			const existingPlatillo = await prisma.platillo.findUnique({
				where: { ID: id }
			})

			if (!existingPlatillo) {
				return {
					success: false,
					message: "Platillo no encontrado",
					error: "Error al actualizar platillo"
				}
			}

			if (validatedData.ingredientes) {
				const existingIngredients = await prisma.ingrediente.findMany({
					where: {
						ID: { in: validatedData.ingredientes.map(i => i.idIngrediente) },
						Active: true
					}
				})

				if (existingIngredients.length !== validatedData.ingredientes.length) {
					return {
						success: false,
						message: "Uno o más ingredientes no existen o están inactivos",
						error: "Error al actualizar platillo"
					}
				}
			}

			const updateData: Record<string, unknown> = {}
			if (validatedData.nombre !== undefined)
				updateData.Nombre = validatedData.nombre
			if (validatedData.precio !== undefined)
				updateData.Precio = validatedData.precio

			if (validatedData.ingredientes) {
				await prisma.platilloIngrediente.deleteMany({
					where: { IDPlatillo: id }
				})

				updateData.PlatilloIngredientes = {
					create: validatedData.ingredientes.map(ing => ({
						IDIngrediente: ing.idIngrediente,
						CantidadKilosIngrediente: ing.cantidadKilos
					}))
				}
			}

			const platillo = await prisma.platillo.update({
				where: { ID: id },
				data: updateData,
				include: {
					PlatilloIngredientes: {
						include: {
							Ingrediente: true
						}
					}
				}
			})

			return {
				success: true,
				message: "OK",
				data: platillo
			};
		} catch (error) {
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					return {
						success: false,
						message: "Ya existe un platillo con ese nombre",
						error: "Error al actualizar platillo"
					}
				}
				if (error.code === 'P2025') {
					return {
						success: false,
						message: "Platillo no encontrado",
						error: "Error al actualizar platillo"
					}
				}
			}
			throw error;
		}
	},

	async deletePlatillo(id: number): Promise<ServeResponse> {
		try {
			const existingPlatillo = await prisma.platillo.findUnique({
				where: { ID: id }
			})

			if (!existingPlatillo) {
				return {
					success: false,
					message: "Platillo no encontrado",
					error: "Error al inactivar platillo"
				}
			}

			await prisma.platillo.update({
				where: { ID: id },
				data: { Active: false }
			})

			return {
				success: true,
				message: "Platillo inactivo",
			};
		} catch (error) {
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					return {
						success: false,
						message: "Platillo no encontrado",
						error: "Error al inactivar platillo"
					}
				}
			}
			throw error;
		}
	},

	async getPlatillo(id: number): Promise<ServeResponse> {
		try {
			const platillo = await prisma.platillo.findUnique({
				where: { ID: id},
				include: {
					PlatilloIngredientes: {
						select: {
							CantidadKilosIngrediente: true,
							Ingrediente: {
								select: { ID: true, Nombre: true }
							}
						}
					}
				}
			})

			if (!platillo) return {
				success: false,
				message: "Platillo no encontrado",
				error: "Platillo no encontrado"
			};

			const result = {
				...platillo,
				PlatilloIngredientes: platillo.PlatilloIngredientes.map(pi => ({
					ID: pi.Ingrediente.ID,
					Nombre: pi.Ingrediente.Nombre,
					Cantidad: pi.CantidadKilosIngrediente
				}))
			}
			return {
				success: true,
				message: "OK",
				data: result
			};
		} catch (error) {
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					return {
						success: false,
						message: "Platillo no encontrado",
						error: "Error al obtener platillo"
					}
				}
			}
			throw error;
		}
	},

	async getPlatillos(search?: string, activo?: boolean, page = 1, limit = 10): Promise<ServeResponse> {
		try {
			const skip = (page - 1) * limit;

			const where: any = {};
			if (search) {
				where.OR = [
					{ Nombre: { contains: search } },
				]
			}
			if (activo !== undefined) where.Active = activo

			const [platillos, total] = await Promise.all([
				prisma.platillo.findMany({
					where: where,
					skip: skip,
					take: limit,
					orderBy: { Nombre: 'asc' },
					include: {
						PlatilloIngredientes: {
							select: {
								CantidadKilosIngrediente: true,
								Ingrediente: {
									select: { Nombre: true }
								}
							}
						}
					}
				}),
				prisma.platillo.count({ where })
			]);

			const result = platillos.map(p => ({
				...p,
				PlatilloIngredientes: p.PlatilloIngredientes.map(pi => ({
					Nombre: pi.Ingrediente.Nombre,
					Cantidad: pi.CantidadKilosIngrediente
				}))
			}))

			return {
				success: true,
				message: "OK",
				data: {
					result,
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
						message: "Error al obtener platillos",
						error: "Error al obtener platillos"
					}
				}
			}
			throw error;
		}
	},
}
