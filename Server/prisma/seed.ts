import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

async function main() {

	await prisma.permisos.deleteMany({});
	await prisma.usuario.deleteMany({});

	await prisma.permisos.createMany({
		data: [
			{
				ID: 1,
				Name: "admin",
			},
			{
				ID: 2,
				Name: "bartender",
			},
			{
				ID: 3,
				Name: "chef",
			},
			{
				ID: 4,
				Name: "mesero",
			},
			{
				ID: 5,
				Name: "soporte",
			},
			{
				ID: 6,
				Name: "trabajador",
			},
		],
		skipDuplicates: true,
	});

	await prisma.usuario.create({
		data: {
			ID: 1,
			Email: "vrtxai@protonmail.com",
			Password: "$2b$10$g0MtRwH3c8vjdfGWXdrk3eaHymEdi7BMwl./ZcTGfJ3xbxMMib5V.",
			Nombre: "admin",
			Apellido: "admin",
			Cedula: "123456789",
			Rol: "admin",
			Permisos: {
				connect: {
					ID: 1,
				},
			},
		},
	})
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
