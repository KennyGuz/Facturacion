import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../utils/prisma.js";
import { ServeResponse } from "../types/response.js";
import { z } from 'zod'
import { JwtPayload } from "src/types/jwt.js";

export const ReservaSchema = z.object({
	cedulaCliente: z.string()
		.min(1, 'Cedula del cliente es requerida')
		.max(50, 'La cedula no puede superar los 50 caracteres'),
	nombreCliente: z.string()
		.min(1, 'Nombre del cliente es requerido')
		.max(100, 'El nombre no puede superar los 100 caracteres'),
	telefonoCliente: z.string()
		.min(1, 'Telefono del cliente es requerido')
		.max(20, 'El telefono no puede superar los 20 caracteres'),
	idMesa: z.number()
		.min(1, 'ID de la mesa es requerido'),
	fechaReserva: z.string()
		.min(1, 'Fecha de reserva es requerida'),
	horaReserva: z.string()
		.min(1, 'Hora de reserva es requerida')
		.max(20, 'La hora no puede superar los 20 caracteres'),
	numeroPersonas: z.number()
		.int()
		.min(1, 'El numero de personas debe ser mayor a 0'),
	nota: z.string()
		.max(255, 'La nota no puede superar los 255 caracteres')
		.optional(),
})

export type ReservaData = z.infer<typeof ReservaSchema>

export const reservaService = {

	async createReserva(data: ReservaData, currentUser: JwtPayload): Promise<ServeResponse> {
		try {
			const validationResult = ReservaSchema.safeParse(data);

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
					error: "Error al crear reserva"
				}
			}

			const reserva = await prisma.reserva.create({
				data: {
					CedulaCliente: validatedData.cedulaCliente,
					NombreCliente: validatedData.nombreCliente,
					TelefonoCliente: validatedData.telefonoCliente,
					IDMesa: validatedData.idMesa,
					IDUsuario: Number(currentUser.userid),
					FechaReserva: new Date(validatedData.fechaReserva),
					HoraReserva: validatedData.horaReserva,
					NumeroPersonas: validatedData.numeroPersonas,
					Nota: validatedData.nota || null,
				},
				include: {
					Mesa: {
						select: { NumeroMesa: true }
					},
					Usuario: {
						select: { Nombre: true, Apellido: true }
					}
				}
			})

			const result = {
				ID: reserva.ID,
				CedulaCliente: reserva.CedulaCliente,
				NombreCliente: reserva.NombreCliente,
				TelefonoCliente: reserva.TelefonoCliente,
				IDMesa: reserva.IDMesa,
				NumeroMesa: reserva.Mesa.NumeroMesa,
				IDUsuario: reserva.IDUsuario,
				NombreUsuario: `${reserva.Usuario.Nombre} ${reserva.Usuario.Apellido}`,
				FechaReserva: reserva.FechaReserva,
				HoraReserva: reserva.HoraReserva,
				NumeroPersonas: reserva.NumeroPersonas,
				Nota: reserva.Nota
			}

			return {
				success: true,
				message: "OK",
				data: result
			};
		} catch (error) {
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2003') {
					return {
						success: false,
						message: "La mesa o usuario no existe",
						error: "Error al crear reserva"
					}
				}
			}
			throw error;
		}
	},

	async updateReserva(id: number, data: Partial<ReservaData>): Promise<ServeResponse> {
		try {
			const reservaSchemaPartial = ReservaSchema.partial();
			const validationResult = reservaSchemaPartial.safeParse(data);

			if (!validationResult.success) {
				return {
					success: false,
					message: "Datos invalidos",
					errors: validationResult.error.flatten().fieldErrors
				};
			}

			const validatedData = validationResult.data

			const existingReserva = await prisma.reserva.findUnique({
				where: { ID: id, Active: true }
			})

			if (!existingReserva) {
				return {
					success: false,
					message: "Reserva no encontrada",
					error: "Error al actualizar reserva"
				}
			}

			const updateData: Record<string, unknown> = {}

			if (validatedData.cedulaCliente !== undefined)
				updateData.CedulaCliente = validatedData.cedulaCliente
			if (validatedData.nombreCliente !== undefined)
				updateData.NombreCliente = validatedData.nombreCliente
			if (validatedData.telefonoCliente !== undefined)
				updateData.TelefonoCliente = validatedData.telefonoCliente

			if (validatedData.idMesa !== undefined) {
				const existingMesa = await prisma.mesa.findUnique({
					where: { ID: validatedData.idMesa, Active: true }
				})
				if (!existingMesa) {
					return {
						success: false,
						message: "La mesa no existe o está inactiva",
						error: "Error al actualizar reserva"
					}
				}
				updateData.IDMesa = validatedData.idMesa
			}

			if (validatedData.fechaReserva !== undefined)
				updateData.FechaReserva = new Date(validatedData.fechaReserva)
			if (validatedData.horaReserva !== undefined)
				updateData.HoraReserva = validatedData.horaReserva
			if (validatedData.numeroPersonas !== undefined)
				updateData.NumeroPersonas = validatedData.numeroPersonas
			if (validatedData.nota !== undefined)
				updateData.Nota = validatedData.nota || null

			const reserva = await prisma.reserva.update({
				where: { ID: id },
				data: updateData,
				include: {
					Mesa: {
						select: { NumeroMesa: true }
					},
					Usuario: {
						select: { Nombre: true, Apellido: true }
					}
				}
			})

			const result = {
				ID: reserva.ID,
				CedulaCliente: reserva.CedulaCliente,
				NombreCliente: reserva.NombreCliente,
				TelefonoCliente: reserva.TelefonoCliente,
				IDMesa: reserva.IDMesa,
				NumeroMesa: reserva.Mesa.NumeroMesa,
				IDUsuario: reserva.IDUsuario,
				NombreUsuario: `${reserva.Usuario.Nombre} ${reserva.Usuario.Apellido}`,
				FechaReserva: reserva.FechaReserva,
				HoraReserva: reserva.HoraReserva,
				NumeroPersonas: reserva.NumeroPersonas,
				Nota: reserva.Nota
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
						message: "Reserva no encontrada",
						error: "Error al actualizar reserva"
					}
				}
			}
			throw error;
		}
	},

	async deleteReserva(id: number): Promise<ServeResponse> {
		try {
			const existingReserva = await prisma.reserva.findUnique({
				where: { ID: id }
			})

			if (!existingReserva) {
				return {
					success: false,
					message: "Reserva no encontrada",
					error: "Error al inactivar reserva"
				}
			}

			await prisma.reserva.update({
				where: { ID: id },
				data: { Active: false }
			})

			return {
				success: true,
				message: "Reserva inactiva",
			};
		} catch (error) {
			console.error(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					return {
						success: false,
						message: "Reserva no encontrada",
						error: "Error al inactivar reserva"
					}
				}
			}
			throw error;
		}
	},

	async getReserva(id: number): Promise<ServeResponse> {
		try {
			const reserva = await prisma.reserva.findUnique({
				where: {
					ID: id,
					Active: true
				},
				include: {
					Mesa: {
						select: { NumeroMesa: true }
					},
					Usuario: {
						select: { Nombre: true, Apellido: true }
					}
				}
			})

			if (!reserva) return {
				success: false,
				message: "Reserva no encontrada",
				error: "Reserva no encontrada"
			};

			const result = {
				ID: reserva.ID,
				CedulaCliente: reserva.CedulaCliente,
				NombreCliente: reserva.NombreCliente,
				TelefonoCliente: reserva.TelefonoCliente,
				IDMesa: reserva.IDMesa,
				NumeroMesa: reserva.Mesa.NumeroMesa,
				IDUsuario: reserva.IDUsuario,
				NombreUsuario: `${reserva.Usuario.Nombre} ${reserva.Usuario.Apellido}`,
				FechaReserva: reserva.FechaReserva,
				HoraReserva: reserva.HoraReserva,
				NumeroPersonas: reserva.NumeroPersonas,
				Nota: reserva.Nota
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
						message: "Reserva no encontrada",
						error: "Error al obtener reserva"
					}
				}
			}
			throw error;
		}
	},

	async getReservas(search?: string, activo?: boolean, page = 1, limit = 10): Promise<ServeResponse> {
		try {
			const skip = (page - 1) * limit;

			const where: any = {};
			if (search) {
				where.OR = [
					{ NombreCliente: { contains: search } },
					{ CedulaCliente: { contains: search } },
					{ TelefonoCliente: { contains: search } },
				]
			}
			if (activo !== undefined) where.Active = activo

			const [reservas, total] = await Promise.all([
				prisma.reserva.findMany({
					where: where,
					skip: skip,
					take: limit,
					orderBy: { FechaReserva: 'desc' },
					include: {
						Mesa: {
							select: { NumeroMesa: true }
						},
						Usuario: {
							select: { Nombre: true, Apellido: true }
						}
					}
				}),
				prisma.reserva.count({ where })
			]);

			const result = reservas.map(reserva => ({
				ID: reserva.ID,
				CedulaCliente: reserva.CedulaCliente,
				NombreCliente: reserva.NombreCliente,
				TelefonoCliente: reserva.TelefonoCliente,
				IDMesa: reserva.IDMesa,
				NumeroMesa: reserva.Mesa.NumeroMesa,
				IDUsuario: reserva.IDUsuario,
				NombreUsuario: `${reserva.Usuario.Nombre} ${reserva.Usuario.Apellido}`,
				FechaReserva: reserva.FechaReserva,
				HoraReserva: reserva.HoraReserva,
				NumeroPersonas: reserva.NumeroPersonas,
				Nota: reserva.Nota
			}))

			return {
				success: true,
				message: "OK",
				data: {
					reservas: result,
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
						message: "Error al obtener reservas",
						error: "Error al obtener reservas"
					}
				}
			}
			throw error;
		}
	},
}
