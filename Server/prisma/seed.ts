import { PrismaClient } from "generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
	await prisma.role.createMany({
		data: [
			{
				Name: "admin",
			},
			{
				Name: "bartender",
			},
			{
				Name: "chef",
			},
			{
				Name: "mesero",
			},
			{
				Name: "soporte",
			},
		],
	});
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
