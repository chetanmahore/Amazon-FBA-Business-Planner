import { ProductInput, CalculatedMetrics } from './types';

export const calculateMetrics = (input: ProductInput): CalculatedMetrics => {
  // --- Section 1: Sourcing (Green) ---
  const unitPriceInr = input.unitPriceUSD * input.fxRate;
  const landedCogs = unitPriceInr + input.shippingAndCustomsInr + input.packagingInr;
  
  // Gross Profit (Sales - COGS) - Basic definition before fees
  const grossProfit = input.sellingPriceInr - landedCogs;
  const grossProfitMargin = input.sellingPriceInr > 0 ? (grossProfit / input.sellingPriceInr) * 100 : 0;

  // --- Section 2: Marketplace Fees (Blue) ---
  
  // Referral Fee Calculation: 
  // If Selling Price < 300 -> 0
  // Else -> 10.5% of Selling Price
  const referralFee = input.sellingPriceInr < 300 
    ? 0 
    : input.sellingPriceInr * 0.105;

  // Fixed Closing Fee Calculation:
  // 0 - 500   -> 13
  // 501 - 1000 -> 26
  // > 1000     -> 71
  let fixedClosingFee = 13;
  if (input.sellingPriceInr > 1000) {
    fixedClosingFee = 71;
  } else if (input.sellingPriceInr > 500) {
    fixedClosingFee = 26;
  } else {
    fixedClosingFee = 13; // Covers 0-300 and 301-500
  }

  // Fees sum now includes Storage Fee, calculated Referral Fee, and calculated Closing Fee
  const sumFees = referralFee + fixedClosingFee + input.pickAndPackFee + input.shippingWeightFee + input.storageFee;
  
  // GST on Services (Standard 18% in India for Referral, Closing, PickPack, Ship, Storage)
  const gstOnMktFee = sumFees * 0.18;

  // GST on Sale (5% Standard for goods, can vary but fixed to 5% per image logic)
  const gstOnSale = input.sellingPriceInr * 0.05;

  // Returns Cost Logic from Image: (Selling_Price + Referral) * Returns % 
  // We use the calculated referralFee here.
  const returnsCost = (input.sellingPriceInr + referralFee) * (input.returnsRatePercent / 100);

  const totalMktFeesPerUnit = sumFees + gstOnMktFee + returnsCost;
  const totalMktFeesPercent = input.sellingPriceInr > 0 ? (totalMktFeesPerUnit / input.sellingPriceInr) * 100 : 0;

  // --- Section 3: Operations & Take Home (Orange) ---
  const monthlyRevenue = input.estMonthlySalesUnits * input.sellingPriceInr;
  
  // Ads Cost Logic: Image implies "Monthly_Revenue / 10 / Monthly_Units" which is 10% of selling price.
  // We use the input percentage to be flexible.
  const adsCostPerUnit = input.sellingPriceInr * (input.adsCostPercent / 100);

  // Overhead per unit
  const overheadPerUnit = input.estMonthlySalesUnits > 0 
    ? input.monthlyFixedCosts / input.estMonthlySalesUnits 
    : 0;

  // Final Calculations
  const totalCostPerUnit = landedCogs + totalMktFeesPerUnit + gstOnSale + adsCostPerUnit + overheadPerUnit;
  const realNetProfit = input.sellingPriceInr - totalCostPerUnit;
  const realNetProfitMargin = input.sellingPriceInr > 0 ? (realNetProfit / input.sellingPriceInr) * 100 : 0;
  const totalMonthlyTakeHome = realNetProfit * input.estMonthlySalesUnits;
  
  const roi = landedCogs > 0 ? (realNetProfit / landedCogs) * 100 : 0;

  return {
    unitPriceInr,
    landedCogs,
    grossProfit,
    grossProfitMargin,
    referralFee,
    fixedClosingFee,
    gstOnMktFee,
    gstOnSale,
    returnsCost,
    totalMktFeesPerUnit,
    totalMktFeesPercent,
    monthlyRevenue,
    adsCostPerUnit,
    overheadPerUnit,
    totalCostPerUnit,
    realNetProfit,
    realNetProfitMargin,
    totalMonthlyTakeHome,
    roi
  };
};

export const formatCurrency = (amount: number, currency: 'USD' | 'INR' = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercent = (amount: number) => {
  return `${amount.toFixed(0)}%`;
};

// Template for new products
export const DEFAULT_PRODUCT_TEMPLATE: ProductInput = {
  id: 'temp',
  sku: 'New Product',
  unitsRequired: 1000,
  unitPriceUSD: 1.0,
  fxRate: 90,
  shippingAndCustomsInr: 30,
  packagingInr: 5,
  sellingPriceInr: 500,
  // referralFee removed (calculated)
  // fixedClosingFee removed (calculated)
  pickAndPackFee: 15,
  shippingWeightFee: 65,
  storageFee: 5,
  returnsRatePercent: 7,
  estMonthlySalesUnits: 100,
  adsCostPercent: 10,
  monthlyFixedCosts: 1000,
};

// Initial data from the spreadsheet
export const INITIAL_PRODUCTS: ProductInput[] = [
  {
    id: '1',
    sku: 'Penguin 20CM',
    unitsRequired: 1500,
    unitPriceUSD: 2.0,
    fxRate: 90,
    shippingAndCustomsInr: 29,
    packagingInr: 20,
    sellingPriceInr: 659,
    // referralFee removed
    // fixedClosingFee removed
    pickAndPackFee: 17,
    shippingWeightFee: 65,
    storageFee: 5,
    returnsRatePercent: 7,
    estMonthlySalesUnits: 200,
    adsCostPercent: 10,
    monthlyFixedCosts: 1000,
  },
  {
    id: '2',
    sku: 'Elephant 20CM',
    unitsRequired: 1500,
    unitPriceUSD: 0.85,
    fxRate: 90,
    shippingAndCustomsInr: 29,
    packagingInr: 3,
    sellingPriceInr: 299,
    // referralFee removed
    // fixedClosingFee removed
    pickAndPackFee: 17,
    shippingWeightFee: 65,
    storageFee: 5,
    returnsRatePercent: 3,
    estMonthlySalesUnits: 500,
    adsCostPercent: 10,
    monthlyFixedCosts: 1000,
  }
];