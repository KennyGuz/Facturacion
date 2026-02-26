import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../utils/prisma.js";
import { ServeResponse } from "../types/response.js";
import { z } from 'zod'
import { JwtPayload } from "src/types/jwt.js";

const PlatilloOrdenSchema = z.object({
	idPlatillo: z.number()
		.min(1, 'ID del platillo es requerido'),
	cantidad: z.number()
		.int()
		.min(1, 'La cantidad debe ser mayor a 0')
})

export const OrdenSchema = z.object({
	idMesa: z.number()
		.min(1, 'ID de la mesa es requerido'),
	total: z.number()
		.min(0, 'El total debe ser mayor o igual a 0'),
	estado: z.string()
		.min(1, 'El estado es requerido')
		.max(50, 'El estado no puede superar los 50 caracteres'),
	platillos: z.array(PlatilloOrdenSchema)
		.min(1, 'Debe tener al menos un platillo')
})

export type OrdenData = z.infer<typeof OrdenSchema>

export const ordenService = {

	async createOrden(data: OrdenData, currentUser: JwtPayload): Promise<ServeResponse> {
		try {
			const validationResult = OrdenSchema.safeParse(data);

			if (!validationResult.success) {
				return {
					success: false,
					message: "Datos invalidos",
					errors: validationResult.error.flatten().fieldErrors
				};
			}

			const validatedData = validationResult.data

			const existingMesa = await prisma.mesa.findUnique({
				where: { ID: validatedData.idMesa, Active: true }
			})

			if (!existingMesa) {
				return {
					success: false,
					message: "La mesa no existe o está inactiva",
					error: "Error al crear orden"
				}
			}

			const existingPlatillos = await prisma.platillo.findMany({
				where: {
					ID: { in: validatedData.platillos.map(p => p.idPlatillo) },
					Active: true
				}
			})

			if (existingPlatillos.length !== validatedData.platillos.length) {
				return {
					success: false,
					message: "Uno o más platillos no existen o están inactivos",
					error: "Error al crear orden"
				}
			}

			const orden = await prisma.orden.create({
				data: {
					IDMesa: validatedData.idMesa,
					IDUsuario: Number(currentUser.userid),
					Total: validatedData.total,
					Estado: validatedData.estado,
					OrdenPlatillos: {
						create: validatedData.platillos.map(plat => ({
							IDPlatillo: plat.idPlatillo,
							Cantidad: plat.cantidad
						}))
					}
				},
				include: {
					OrdenPlatillos: {
						include: {
							Platillo: true
						}
					}
				}
			})

			const result = {
				...orden,
				IDMesa: orden.IDMesa,
				OrdenPlatillos: orden.OrdenPlatillos.map(op => ({
					IDPlatillo: op.Platillo.ID,
					Nombre: op.Platillo.Nombre,
					Precio: op.Platillo.Precio,
					Cantidad: op.Cantidad
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
				if (error.code === 'P2002') {
					return {
						success: false,
						message: "Error al crear orden",
						error: "Error al crear orden"
					}
				}
				if (error.code === 'P2003') {
					return {
						success: false,
						message: "La mesa o usuario no existe",
						error: "Error al crear orden"
					}
				}
			}
			throw error;
		}
	},

	async updateOrden(id: number, data: Partial<OrdenData>): Promise<ServeResponse> {
		try {
			const ordenSchemaPartial = OrdenSchema.partial();
			const validationResult = ordenSchemaPartial.safeParse(data);

			if (!validationResult.success) {
				return {
					success: false,
					message: "Datos invalidos",
					errors: validationResult.error.flatten().fieldErrors
				};
			}

			const validatedData = validationResult.data

			const existingOrden = await prisma.orden.findUnique({
				where: { ID: id, Active: true }
			})

			if (!existingOrden) {
				return {
					success: false,
					message: "Orden no encontrada",
					error: "Error al actualizar orden"
				}
			}

			const updateData: Record<string, unknown> = {}

			if (validatedData.idMesa !== undefined) {
				const existingMesa = await prisma.mesa.findUnique({
					where: { ID: validatedData.idMesa, Active: true }
				})
				if (!existingMesa) {
					return {
						success: false,
						message: "La mesa no existe o está inactiva",
						error: "Error al actualizar orden"
					}
				}
				updateData.IDMesa = validatedData.idMesa
			}

			if (validatedData.total !== undefined)
				updateData.Total = validatedData.total
			if (validatedData.estado !== undefined)
				updateData.Estado = validatedData.estado

			if (validatedData.platillos) {
				const existingPlatillos = await prisma.platillo.findMany({
					where: {
						ID: { in: validatedData.platillos.map(p => p.idPlatillo) },
						Active: true
					}
				})

				if (existingPlatillos.length !== validatedData.platillos.length) {
					return {
						success: false,
						message: "Uno o más platillos no existen o están inactivos",
						error: "Error al actualizar orden"
					}
				}

				await prisma.ordenPlatillo.deleteMany({
					where: { IDOrden: id }
				})

				updateData.OrdenPlatillos = {
					create: validatedData.platillos.map(plat => ({
						IDPlatillo: plat.idPlatillo,
						Cantidad: plat.cantidad
					}))
				}
			}

			const orden = await prisma.orden.update({
				where: { ID: id },
				data: updateData,
				include: {
					OrdenPlatillos: {
						include: {
							Platillo: true
						}
					}
				}
			})

			const result = {
				...orden,
				IDMesa: orden.IDMesa,
				OrdenPlatillos: orden.OrdenPlatillos.map(op => ({
					IDPlatillo: op.Platillo.ID,
					Nombre: op.Platillo.Nombre,
					Precio: op.Platillo.Precio,
					Cantidad: op.Cantidad
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
						message: "Orden no encontrada",
						error: "Error al actualizar orden"
					}
				}
			}
			throw error;
		}
	},

	async deleteOrden(id: number): Promise<ServeResponse> {
		try {
			const existingOrden = await prisma.orden.findUnique({
				where: { ID: id }
			})

			if (!existingOrden) {
				return {
					success: false,
					message: "Orden no encontrada",
					error: "Error al inactivar orden"
				}
			}

			await prisma.orden.update({
				where: { ID: id },
				data: { Active: false }
			})

			return {
				success: true,
				message: "Orden inactiva",
			};
		} catch (error) {
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					return {
						success: false,
						message: "Orden no encontrada",
						error: "Error al inactivar orden"
					}
				}
			}
			throw error;
		}
	},

	async getOrden(id: number): Promise<ServeResponse> {
		try {
			const orden = await prisma.orden.findUnique({
				where: {
					ID: id,
					Active: true
				},
				include: {
					Mesa: {
						select: { NumeroMesa: true }
					},
					OrdenPlatillos: {
						include: {
							Platillo: {
								select: { ID: true, Nombre: true, Precio: true }
							}
						}
					}
				}
			})

			if (!orden) return {
				success: false,
				message: "Orden no encontrada",
				error: "Orden no encontrada"
			};

			const result = {
				ID: orden.ID,
				IDMesa: orden.IDMesa,
				NumeroMesa: orden.Mesa.NumeroMesa,
				Total: orden.Total,
				Estado: orden.Estado,
				FechaHora: orden.FechaHora,
				Platillos: orden.OrdenPlatillos.map(op => ({
					IDPlatillo: op.Platillo.ID,
					Nombre: op.Platillo.Nombre,
					Precio: op.Platillo.Precio,
					Cantidad: op.Cantidad
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
						message: "Orden no encontrada",
						error: "Error al obtener orden"
					}
				}
			}
			throw error;
		}
	},

	async getOrdenes(search?: string, activo?: boolean, page = 1, limit = 10): Promise<ServeResponse> {
		try {
			const skip = (page - 1) * limit;

			const where: any = {};
			if (search) {
				where.OR = [
					{ Estado: { contains: search } },
				]
			}
			if (activo !== undefined) where.Active = activo

			const [ordenes, total] = await Promise.all([
				prisma.orden.findMany({
					where: where,
					skip: skip,
					take: limit,
					orderBy: { FechaHora: 'desc' },
					include: {
						Mesa: {
							select: { NumeroMesa: true }
						},
						OrdenPlatillos: {
							include: {
								Platillo: {
									select: { ID: true, Nombre: true, Precio: true }
								}
							}
						}
					}
				}),
				prisma.orden.count({ where })
			]);

			const result = ordenes.map(orden => ({
				ID: orden.ID,
				IDMesa: orden.IDMesa,
				NumeroMesa: orden.Mesa.NumeroMesa,
				Total: orden.Total,
				Estado: orden.Estado,
				FechaHora: orden.FechaHora,
				Platillos: orden.OrdenPlatillos.map(op => ({
					IDPlatillo: op.Platillo.ID,
					Nombre: op.Platillo.Nombre,
					Precio: op.Platillo.Precio,
					Cantidad: op.Cantidad
				}))
			}))

			return {
				success: true,
				message: "OK",
				data: {
					ordenes: result,
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
						message: "Error al obtener ordenes",
						error: "Error al obtener ordenes"
					}
				}
			}
			throw error;
		}
	},
}
