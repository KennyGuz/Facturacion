import { runtimeEnv } from '../env';
import { prisma } from '../utils/prisma';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/jwt';

export async function verifyToken(req: Request, res: Response, next: NextFunction) {
	//agarramos el header del request
	const token = req.cookies['_tk'];
	if (!token) {
		return res.status(403).json({ error: 'El token no esta presente' })
	}

	try {
		//obtenemos el token del header
		const payload = jwt.verify(token, runtimeEnv.JWT_SECRET) as JwtPayload;


		//validamos el permiso del usuario 
		const currentUserPermisos = await prisma.usuario.findUnique({
			where: {
				ID: Number(payload.userid)
			},
			select: {
				Permisos: {
					select: {
						ID: true,
						Name: true
					}
				}
			}
		})
		if (!currentUserPermisos || currentUserPermisos.Permisos.length === 0) return res.status(403).json({
			success: false,
			error: 'Usuario sin permisos, contactar al administrador'
		});

		const permisosNames = currentUserPermisos.Permisos.map(p => p.Name)
		console.log("permisos del usuario:", permisosNames)


		// @ts-ignore: el payload debe guardar el id del usuario y los roles
		req.user = { userid: payload.userid, permisos: permisosNames }
		next();

	} catch (err) {
		console.log(err)
		if (err instanceof jwt.TokenExpiredError) {
			return res.status(401).json({ error: err.message })
		}
		return res.status(403).json({ error: "No se pudo verificar el token" })
	}
}

export function validatePermisos(permiso: string) {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			if (!req.user) return res.status(403).json({ error: 'Acceso no autorizado' });

			const permisos = req.user.permisos;
			console.log(permisos)
			if (!permisos.includes(permiso))
				return res.status(401).json({ error: 'Acceso no autorizado' });
		} catch (error) {
			console.log(error)
			return res.status(500).json({ error: 'Error interno del servidor' });
		}
		next();

	}

}
