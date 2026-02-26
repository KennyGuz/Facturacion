import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../utils/prisma.js";
import { ServeResponse } from "../types/response.js";
import { z } from 'zod'

export const FacturaSchema = z.object({
	idOrden: z.number()
		.min(1, 'ID de la orden es requerido'),
	totalBruto: z.number()
		.min(0, 'El total bruto debe ser mayor o igual a 0'),
	impuestos: z.number()
		.min(0, 'Los impuestos deben ser mayor o igual a 0'),
	total: z.number()
		.min(0, 'El total debe ser mayor o igual a 0'),
})

export type FacturaData = z.infer<typeof FacturaSchema>

export const facturaService = {

	async createFactura(data: FacturaData): Promise<ServeResponse> {
		try {
			const validationResult = FacturaSchema.safeParse(data);

			if (!validationResult.success) {
				return {
					success: false,
					message: "Datos invalidos",
					errors: validationResult.error.flatten().fieldErrors as Record<string, string[]>
				};
			}

			const validatedData = validationResult.data

			const existingOrden = await prisma.orden.findUnique({
				where: { ID: validatedData.idOrden, Active: true }
			})

			if (!existingOrden) {
				return {
					success: false,
					message: "La orden no existe o está inactiva",
					error: "Error al crear factura"
				}
			}

			const existingFactura = await prisma.factura.findUnique({
				where: { IDOrden: validatedData.idOrden }
			})

			if (existingFactura) {
				return {
					success: false,
					message: "Ya existe una factura para esta orden",
					error: "Error al crear factura"
				}
			}

			const factura = await prisma.factura.create({
				data: {
					IDOrden: validatedData.idOrden,
					TotalBruto: validatedData.totalBruto,
					Impuestos: validatedData.impuestos,
					Total: validatedData.total,
				}
			})

			return {
				success: true,
				message: "OK",
				data: {
					ID: factura.ID,
					IDOrden: factura.IDOrden,
					TotalBruto: factura.TotalBruto,
					Impuestos: factura.Impuestos,
					Total: factura.Total,
					CreatedAt: factura.CreatedAt
				}
			};
		} catch (error) {
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					return {
						success: false,
						message: "Ya existe una factura para esta orden",
						error: "Error al crear factura"
					}
				}
				if (error.code === 'P2003') {
					return {
						success: false,
						message: "La orden no existe",
						error: "Error al crear factura"
					}
				}
			}
			throw error;
		}
	},

	async updateFactura(id: number, data: Partial<FacturaData>): Promise<ServeResponse> {
		try {
			const facturaSchemaPartial = FacturaSchema.partial();
			const validationResult = facturaSchemaPartial.safeParse(data);

			if (!validationResult.success) {
				return {
					success: false,
					message: "Datos invalidos",
					errors: validationResult.error.flatten().fieldErrors as Record<string, string[]>
				};
			}

			const validatedData = validationResult.data

			const existingFactura = await prisma.factura.findUnique({
				where: { ID: id, Active: true }
			})

			if (!existingFactura) {
				return {
					success: false,
					message: "Factura no encontrada",
					error: "Error al actualizar factura"
				}
			}

			const updateData: Record<string, unknown> = {}

			if (validatedData.totalBruto !== undefined)
				updateData.TotalBruto = validatedData.totalBruto
			if (validatedData.impuestos !== undefined)
				updateData.Impuestos = validatedData.impuestos
			if (validatedData.total !== undefined)
				updateData.Total = validatedData.total

			const factura = await prisma.factura.update({
				where: { ID: id },
				data: updateData
			})

			return {
				success: true,
				message: "OK",
				data: {
					ID: factura.ID,
					IDOrden: factura.IDOrden,
					TotalBruto: factura.TotalBruto,
					Impuestos: factura.Impuestos,
					Total: factura.Total,
					CreatedAt: factura.CreatedAt
				}
			};
		} catch (error) {
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					return {
						success: false,
						message: "Factura no encontrada",
						error: "Error al actualizar factura"
					}
				}
			}
			throw error;
		}
	},

	async deleteFactura(id: number): Promise<ServeResponse> {
		try {
			const existingFactura = await prisma.factura.findUnique({
				where: { ID: id }
			})

			if (!existingFactura) {
				return {
					success: false,
					message: "Factura no encontrada",
					error: "Error al inactivar factura"
				}
			}

			await prisma.factura.update({
				where: { ID: id },
				data: { Active: false }
			})

			return {
				success: true,
				message: "Factura inactiva",
			};
		} catch (error) {
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					return {
						success: false,
						message: "Factura no encontrada",
						error: "Error al inactivar factura"
					}
				}
			}
			throw error;
		}
	},

	async getFactura(id: number): Promise<ServeResponse> {
		try {
			const factura = await prisma.factura.findUnique({
				where: {
					ID: id,
					Active: true
				}
			})

			if (!factura) return {
				success: false,
				message: "Factura no encontrada",
				error: "Factura no encontrada"
			};

			const orden = await prisma.orden.findUnique({
				where: { ID: factura.IDOrden },
				select: { Total: true, Estado: true, FechaHora: true }
			})

			const result = {
				ID: factura.ID,
				IDOrden: factura.IDOrden,
				TotalOrden: orden?.Total,
				EstadoOrden: orden?.Estado,
				FechaHoraOrden: orden?.FechaHora,
				TotalBruto: factura.TotalBruto,
				Impuestos: factura.Impuestos,
				Total: factura.Total,
				CreatedAt: factura.CreatedAt
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
						message: "Factura no encontrada",
						error: "Error al obtener factura"
					}
				}
			}
			throw error;
		}
	},

	async getFacturas(search?: string, activo?: boolean, page = 1, limit = 10): Promise<ServeResponse> {
		try {
			const skip = (page - 1) * limit;

			const where: any = {};
			if (search) {
				where.OR = [
					{ IDOrden: { equals: Number(search) } },
				]
			}
			if (activo !== undefined) where.Active = activo

			const [facturas, total] = await Promise.all([
				prisma.factura.findMany({
					where: where,
					skip: skip,
					take: limit,
					orderBy: { CreatedAt: 'desc' }
				}),
				prisma.factura.count({ where })
			]);

			const ordenIds = facturas.map(f => f.IDOrden)
			const ordenes = await prisma.orden.findMany({
				where: { ID: { in: ordenIds } },
				select: { ID: true, Total: true, Estado: true, FechaHora: true }
			})
			const ordenesMap = new Map(ordenes.map(o => [o.ID, o]))

			const result = facturas.map(factura => {
				const orden = ordenesMap.get(factura.IDOrden)
				return {
					ID: factura.ID,
					IDOrden: factura.IDOrden,
					TotalOrden: orden?.Total,
					EstadoOrden: orden?.Estado,
					FechaHoraOrden: orden?.FechaHora,
					TotalBruto: factura.TotalBruto,
					Impuestos: factura.Impuestos,
					Total: factura.Total,
					CreatedAt: factura.CreatedAt
				}
			})

			return {
				success: true,
				message: "OK",
				data: {
					facturas: result,
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
						message: "Error al obtener facturas",
						error: "Error al obtener facturas"
					}
				}
			}
			throw error;
		}
	},
}
