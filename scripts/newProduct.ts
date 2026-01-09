import fs from 'fs'
import readline from 'readline'
import path from 'path'
import type { Product } from '../src/utils/productsSchema'

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

const askQuestion = (query: string): Promise<string> => {
	return new Promise((resolve) => rl.question(query, resolve))
}

const createTemplate = async (): Promise<void> => {
	const productId = await askQuestion('Enter Product ID: ')

	const directory = path.join(process.cwd(), 'data', 'products')
	if (!fs.existsSync(directory)) {
		fs.mkdirSync(directory, { recursive: true })
	}

	const fileName = path.join(directory, `${productId}.json`)
	
	if (fs.existsSync(fileName)) {
		const overwrite = await askQuestion(`Product ${productId} already exists. Overwrite? (y/N): `)
		if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
			console.log('Operation cancelled.')
			rl.close()
			return
		}
	}

	const template: Product = {
		id: productId,
		name: '',
		description: '',
		website: '',
		categories: [],
		headquarters: null,
		year_founded: null,
		notes: [],
		open_source: false,
		self_signup: false,
		discontinued: false,
		cms_properties: null,
		models: [
			{
				delivery: 'cloud',
				free_trial: false,
				pricing_available: false,
				has_freemium: false,
				pricing: [
					{
						name: '',
						payment_model: 'subscription',
						billing_basis: 'per_device',
						monthly: null,
						yearly: null
					}
				]
			}
		],
		stats: undefined,
		has_logo: false
	}

	fs.writeFileSync(fileName, JSON.stringify(template, null, 2))
	console.log(`Template created and saved as ${fileName}`)

	rl.close()
}

createTemplate() 