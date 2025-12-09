import React from 'react';
import { Product } from '../types';
import { formatCurrency } from '../utils';
import { 
  TrendingUp, 
  DollarSign, 
  Wallet, 
  PieChart, 
  Activity, 
  Clock, 
  Hourglass,
  BarChart3,
  PackageCheck
} from 'lucide-react';

interface SummaryCardsProps {
  products: Product[];
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ products }) => {
  // --- Calculations ---

  // 1. Total Investment (Inventory Value) -> Based on Units Required
  const totalInventoryValue = products.reduce((acc, p) => acc + (p.landedCogs * p.unitsRequired), 0);

  // 2. Total Revenue (Potential from Stock) -> Based on Units Required
  const totalInventoryRevenue = products.reduce((acc, p) => acc + (p.sellingPriceInr * p.unitsRequired), 0);

  // 3. Total Gross Profit (Potential from Stock) -> Based on Units Required
  // GP = Selling Price - Landed Cost
  const totalInventoryGrossProfit = products.reduce((acc, p) => acc + ((p.sellingPriceInr - p.landedCogs) * p.unitsRequired), 0);
  const inventoryGrossProfitMargin = totalInventoryRevenue > 0 ? (totalInventoryGrossProfit / totalInventoryRevenue) * 100 : 0;

  // 4. Total Net Profit (Potential from Stock) -> Based on Units Required
  // Uses the Real Net Profit per unit (which accounts for overheads/ads based on current run rate)
  const totalInventoryNetProfit = products.reduce((acc, p) => acc + (p.realNetProfit * p.unitsRequired), 0);
  const inventoryNetProfitMargin = totalInventoryRevenue > 0 ? (totalInventoryNetProfit / totalInventoryRevenue) * 100 : 0;

  // --- Efficiency Metrics (Time-based / Monthly) ---

  // Monthly Revenue (for Contribution calculation context)
  const totalMonthlyRevenue = products.reduce((acc, p) => acc + p.monthlyRevenue, 0);

  // Monthly COGS (for Days of Inventory)
  const totalMonthlyCOGS = products.reduce((acc, p) => acc + (p.landedCogs * p.estMonthlySalesUnits), 0);

  // Days of Inventory
  const daysOfInventory = totalMonthlyCOGS > 0 ? (totalInventoryValue / totalMonthlyCOGS) * 30 : 0;

  // Contribution Margin %
  const totalMonthlyContribution = products.reduce((acc, p) => {
    const variableCostPerUnit = p.landedCogs + p.totalMktFeesPerUnit + p.gstOnSale;
    const contributionPerUnit = p.sellingPriceInr - variableCostPerUnit;
    return acc + (contributionPerUnit * p.estMonthlySalesUnits);
  }, 0);
  const contributionMarginPercent = totalMonthlyRevenue > 0 ? (totalMonthlyContribution / totalMonthlyRevenue) * 100 : 0;

  // Total Monthly Net Profit (for Payback Period)
  const totalMonthlyTakeHome = products.reduce((acc, p) => acc + p.totalMonthlyTakeHome, 0);

  // Months to Recover Investment
  const monthsToPayback = totalMonthlyTakeHome > 0 ? totalInventoryValue / totalMonthlyTakeHome : 0;


  // --- Card Definitions ---

  const investmentCards = [
    {
      title: 'Total Investment',
      value: formatCurrency(totalInventoryValue),
      subtext: 'Cost of Inventory',
      icon: <Wallet className="w-4 h-4 text-emerald-600" />,
      color: 'bg-emerald-50 border-emerald-200',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(totalInventoryRevenue),
      subtext: 'Potential Sales Value',
      icon: <DollarSign className="w-4 h-4 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200',
    },
    {
      title: 'Total Gross Profit',
      value: formatCurrency(totalInventoryGrossProfit),
      subtext: 'Potential GP (Stock)',
      icon: <BarChart3 className="w-4 h-4 text-teal-600" />,
      color: 'bg-teal-50 border-teal-200',
    },
    {
      title: 'Total Gross Profit %',
      value: `${inventoryGrossProfitMargin.toFixed(0)}%`,
      subtext: 'GP Margin',
      icon: <PieChart className="w-4 h-4 text-violet-600" />,
      color: 'bg-violet-50 border-violet-200',
    },
    {
      title: 'Total Net Profit',
      value: formatCurrency(totalInventoryNetProfit),
      subtext: 'Potential Take-Home',
      icon: <TrendingUp className="w-4 h-4 text-green-600" />,
      color: 'bg-green-50 border-green-200',
    },
    {
      title: 'Total Net Profit %',
      value: `${inventoryNetProfitMargin.toFixed(0)}%`,
      subtext: 'Net Margin',
      icon: <Activity className="w-4 h-4 text-orange-600" />,
      color: 'bg-orange-50 border-orange-200',
    },
  ];

  const efficiencyCards = [
    {
      title: 'Days of Inventory',
      value: `${daysOfInventory.toFixed(0)} Days`,
      subtext: 'Stock Duration',
      icon: <Clock className="w-4 h-4 text-indigo-600" />,
      color: 'bg-indigo-50 border-indigo-200',
    },
    {
      title: 'Contribution %',
      value: `${contributionMarginPercent.toFixed(0)}%`,
      subtext: 'After Amazon & Taxes',
      icon: <PackageCheck className="w-4 h-4 text-rose-600" />,
      color: 'bg-rose-50 border-rose-200',
    },
    {
      title: 'Inv. Recovery',
      value: monthsToPayback === Infinity || monthsToPayback <= 0 ? 'N/A' : `${monthsToPayback.toFixed(0)} Months`,
      subtext: 'Payback Period',
      icon: <Hourglass className="w-4 h-4 text-amber-600" />,
      color: 'bg-amber-50 border-amber-200',
    },
  ];

  return (
    <div className="flex flex-col gap-6 mb-8">
      
      {/* Row 1: Investment Outlook (Stock Based) */}
      <div>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1 flex items-center gap-2">
          Capital & Investment Potential <span className="text-[10px] bg-gray-200 px-1.5 py-0.5 rounded text-gray-500 normal-case">Based on current stock</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {investmentCards.map((card, idx) => (
            <div key={idx} className={`p-4 rounded-xl border ${card.color} shadow-sm flex flex-col justify-between transition-all hover:shadow-md min-h-[110px]`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wide leading-tight">{card.title}</h3>
                <div className="p-1.5 bg-white rounded-lg bg-opacity-80 shadow-sm">
                  {card.icon}
                </div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900 truncate" title={card.value}>{card.value}</div>
                <div className="text-[10px] text-gray-500 mt-1 truncate">{card.subtext}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Efficiency & Speed */}
      <div>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1">Capital Efficiency & Cash Flow</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {efficiencyCards.map((card, idx) => (
            <div key={idx} className={`p-4 rounded-xl border ${card.color} shadow-sm flex flex-col justify-between transition-all hover:shadow-md`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">{card.title}</h3>
                <div className="p-2 bg-white rounded-lg bg-opacity-80 shadow-sm">
                  {card.icon}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                <div className="text-xs text-gray-500 mt-1">{card.subtext}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};