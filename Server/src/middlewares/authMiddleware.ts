import { runtimeEnv } from '@/env';
import { prisma } from '@/utils/prisma';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '@/types/jwt';

export async function verifyToken(req: Request, res: Response, next: NextFunction) {
	//agarramos el header del request
	const tokenHeader = req.headers['authorization'];
	if (!tokenHeader || !tokenHeader.startsWith('Bearer ')) {
		return res.status(403).json({ error: 'El token no esta presente' })
	}

	try {
		//obtenemos el token del header
		const token = tokenHeader.split(' ')[1];
		const payload = jwt.verify(token, runtimeEnv.JWT_SECRET) as JwtPayload;
		


		//validamos el rol del usuario 
		const currentUserRoles = await prisma.usuario.findUnique({
			where: {
				ID: Number(payload.userid)
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
		if(!currentUserRoles || currentUserRoles.Roles.length === 0) return res.status(403).json({error: 'Usuario sin permisos, contactar al administrador'});

		const roleNames = currentUserRoles.Roles.map(role => role.Name)


		// @ts-ignore: el payload debe guardar el id del usuario y los roles
		req.user = {userid: payload, roles: roleNames}
		console.log(req.user)
		next();

	} catch (err) {
		if (err instanceof jwt.TokenExpiredError) {
			return res.status(401).json({ error: err.message })
		}
		return res.status(403).json({ error: "No se pudo verificar el token" })
	}
}

export  function validateRol(rol: string){
	return  (req: Request, res: Response, next: NextFunction) => {
		try {
		if(!req.user) return res.status(403).json({error: 'Acceso no autorizado'});


		
		if(req.user.roles[0] !== rol) 
			return res.status(401).json({error: 'Acceso no autorizado'});
		} catch (error) {
			console.log(error)
			return res.status(500).json({error: 'Error interno del servidor'});
		}
	next();

	}

}
