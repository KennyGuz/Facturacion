import { runtimeEnv } from '../env';
import { prisma } from '../utils/prisma';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/jwt';


export async function verifyResetToken(req: Request, res: Response, next: NextFunction) {

	//agarramos el query del request
	const { token } = req.params;
	if (!token) {
		return res.status(401).json({success: false, message:'token no presente',error: 'El token no esta presente' })
	}

	try {
		//obtenemos el token del header
		const payload = jwt.verify(token as string, runtimeEnv.JWT_RESET_SECRET) as JwtPayload;

		//validamos el rol del usuario 
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
		if(!currentUserPermisos || currentUserPermisos.Permisos.length === 0) return res.status(403).json({error: 'Usuario sin permisos, contactar al administrador'});

		const permisosNames = currentUserPermisos.Permisos.map(p => p.Name)


		// @ts-ignore: el payload debe guardar el id del usuario y los roles
		req.user = {userid: payload.userid, permisos: permisosNames, jit: payload.jit! };
		console.log("permisos del usuario:", req.user?.permisos[0])
		next();

	} catch (err) {
		if (err instanceof jwt.TokenExpiredError) {
			return res.status(401).json({ success: false, message:"El token no es valido", error: err.message })
		}
		return res.status(500).json({ success: false, message: "No se pudo verificar el token", error: "No se pudo verificar el token" })
	}
}

