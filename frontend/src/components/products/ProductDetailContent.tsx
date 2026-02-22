import { ProductDescriptionCard } from './ProductDescriptionCard'
import { ProductInfoCard } from './ProductInfoCard'
import { ProductStockByWarehouseCard } from './ProductStockByWarehouseCard'
import type { ProductWithStocks } from '../../api/products'

type Props = {
  id: string | undefined
  isLoading: boolean
  product: ProductWithStocks | undefined
}

export function ProductDetailContent({ id, isLoading, product }: Props) {
  if (!id) return <ProductInfoCard message="Missing product id." muted />
  if (isLoading) return <ProductInfoCard message="Loading…" />
  if (!product) return <ProductInfoCard message="No data." muted />

  return (
    <>
      <ProductDescriptionCard description={product.description} />
      <ProductStockByWarehouseCard stocks={product.stocks} />
    </>
  )
}
