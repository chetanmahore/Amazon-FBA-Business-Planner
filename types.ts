export interface ProductInput {
  id: string;
  sku: string;
  // Sourcing (Green)
  unitsRequired: number;
  unitPriceUSD: number;
  fxRate: number;
  shippingAndCustomsInr: number;
  packagingInr: number;
  sellingPriceInr: number;

  // Marketplace (Blue)
  // referralFee removed (calculated)
  // fixedClosingFee removed (calculated based on selling price tiers)
  pickAndPackFee: number;
  shippingWeightFee: number;
  storageFee: number;
  returnsRatePercent: number;

  // Operations (Orange)
  estMonthlySalesUnits: number;
  adsCostPercent: number; // Logic from image implied ~10% (Revenue/10)
  monthlyFixedCosts: number;
}

export interface CalculatedMetrics {
  // Sourcing
  unitPriceInr: number;
  landedCogs: number;
  grossProfit: number;
  grossProfitMargin: number;

  // Marketplace
  referralFee: number; // Calculated: 0 if <300, else 10.5%
  fixedClosingFee: number; // Calculated based on price tiers
  gstOnMktFee: number;
  gstOnSale: number;
  returnsCost: number;
  totalMktFeesPerUnit: number; // Fees + GST + Returns Cost
  totalMktFeesPercent: number; // Fees as % of Selling Price

  // Operations
  monthlyRevenue: number;
  adsCostPerUnit: number;
  overheadPerUnit: number;
  
  // Final
  totalCostPerUnit: number;
  realNetProfit: number;
  realNetProfitMargin: number;
  totalMonthlyTakeHome: number;
  roi: number;
}

export interface Product extends ProductInput, CalculatedMetrics {}