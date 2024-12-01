import { useState } from "react";
import { NavigationMenu } from "@/components/NavigationMenu";
import { ProductSearch } from "@/components/products/ProductSearch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/product";

const ProfitCalculator = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [retailPrice, setRetailPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setRetailPrice(product.srp);
  };

  const calculateProfit = () => {
    if (!selectedProduct) return 0;
    return (retailPrice - selectedProduct.from_price) * quantity;
  };

  const calculateMargin = () => {
    if (!selectedProduct || retailPrice === 0) return 0;
    return ((retailPrice - selectedProduct.from_price) / retailPrice) * 100;
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />
      <main className="md:pl-64 flex-1">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Profit Calculator</h1>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Product</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductSearch onSelectProduct={handleProductSelect} />
              </CardContent>
            </Card>

            {selectedProduct && (
              <Card>
                <CardHeader>
                  <CardTitle>Calculate Profit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="cost">Cost Price</Label>
                      <Input
                        id="cost"
                        type="text"
                        value={formatCurrency(selectedProduct.from_price)}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="retail">Retail Price</Label>
                      <Input
                        id="retail"
                        type="number"
                        min={selectedProduct.from_price}
                        value={retailPrice}
                        onChange={(e) => setRetailPrice(Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label>Profit per Unit</Label>
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(calculateProfit() / quantity)}
                        </p>
                      </div>
                      <div>
                        <Label>Profit Margin</Label>
                        <p className="text-2xl font-bold text-green-600">
                          {calculateMargin().toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label>Total Profit</Label>
                      <p className="text-3xl font-bold text-green-600">
                        {formatCurrency(calculateProfit())}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfitCalculator;