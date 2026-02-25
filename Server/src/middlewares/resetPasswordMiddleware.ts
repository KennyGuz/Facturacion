import { runtimeEnv } from '../env';
import { prisma } from '../utils/prisma';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/jwt';
import { redisClient } from 'src/lib/redis';


export async function verifyResetToken(req: Request, res: Response, next: NextFunction) {

	//agarramos el query del request
	const { token } = req.query;
	if (!token) {
		return res.status(401).json({success: false, error: 'El token no esta presente' })
	}

	try {
		//obtenemos el token del header
		const payload = jwt.verify(token as string, runtimeEnv.JWT_RESET_SECRET) as JwtPayload;

		// validamos en redis si el token no ha sido usado
		const isPending = await redisClient.get(`rst:${payload.jit!}`);
		if(!isPending) return res.status(401).json({success: false, error: 'El token expiro o ya fue utilizado'});

		await redisClient.del(`rst:${payload.jit}`);

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
		req.user = {userid: payload.userid, roles: roleNames}
		console.log("user roles:", req.user?.roles[0])
		next();

	} catch (err) {
		if (err instanceof jwt.TokenExpiredError) {
			return res.status(401).json({ success: false, error: err.message })
		}
		return res.status(500).json({ success: false, error: "No se pudo verificar el token" })
	}
}

