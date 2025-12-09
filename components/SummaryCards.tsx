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

  // 1. Total Investment (Inventory Value)
  const totalInventoryValue = products.reduce((acc, p) => acc + (p.landedCogs * p.unitsRequired), 0);

  // 2. Total Revenue (Potential from Stock)
  const totalInventoryRevenue = products.reduce((acc, p) => acc + (p.sellingPriceInr * p.unitsRequired), 0);

  // 3. Total Gross Profit (Potential from Stock)
  const totalInventoryGrossProfit = products.reduce((acc, p) => acc + ((p.sellingPriceInr - p.landedCogs) * p.unitsRequired), 0);
  const inventoryGrossProfitMargin = totalInventoryRevenue > 0 ? (totalInventoryGrossProfit / totalInventoryRevenue) * 100 : 0;

  // 4. Total Net Profit (Potential from Stock)
  const totalInventoryNetProfit = products.reduce((acc, p) => acc + (p.realNetProfit * p.unitsRequired), 0);
  const inventoryNetProfitMargin = totalInventoryRevenue > 0 ? (totalInventoryNetProfit / totalInventoryRevenue) * 100 : 0;

  // --- Efficiency Metrics (Time-based / Monthly) ---

  const totalMonthlyRevenue = products.reduce((acc, p) => acc + p.monthlyRevenue, 0);
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


  // --- Card Helper ---
  const MetricCard = ({ 
    title, 
    value, 
    subtext, 
    icon, 
    colorClass, 
    iconBgClass,
    progressBarValue = null,
    progressBarColor = "" 
  }: any) => (
    <div className={`p-5 rounded-2xl border bg-white shadow-sm flex flex-col justify-between transition-all hover:shadow-md hover:-translate-y-0.5 ${colorClass}`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{title}</h3>
        <div className={`p-2 rounded-xl ${iconBgClass}`}>
          {icon}
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900 tracking-tight" title={value}>{value}</div>
        <div className="text-[11px] font-medium text-gray-500 mt-1">{subtext}</div>
        
        {progressBarValue !== null && (
          <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-1.5 rounded-full ${progressBarColor}`} 
              style={{ width: `${Math.min(100, Math.max(0, progressBarValue))}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 mb-8">
      
      {/* Row 1: Investment Outlook */}
      <div>
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4 flex items-center gap-2">
           <Wallet className="w-4 h-4 text-gray-500" /> Investment Outlook
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <MetricCard 
            title="Total Investment"
            value={formatCurrency(totalInventoryValue)}
            subtext="Inventory Cost"
            icon={<Wallet className="w-4 h-4 text-emerald-600" />}
            colorClass="border-emerald-100"
            iconBgClass="bg-emerald-50"
          />
          <MetricCard 
            title="Total Revenue"
            value={formatCurrency(totalInventoryRevenue)}
            subtext="Potential Sales"
            icon={<DollarSign className="w-4 h-4 text-blue-600" />}
            colorClass="border-blue-100"
            iconBgClass="bg-blue-50"
          />
          <MetricCard 
            title="Gross Profit"
            value={formatCurrency(totalInventoryGrossProfit)}
            subtext="Before Ops"
            icon={<BarChart3 className="w-4 h-4 text-teal-600" />}
            colorClass="border-teal-100"
            iconBgClass="bg-teal-50"
          />
          <MetricCard 
            title="Gross Margin"
            value={`${inventoryGrossProfitMargin.toFixed(0)}%`}
            subtext="Target: >40%"
            icon={<PieChart className="w-4 h-4 text-violet-600" />}
            colorClass="border-violet-100"
            iconBgClass="bg-violet-50"
            progressBarValue={inventoryGrossProfitMargin}
            progressBarColor="bg-violet-500"
          />
          <MetricCard 
            title="Net Profit"
            value={formatCurrency(totalInventoryNetProfit)}
            subtext="Take-Home"
            icon={<TrendingUp className="w-4 h-4 text-green-600" />}
            colorClass="border-green-100"
            iconBgClass="bg-green-50"
          />
          <MetricCard 
            title="Net Margin"
            value={`${inventoryNetProfitMargin.toFixed(0)}%`}
            subtext="Target: >20%"
            icon={<Activity className="w-4 h-4 text-orange-600" />}
            colorClass="border-orange-100"
            iconBgClass="bg-orange-50"
            progressBarValue={inventoryNetProfitMargin}
            progressBarColor="bg-orange-500"
          />
        </div>
      </div>

      {/* Row 2: Capital Efficiency */}
      <div>
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4 flex items-center gap-2">
           <Clock className="w-4 h-4 text-gray-500" /> Capital Efficiency
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard 
            title="Days of Inventory"
            value={`${daysOfInventory.toFixed(0)} Days`}
            subtext="Turnover Speed"
            icon={<Clock className="w-4 h-4 text-indigo-600" />}
            colorClass="border-indigo-100"
            iconBgClass="bg-indigo-50"
            progressBarValue={(365 - daysOfInventory) / 365 * 100} // Inverse visual: less is better usually, but here just showing capacity
            progressBarColor="bg-indigo-500"
          />
          <MetricCard 
            title="Contribution Margin"
            value={`${contributionMarginPercent.toFixed(0)}%`}
            subtext="After Amazon Fees & COGS"
            icon={<PackageCheck className="w-4 h-4 text-rose-600" />}
            colorClass="border-rose-100"
            iconBgClass="bg-rose-50"
            progressBarValue={contributionMarginPercent}
            progressBarColor="bg-rose-500"
          />
          <MetricCard 
            title="Investment Recovery"
            value={monthsToPayback === Infinity || monthsToPayback <= 0 ? 'N/A' : `${monthsToPayback.toFixed(0)} Months`}
            subtext="To break even on stock"
            icon={<Hourglass className="w-4 h-4 text-amber-600" />}
            colorClass="border-amber-100"
            iconBgClass="bg-amber-50"
            progressBarValue={monthsToPayback > 0 ? (12 - monthsToPayback)/12 * 100 : 0} 
            progressBarColor="bg-amber-500"
          />
        </div>
      </div>

    </div>
  );
};