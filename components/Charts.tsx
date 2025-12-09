import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Cell, PieChart, Pie } from 'recharts';
import { Product } from '../types';
import { formatCurrency } from '../utils';

interface ChartsProps {
  products: Product[];
}

// Custom Tooltip for Unit Economics Bar Chart
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const sellingPrice = data.sellingPrice;

    return (
      <div className="bg-white p-3 border border-gray-200 shadow-xl rounded-lg text-xs z-50 min-w-[200px]">
        <p className="font-bold mb-2 text-gray-800 border-b border-gray-100 pb-1">{label}</p>
        <p className="font-semibold text-gray-600 mb-3">Selling Price: {formatCurrency(sellingPrice)}</p>
        <div className="flex flex-col gap-1.5">
            {/* payload is reversed in display to match visual stack order if needed, but here we iterate normally */}
            {payload.map((entry: any, index: number) => {
                const percent = sellingPrice > 0 ? (entry.value / sellingPrice) * 100 : 0;
                return (
                <div key={index} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.color }}></span>
                        <span className="text-gray-600 font-medium">{entry.name}</span>
                    </div>
                    <span className="font-medium text-gray-900 whitespace-nowrap">
                        {formatCurrency(entry.value)} <span className="text-gray-500 font-normal">({percent.toFixed(0)}%)</span>
                    </span>
                </div>
                );
            })}
        </div>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Profit Share Pie Chart
const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
       const data = payload[0];
       return (
            <div className="bg-white p-2 border border-gray-200 shadow-lg rounded text-xs">
               <p className="font-bold text-gray-800 mb-1">{data.name}</p>
               <p className="text-gray-600">
                   Profit: <span className="font-medium text-gray-900">{formatCurrency(data.value)}</span>
               </p>
               <p className="text-gray-600">
                   Share: <span className="font-medium text-gray-900">{data.payload.share}%</span>
               </p>
           </div>
       )
    }
    return null;
};

export const Charts: React.FC<ChartsProps> = ({ products }) => {
  if (products.length === 0) return null;

  // Bar Data Preparation
  const barData = products.map(p => {
    // 1. COG + Packaging
    const cogs = p.landedCogs;
    
    // 2. Marketing & Operations
    const ops = p.adsCostPerUnit + p.overheadPerUnit;
    
    // 3. Marketplace Fees (Fees + Returns, excluding GST)
    // derived by taking total fees w/ GST & Returns -> removing GST.
    const mktFees = p.totalMktFeesPerUnit - p.gstOnMktFee; 
    
    // 4. GST & Taxes (GST on Fees + GST on Sale)
    const taxes = p.gstOnMktFee + p.gstOnSale;
    
    // 5. Net Profit
    const netProfit = p.realNetProfit;
    
    return {
        name: p.sku,
        sellingPrice: p.sellingPriceInr,
        "COG & Pkg": cogs,
        "Mkt Fees": mktFees,
        "GST & Tax": taxes,
        "Mkt & Ops": ops,
        "Net Profit": netProfit,
    };
  });

  // Pie Data Preparation
  const totalProfit = products.reduce((acc, p) => acc + (p.totalMonthlyTakeHome > 0 ? p.totalMonthlyTakeHome : 0), 0);
  const pieData = products.map(p => ({
    name: p.sku,
    value: p.totalMonthlyTakeHome > 0 ? p.totalMonthlyTakeHome : 0,
    share: totalProfit > 0 ? ((Math.max(0, p.totalMonthlyTakeHome) / totalProfit) * 100).toFixed(0) : "0"
  })).filter(p => p.value > 0);

  const PIE_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#6366F1', '#EC4899'];

  // Render label for Pie Chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return percent > 0.05 ? (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Unit Economics Breakdown */}
      <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Unit Economics Breakdown</h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} tickFormatter={(value) => `₹${value}`} />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#F9FAFB' }} />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
              
              {/* Stacked Bars - Order matters for visual stacking */}
              <Bar dataKey="COG & Pkg" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Mkt Fees" stackId="a" fill="#3B82F6" />
              <Bar dataKey="GST & Tax" stackId="a" fill="#9CA3AF" />
              <Bar dataKey="Mkt & Ops" stackId="a" fill="#F59E0B" />
              <Bar dataKey="Net Profit" stackId="a" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Profit Share Pie Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-6">% Profit Share by SKU</h3>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend verticalAlign="bottom" height={36} iconType="circle"/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};