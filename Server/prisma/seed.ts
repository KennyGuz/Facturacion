import { PrismaClient } from "generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
	await prisma.role.createMany({
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
		],
		skipDuplicates: true,
	});

	await prisma.usuario.create({
		data: {
			Email: "vrtxai@protonmail.com",
			Password: "$2b$10$g0MtRwH3c8vjdfGWXdrk3eaHymEdi7BMwl./ZcTGfJ3xbxMMib5V.",
			Nombre: "admin",
			Apellido: "admin",
			Cedula: "123456789",
			Roles: {
				connect: [{
					ID: 1
				}]
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
