import type { Product } from './productsSchema'

// We are filtering out freemium plans because they are not relevant to the pricing per screen

export const getCMSProductPricingPreview = (product: Product) => {
	const cloudModel = product.models.find(model => model.delivery === 'cloud')

	if (product.open_source && !cloudModel?.pricing_available) {
		return 'Free/Open Source'
	}

	if (!cloudModel?.pricing_available) {
		return 'On request'
	}
	
	const perDevicePricing = cloudModel.pricing.find(p => p.billing_basis === 'per_device' && (p.monthly !== 0 || p.yearly !== 0))
	if (perDevicePricing?.monthly) {
		return `$${perDevicePricing.monthly} / month`
	}

	if (perDevicePricing?.yearly) {
		return `$${(perDevicePricing.yearly / 12).toFixed(2)} / month`
	}

	return '-'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cmsProductPricingSortingFn = (rowA: any, rowB: any) => {
	const productA = rowA.original
	const productB = rowB.original

	const getMonthlyPrice = (product: Product) => {
		const cloudModel = product.models.find(model => model.delivery === 'cloud')
		const perDevicePricing = cloudModel?.pricing.find(p => p.billing_basis === 'per_device' && p.monthly !== 0 && p.yearly !== 0)
		
		if (perDevicePricing?.monthly) {
			return perDevicePricing.monthly
		}
		if (perDevicePricing?.yearly) {
			return perDevicePricing.yearly / 12
		}
		return null
	}

	const pricingA = getMonthlyPrice(productA)
	const pricingB = getMonthlyPrice(productB)

	if (pricingA && pricingB) {
		return pricingA - pricingB
	}
	
	if (pricingA && !pricingB) {
		return 1
	}
	if (!pricingA && pricingB) {
		return -1
	}

	return 0
}