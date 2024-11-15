export const ProductBenefits = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Product Benefits</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Key Ingredients</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Aloe Vera: Deep hydration</li>
            <li>Tea Tree Oil: Purifying properties</li>
            <li>Cucumber Extract: Soothing effect</li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Benefits</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Reduces redness</li>
            <li>Balances skin</li>
            <li>Deep hydration</li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">How to Use</h3>
          <p>Apply to clean, dry skin, gently massaging. Use twice daily for best results.</p>
        </div>
      </div>
    </div>
  );
};