import { NextFunction, Request, Response } from 'express';

export async function errorHandlingMiddleware(err: any, _req: Request, res: Response, _next: NextFunction) {
  // error de JSON malformado
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "JSON malformado",
      error: "Bad Request"
    });
  }

  // otros errores
  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Error interno del servidor"
  });
}

