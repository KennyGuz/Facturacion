import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Facturacion API',
			version: '1.0.0',
			description: 'API para gestionar el bar valhalla',
			contact: {
				name: 'Vrtx team'
			},
			servers: [
				{
					url: 'http://localhost:42069',
					description: 'Local server'
				}
			]
		}
	},
	apis: [
		path.join(__dirname, '../routes/*.ts'),
		path.join(__dirname, '../routes/*.js'),

	]
};

const specs = swaggerJsdoc(options);
export default specs;
