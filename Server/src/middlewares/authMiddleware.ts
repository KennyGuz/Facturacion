import { runtimeEnv } from '@/env';
import { prisma } from '@/utils/prisma';
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export function verifyToken(req: Request, res: Response, next: NextFunction) {
	//agarramos el header del request
	const tokenHeader = req.headers['authorization'];
	if (!tokenHeader || !tokenHeader.startsWith('Bearer ')) {
		return res.status(403).json({ error: 'El token no esta presente' })
	}

	try {
		//obtenemos el token del header
		const token = tokenHeader.split(' ')[1];
		// lo verificamos
		const payload = jwt.verify(token, runtimeEnv.JWT_SECRET) as JwtPayload;
		req.user = payload
		next();

	} catch (err) {
		if (err instanceof jwt.TokenExpiredError) {
			return res.status(401).json({ error: err.message })
		}
		return res.status(403).json({ error: "No se pudo verificar el token" })
	}
}

export async function validateRol(rol: string){
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
		if(!req.user) return res.status(403).json({error: 'Acceso no autorizado'});


		const currentUser = await prisma.usuario.findUnique({
			where: {
				ID: Number(req.user!.userid)
			},
			select: {
				Roles: {
					select: {
						ID: true,
						Name: true
					}
				}
			}
		})

		if(!currentUser || currentUser!.Roles[0].Name !== rol) return res.status(403).json({error: 'Acceso no autorizado'});
		} catch (error) {
			console.log(error)
			return res.status(500).json({error: 'Error interno del servidor'});
		}
	next();

	}

}
