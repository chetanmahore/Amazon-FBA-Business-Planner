import React from 'react';
import { Product, ProductInput } from '../types';
import { formatCurrency, formatPercent } from '../utils';
import { Trash2, Plus, Info, ArrowUp, ArrowDown } from 'lucide-react';

interface ProductTableProps {
  products: Product[];
  onUpdate: (id: string, field: keyof ProductInput, value: number | string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}

// Helper for Input Cells
const InputCell = ({ 
  id, 
  field, 
  value, 
  onUpdate,
  type = "number",
  prefix = "",
  disabled = false
}: { 
  id: string; 
  field: keyof ProductInput; 
  value: string | number;
  onUpdate: (id: string, field: keyof ProductInput, value: number | string) => void;
  type?: string;
  prefix?: string;
  disabled?: boolean;
}) => (
  <div className="relative min-w-[70px]">
      {prefix && <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none font-medium">{prefix}</span>}
      <input
      type={type}
      value={value}
      disabled={disabled}
      onChange={(e) => onUpdate(id, field, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
      className={`w-full text-xs font-medium bg-white border border-gray-200 rounded-md px-2 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none ${prefix ? 'pl-5' : ''} transition-all shadow-sm ${disabled ? 'bg-gray-50 text-gray-500' : 'hover:border-indigo-300'}`}
      />
  </div>
);

// Helper for Display Cells
const DisplayCell = ({ value, className = "", bold = false }: { value: string | number; className?: string, bold?: boolean }) => (
  <div className={`px-2 py-1.5 text-xs rounded-md ${bold ? 'font-bold' : 'font-medium'} ${className}`}>
      {value}
  </div>
);

// Visual Progress Bar Cell for Percentages
const ProgressBarCell = ({ value, colorClass, bgClass }: { value: number, colorClass: string, bgClass: string }) => {
    const percent = Math.min(100, Math.max(0, value));
    return (
        <div className="flex flex-col justify-center h-full min-w-[70px] px-1">
            <span className={`text-xs font-bold mb-1 ${colorClass}`}>{value.toFixed(0)}%</span>
            <div className={`h-1.5 w-full rounded-full ${bgClass} overflow-hidden`}>
                <div 
                    className={`h-full rounded-full ${colorClass.replace('text-', 'bg-')}`} 
                    style={{ width: `${percent}%` }}
                ></div>
            </div>
        </div>
    )
}

// Helper for Table Rows
const EmptyRow = ({ colSpan }: { colSpan: number }) => (
  <tr>
      <td colSpan={colSpan} className="p-8 text-center text-gray-400 italic bg-gray-50/50">
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="bg-gray-100 p-2 rounded-full">👋</span>
            <span>No products added yet. Click "Add Product" to start planning.</span>
          </div>
      </td>
  </tr>
);

// Helper for SKU Header
const SKUHeader = () => (
  <th className="p-3 sticky left-0 z-20 text-left min-w-[140px] bg-inherit border-r border-gray-100 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)] text-gray-600">
      SKU Name
  </th>
);

// Helper for SKU Cell
const SKUCell = ({ product, onUpdate }: { product: Product; onUpdate: (id: string, field: keyof ProductInput, value: number | string) => void }) => (
  <td className="p-3 sticky left-0 z-20 bg-white group-hover:bg-gray-50 border-r border-gray-100 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)]">
      <InputCell id={product.id} field="sku" value={product.sku} type="text" onUpdate={onUpdate} />
  </td>
);

export const ProductTable: React.FC<ProductTableProps> = ({ products, onUpdate, onDelete, onAdd, onMoveUp, onMoveDown }) => {
  
  const totalMonthlyUnits = products.reduce((acc, p) => acc + p.estMonthlySalesUnits, 0);
  const totalMonthlyRevenue = products.reduce((acc, p) => acc + p.monthlyRevenue, 0);
  const totalMonthlyFixedCosts = products.reduce((acc, p) => acc + p.monthlyFixedCosts, 0);
  const totalMonthlyTakeHome = products.reduce((acc, p) => acc + p.totalMonthlyTakeHome, 0);

  return (
    <div className="flex flex-col gap-10">
      
      {/* Top Description */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 rounded-2xl border border-gray-100 shadow-sm gap-4">
        <div>
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                Detailed Planner
                <div className="group relative">
                    <Info className="w-4 h-4 text-gray-300 hover:text-indigo-500 cursor-help transition-colors" />
                </div>
            </h2>
            <p className="text-sm text-gray-500 mt-1">Manage your sourcing, marketplace fees, and operational costs.</p>
        </div>
      </div>

      {/* --- SECTION 1: Sourcing (Green) --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden ring-1 ring-emerald-50">
        <div className="p-4 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="font-bold text-emerald-950 text-base">1. Sourcing & Landed Cost</h3>
            </div>
            <button 
              type="button"
              onClick={onAdd}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5 transition-all text-xs font-bold shadow-md shadow-emerald-200 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" /> Add Product
            </button>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left whitespace-nowrap">
                <thead>
                    <tr className="bg-gray-50/80 text-gray-500 font-semibold text-[11px] uppercase tracking-wider border-b border-gray-200">
                        <SKUHeader />
                        <th className="p-3 min-w-[80px] text-emerald-800">Units Req</th>
                        <th className="p-3 min-w-[80px] text-emerald-800">Unit Price ($)</th>
                        <th className="p-3 min-w-[70px] text-emerald-800">FX Rate</th>
                        <th className="p-3 min-w-[90px] text-emerald-800">Unit Price (₹)</th>
                        <th className="p-3 min-w-[90px] text-emerald-800">Ship+Cust</th>
                        <th className="p-3 min-w-[80px] text-emerald-800">Pkg/Unit</th>
                        <th className="p-3 min-w-[110px] text-emerald-900 font-bold bg-emerald-50/50 border-l border-emerald-100">LANDED COGS</th>
                        <th className="p-3 min-w-[110px] text-emerald-900 font-bold bg-emerald-50/50 border-l border-emerald-100">Selling Price</th>
                        <th className="p-3 min-w-[90px] text-emerald-800 border-l border-emerald-100">Gross Profit</th>
                        <th className="p-3 min-w-[90px] text-emerald-800">GP %</th>
                        <th className="p-3 min-w-[120px]"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                    {products.map((product, index) => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                            <SKUCell product={product} onUpdate={onUpdate} />
                            <td className="p-3"><InputCell id={product.id} field="unitsRequired" value={product.unitsRequired} onUpdate={onUpdate} /></td>
                            <td className="p-3"><InputCell id={product.id} field="unitPriceUSD" value={product.unitPriceUSD} prefix="$" onUpdate={onUpdate} /></td>
                            <td className="p-3"><InputCell id={product.id} field="fxRate" value={product.fxRate} onUpdate={onUpdate} /></td>
                            <td className="p-3"><DisplayCell value={formatCurrency(product.unitPriceInr)} className="bg-gray-100/50 text-gray-500"/></td>
                            <td className="p-3"><InputCell id={product.id} field="shippingAndCustomsInr" value={product.shippingAndCustomsInr} onUpdate={onUpdate} /></td>
                            <td className="p-3"><InputCell id={product.id} field="packagingInr" value={product.packagingInr} onUpdate={onUpdate} /></td>
                            
                            {/* Key Results */}
                            <td className="p-3 bg-emerald-50/30 border-l border-emerald-100">
                                <DisplayCell value={formatCurrency(product.landedCogs)} className="bg-emerald-100 text-emerald-800 shadow-sm border border-emerald-200" bold />
                            </td>
                            <td className="p-3 bg-emerald-50/30 border-l border-emerald-100">
                                <InputCell id={product.id} field="sellingPriceInr" value={product.sellingPriceInr} prefix="₹" onUpdate={onUpdate} />
                            </td>
                            <td className="p-3 border-l border-emerald-100">
                                <DisplayCell value={formatCurrency(product.grossProfit)} className="text-emerald-700 font-bold"/>
                            </td>
                            <td className="p-3">
                                <ProgressBarCell value={product.grossProfitMargin} colorClass="text-emerald-600" bgClass="bg-emerald-100" />
                            </td>
                            
                            <td className="p-3">
                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      type="button"
                                      onClick={() => onMoveUp(product.id)}
                                      disabled={index === 0}
                                      className={`p-1.5 rounded-md transition-colors ${index === 0 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                                      title="Move Up"
                                    >
                                      <ArrowUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                      type="button"
                                      onClick={() => onMoveDown(product.id)}
                                      disabled={index === products.length - 1}
                                      className={`p-1.5 rounded-md transition-colors ${index === products.length - 1 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                                      title="Move Down"
                                    >
                                      <ArrowDown className="w-3.5 h-3.5" />
                                    </button>
                                    <div className="w-px h-4 bg-gray-200 mx-1"></div>
                                    <button 
                                      type="button"
                                      onClick={() => onDelete(product.id)} 
                                      className="text-gray-300 hover:text-red-500 transition-colors p-1.5 rounded-md hover:bg-red-50" 
                                      title="Delete Product"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {products.length === 0 && <EmptyRow colSpan={12} />}
                </tbody>
            </table>
        </div>
      </div>

      {/* --- SECTION 2: Marketplace (Blue) --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden ring-1 ring-blue-50">
        <div className="p-4 bg-blue-50/50 border-b border-blue-100 flex items-center justify-between">
            <h3 className="font-bold text-blue-950 text-base">2. Amazon Fees & Charges</h3>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left whitespace-nowrap">
                <thead>
                    <tr className="bg-gray-50/80 text-gray-500 font-semibold text-[11px] uppercase tracking-wider border-b border-gray-200">
                        <SKUHeader />
                        <th className="p-3 min-w-[90px] text-blue-800">Ref. Fee</th>
                        <th className="p-3 min-w-[90px] text-blue-800">Closing</th>
                        <th className="p-3 min-w-[90px] text-blue-800">Pick & Pack</th>
                        <th className="p-3 min-w-[90px] text-blue-800">Ship Fee</th>
                        <th className="p-3 min-w-[90px] text-blue-800">Storage</th>
                        <th className="p-3 min-w-[90px] text-blue-800 border-l border-blue-100">GST (Fees)</th>
                        <th className="p-3 min-w-[90px] text-blue-800">GST (Sale)</th>
                        <th className="p-3 min-w-[80px] text-blue-800 border-l border-blue-100">Returns %</th>
                        <th className="p-3 min-w-[90px] text-blue-800">Ret. Cost</th>
                        <th className="p-3 min-w-[120px] text-blue-900 font-bold bg-blue-50/50 border-l border-blue-100">TOTAL MKT FEES</th>
                        <th className="p-3 min-w-[100px] text-blue-900 font-bold bg-blue-50/50">MKT FEE %</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                    {products.map(product => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                            <SKUCell product={product} onUpdate={onUpdate} />
                            
                            <td className="p-3">
                                <DisplayCell value={formatCurrency(product.referralFee)} className="bg-gray-100/50 text-gray-500" />
                            </td>
                            <td className="p-3">
                                <DisplayCell value={formatCurrency(product.fixedClosingFee)} className="bg-gray-100/50 text-gray-500" />
                            </td>

                            <td className="p-3"><InputCell id={product.id} field="pickAndPackFee" value={product.pickAndPackFee} onUpdate={onUpdate} /></td>
                            <td className="p-3"><InputCell id={product.id} field="shippingWeightFee" value={product.shippingWeightFee} onUpdate={onUpdate} /></td>
                            <td className="p-3"><InputCell id={product.id} field="storageFee" value={product.storageFee} onUpdate={onUpdate} /></td>
                            
                            <td className="p-3 border-l border-blue-100"><DisplayCell value={formatCurrency(product.gstOnMktFee)} className="bg-gray-100/50 text-gray-400"/></td>
                            <td className="p-3"><DisplayCell value={formatCurrency(product.gstOnSale)} className="bg-gray-100/50 text-gray-400"/></td>
                            
                            <td className="p-3 border-l border-blue-100"><InputCell id={product.id} field="returnsRatePercent" value={product.returnsRatePercent} prefix="%" onUpdate={onUpdate} /></td>
                            <td className="p-3"><DisplayCell value={formatCurrency(product.returnsCost)} className="bg-gray-100/50 text-gray-400"/></td>
                            
                            <td className="p-3 bg-blue-50/30 border-l border-blue-100">
                                <DisplayCell value={formatCurrency(product.totalMktFeesPerUnit)} className="bg-blue-100 text-blue-900 shadow-sm border border-blue-200" bold />
                            </td>
                            <td className="p-3 bg-blue-50/30">
                                <ProgressBarCell value={product.totalMktFeesPercent} colorClass="text-blue-600" bgClass="bg-blue-100" />
                            </td>
                        </tr>
                    ))}
                    {products.length === 0 && <EmptyRow colSpan={12} />}
                </tbody>
            </table>
        </div>
      </div>

      {/* --- SECTION 3: Operations & Take Home (Orange) --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden ring-1 ring-orange-50">
        <div className="p-4 bg-orange-50/50 border-b border-orange-100 flex items-center justify-between">
            <h3 className="font-bold text-orange-950 text-base">3. Final Profitability</h3>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left whitespace-nowrap">
                <thead>
                    <tr className="bg-gray-50/80 text-gray-500 font-semibold text-[11px] uppercase tracking-wider border-b border-gray-200">
                        <SKUHeader />
                        <th className="p-3 min-w-[90px] text-orange-800">Est. Mo. Units</th>
                        <th className="p-3 min-w-[110px] text-orange-800">Mo. Revenue</th>
                        <th className="p-3 min-w-[90px] text-orange-800 border-l border-orange-100">Ads Cost %</th>
                        <th className="p-3 min-w-[90px] text-orange-800">Ads / Unit</th>
                        <th className="p-3 min-w-[100px] text-orange-800 border-l border-orange-100">Mo. Fixed Cost</th>
                        <th className="p-3 min-w-[90px] text-orange-800">Overhead / Unit</th>
                        <th className="p-3 min-w-[110px] text-orange-900 font-bold bg-orange-50/50 border-l border-orange-100">REAL NET PROFIT</th>
                        <th className="p-3 min-w-[100px] text-orange-900 font-bold bg-orange-50/50">NET %</th>
                        <th className="p-3 min-w-[100px] text-orange-900 font-bold bg-orange-50/50">ROI %</th>
                        <th className="p-3 min-w-[130px] text-orange-950 font-black bg-orange-100/50 border-l border-orange-200">Mo. Take Home</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                    {products.map(product => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                            <SKUCell product={product} onUpdate={onUpdate} />
                            <td className="p-3"><InputCell id={product.id} field="estMonthlySalesUnits" value={product.estMonthlySalesUnits} onUpdate={onUpdate} /></td>
                            <td className="p-3"><DisplayCell value={formatCurrency(product.monthlyRevenue)} className="bg-gray-100/50 text-gray-500"/></td>
                            
                            <td className="p-3 border-l border-orange-100"><InputCell id={product.id} field="adsCostPercent" value={product.adsCostPercent} prefix="%" onUpdate={onUpdate} /></td>
                            <td className="p-3"><DisplayCell value={formatCurrency(product.adsCostPerUnit)} className="bg-gray-100/50 text-gray-500"/></td>
                            
                            <td className="p-3 border-l border-orange-100"><InputCell id={product.id} field="monthlyFixedCosts" value={product.monthlyFixedCosts} onUpdate={onUpdate} /></td>
                            <td className="p-3"><DisplayCell value={formatCurrency(product.overheadPerUnit)} className="bg-gray-100/50 text-gray-500"/></td>
                            
                            <td className="p-3 bg-orange-50/30 border-l border-orange-200">
                                <DisplayCell value={formatCurrency(product.realNetProfit)} className="bg-white text-orange-800 border border-orange-100 shadow-sm" bold />
                            </td>
                            <td className="p-3 bg-orange-50/30">
                                <ProgressBarCell 
                                    value={product.realNetProfitMargin} 
                                    colorClass={product.realNetProfitMargin < 15 ? "text-red-500" : "text-green-600"} 
                                    bgClass={product.realNetProfitMargin < 15 ? "bg-red-100" : "bg-green-100"}
                                />
                            </td>
                            <td className="p-3 bg-orange-50/30">
                                <ProgressBarCell value={product.roi} colorClass="text-orange-600" bgClass="bg-orange-100" />
                            </td>
                            <td className="p-3 bg-orange-100/30 border-l border-orange-200">
                                <DisplayCell value={formatCurrency(product.totalMonthlyTakeHome)} className="bg-orange-200 text-orange-950 border border-orange-300 shadow-sm" bold />
                            </td>
                        </tr>
                    ))}
                    {products.length === 0 && <EmptyRow colSpan={11} />}
                    {products.length > 0 && (
                        <tr className="bg-orange-50/80 border-t border-orange-200 font-bold text-orange-900">
                            <td className="p-3 sticky left-0 z-20 bg-orange-50 border-r border-orange-200 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)] text-right pr-4 text-[11px] uppercase tracking-wider">
                                TOTALS
                            </td>
                            <td className="p-3">
                                <DisplayCell value={totalMonthlyUnits} className="bg-transparent" bold />
                            </td>
                            <td className="p-3">
                                <DisplayCell value={formatCurrency(totalMonthlyRevenue)} className="bg-transparent" bold />
                            </td>
                            <td className="p-3 border-l border-orange-200"></td>
                            <td className="p-3"></td>
                            <td className="p-3 border-l border-orange-200">
                                <DisplayCell value={totalMonthlyFixedCosts} className="bg-transparent" bold />
                            </td>
                            <td className="p-3"></td>
                            <td className="p-3 bg-orange-50/30 border-l border-orange-200"></td>
                            <td className="p-3 bg-orange-50/30"></td>
                            <td className="p-3 bg-orange-50/30"></td>
                            <td className="p-3 bg-orange-100/50 border-l border-orange-300">
                                <DisplayCell value={formatCurrency(totalMonthlyTakeHome)} className="bg-orange-200 text-orange-950 border-orange-300" bold />
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

    </div>
  );
};