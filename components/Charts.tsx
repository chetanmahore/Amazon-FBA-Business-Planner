import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
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
      <div className="bg-white p-4 border border-gray-100 shadow-xl rounded-xl text-xs z-50 min-w-[220px]">
        <p className="font-bold mb-3 text-gray-800 border-b border-gray-100 pb-2 text-sm">{label}</p>
        <div className="flex justify-between items-center mb-4">
             <span className="text-gray-500">Selling Price</span>
             <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">{formatCurrency(sellingPrice)}</span>
        </div>
        <div className="flex flex-col gap-2">
            {payload.map((entry: any, index: number) => {
                const percent = sellingPrice > 0 ? (entry.value / sellingPrice) * 100 : 0;
                // Don't show 0 value items to keep tooltip clean
                if(entry.value <= 0) return null;
                
                return (
                <div key={index} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: entry.color }}></div>
                        <span className="text-gray-600 font-medium">{entry.name}</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="font-bold text-gray-800">{formatCurrency(entry.value)}</span>
                        <span className="text-[10px] text-gray-400 font-medium">({percent.toFixed(0)}%)</span>
                    </div>
                </div>
                );
            })}
        </div>
      </div>
    );
  }
  return null;
};

export const Charts: React.FC<ChartsProps> = ({ products }) => {
  if (products.length === 0) return null;

  // 1. Bar Data (Per Unit Economics)
  const barData = products.map(p => {
    const cogs = p.landedCogs;
    const ops = p.adsCostPerUnit + p.overheadPerUnit;
    const mktFees = p.totalMktFeesPerUnit - p.gstOnMktFee; 
    const taxes = p.gstOnMktFee + p.gstOnSale;
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

  return (
    <div className="flex flex-col gap-6 mb-8">
      
      {/* Unit Economics (Full Width) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">Unit Economics Breakdown</h3>
            <div className="text-xs text-gray-400 font-medium bg-gray-50 px-3 py-1 rounded-full">Per Unit Analysis</div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} tickFormatter={(value) => `₹${value}`} />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#F9FAFB' }} />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} iconSize={8} formatter={(value) => <span className="text-gray-500 text-xs font-medium ml-1">{value}</span>} />
              
              <Bar dataKey="COG & Pkg" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Mkt Fees" stackId="a" fill="#3B82F6" />
              <Bar dataKey="GST & Tax" stackId="a" fill="#9CA3AF" />
              <Bar dataKey="Mkt & Ops" stackId="a" fill="#F59E0B" />
              <Bar dataKey="Net Profit" stackId="a" fill="#6366F1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};