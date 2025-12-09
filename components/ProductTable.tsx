import React from 'react';
import { Product, ProductInput } from '../types';
import { formatCurrency, formatPercent } from '../utils';
import { Trash2, Plus, Info } from 'lucide-react';

interface ProductTableProps {
  products: Product[];
  onUpdate: (id: string, field: keyof ProductInput, value: number | string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

// Helper for Input Cells - Moved outside to prevent focus loss
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
      {prefix && <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">{prefix}</span>}
      <input
      type={type}
      value={value}
      disabled={disabled}
      onChange={(e) => onUpdate(id, field, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
      className={`w-full text-xs bg-white border border-gray-200 rounded px-2 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${prefix ? 'pl-5' : ''} transition-colors ${disabled ? 'bg-gray-50 text-gray-500' : 'hover:border-indigo-300'}`}
      />
  </div>
);

// Helper for Display/Calculated Cells - Moved outside
const DisplayCell = ({ value, className = "", bold = false }: { value: string | number; className?: string, bold?: boolean }) => (
  <div className={`px-2 py-1.5 text-xs rounded border border-transparent ${bold ? 'font-bold' : 'font-medium'} ${className}`}>
      {value}
  </div>
);

// Helper for Table Rows - Moved outside
const EmptyRow = ({ colSpan }: { colSpan: number }) => (
  <tr>
      <td colSpan={colSpan} className="p-8 text-center text-gray-400 italic bg-gray-50">
          No products added. Click "Add Product" in the section above to start.
      </td>
  </tr>
);

// Helper for SKU Header - Moved outside
const SKUHeader = () => (
  <th className="p-3 sticky left-0 z-20 text-left min-w-[150px] bg-inherit border-r border-gray-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
      SKU Name
  </th>
);

// Helper for SKU Cell - Moved outside
const SKUCell = ({ product, onUpdate }: { product: Product; onUpdate: (id: string, field: keyof ProductInput, value: number | string) => void }) => (
  <td className="p-2 sticky left-0 z-20 bg-white group-hover:bg-gray-50 border-r border-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
      <InputCell id={product.id} field="sku" value={product.sku} type="text" onUpdate={onUpdate} />
  </td>
);

export const ProductTable: React.FC<ProductTableProps> = ({ products, onUpdate, onDelete, onAdd }) => {
  
  // Calculate Totals for the Operations Table Footer
  const totalMonthlyUnits = products.reduce((acc, p) => acc + p.estMonthlySalesUnits, 0);
  const totalMonthlyRevenue = products.reduce((acc, p) => acc + p.monthlyRevenue, 0);
  const totalMonthlyFixedCosts = products.reduce((acc, p) => acc + p.monthlyFixedCosts, 0);
  const totalMonthlyTakeHome = products.reduce((acc, p) => acc + p.totalMonthlyTakeHome, 0);

  return (
    <div className="flex flex-col gap-10">
      
      {/* Top Description */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm gap-4">
        <div>
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                Detailed Profitability Breakdown
                <div className="group relative">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    <div className="absolute left-0 bottom-6 w-72 p-3 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                        Data is split into 3 sections below. Rows in each table correspond to the same product. Adding/Deleting a product updates all tables.
                    </div>
                </div>
            </h2>
            <p className="text-sm text-gray-500">Manage your sourcing, marketplace fees, and operational costs separately.</p>
        </div>
      </div>

      {/* --- SECTION 1: Sourcing (Green) --- */}
      <div className="bg-white rounded-xl shadow-lg border border-emerald-200 overflow-hidden">
        <div className="p-4 bg-emerald-50 border-b border-emerald-200 flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="font-bold text-emerald-900 text-lg">1. Sourcing, Packaging & True Landing Cost</h3>
              <span className="text-xs font-semibold text-emerald-700 mt-1">Add or remove products here</span>
            </div>
            <button 
              type="button"
              onClick={onAdd}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-bold shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
                <thead>
                    <tr className="bg-gray-50/50 text-gray-500 font-semibold text-xs border-b border-gray-200">
                        <SKUHeader />
                        <th className="p-2 min-w-[80px] text-emerald-800 bg-emerald-50/30">Units Req</th>
                        <th className="p-2 min-w-[80px] text-emerald-800 bg-emerald-50/30">Unit Price ($)</th>
                        <th className="p-2 min-w-[70px] text-emerald-800 bg-emerald-50/30">FX Rate</th>
                        <th className="p-2 min-w-[90px] text-emerald-800 bg-emerald-50/30">Unit Price (₹)</th>
                        <th className="p-2 min-w-[90px] text-emerald-800 bg-emerald-50/30">Ship+Cust</th>
                        <th className="p-2 min-w-[80px] text-emerald-800 bg-emerald-50/30">Pkg/Unit</th>
                        <th className="p-2 min-w-[100px] text-emerald-900 font-bold bg-emerald-100/50 border-l border-emerald-200">LANDED COGS</th>
                        <th className="p-2 min-w-[100px] text-emerald-900 font-bold bg-emerald-100/50 border-l border-emerald-200">Selling Price</th>
                        <th className="p-2 min-w-[90px] text-emerald-800 bg-emerald-50/30 border-l border-emerald-200">Gross Profit</th>
                        <th className="p-2 min-w-[80px] text-emerald-800 bg-emerald-50/30">GP %</th>
                        <th className="p-2 w-10"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                    {products.map(product => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                            <SKUCell product={product} onUpdate={onUpdate} />
                            <td className="p-2"><InputCell id={product.id} field="unitsRequired" value={product.unitsRequired} onUpdate={onUpdate} /></td>
                            <td className="p-2"><InputCell id={product.id} field="unitPriceUSD" value={product.unitPriceUSD} prefix="$" onUpdate={onUpdate} /></td>
                            <td className="p-2"><InputCell id={product.id} field="fxRate" value={product.fxRate} onUpdate={onUpdate} /></td>
                            <td className="p-2"><DisplayCell value={formatCurrency(product.unitPriceInr)} className="bg-gray-100 text-gray-600"/></td>
                            <td className="p-2"><InputCell id={product.id} field="shippingAndCustomsInr" value={product.shippingAndCustomsInr} onUpdate={onUpdate} /></td>
                            <td className="p-2"><InputCell id={product.id} field="packagingInr" value={product.packagingInr} onUpdate={onUpdate} /></td>
                            
                            {/* Key Results */}
                            <td className="p-2 bg-emerald-50/30 border-l border-emerald-100">
                                <DisplayCell value={formatCurrency(product.landedCogs)} className="bg-emerald-100 text-emerald-900" bold />
                            </td>
                            <td className="p-2 bg-emerald-50/30 border-l border-emerald-100">
                                <InputCell id={product.id} field="sellingPriceInr" value={product.sellingPriceInr} prefix="₹" onUpdate={onUpdate} />
                            </td>
                            <td className="p-2 border-l border-emerald-100">
                                <DisplayCell value={formatCurrency(product.grossProfit)} className="text-emerald-700"/>
                            </td>
                            <td className="p-2">
                                <DisplayCell value={formatPercent(product.grossProfitMargin)} className="text-emerald-700"/>
                            </td>
                            
                            <td className="p-2 text-center">
                                <button 
                                  type="button"
                                  onClick={() => onDelete(product.id)} 
                                  className="text-red-400 hover:text-red-600 transition-colors p-1.5 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500" 
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {products.length === 0 && <EmptyRow colSpan={12} />}
                </tbody>
            </table>
        </div>
      </div>

      {/* --- SECTION 2: Marketplace (Blue) --- */}
      <div className="bg-white rounded-xl shadow-lg border border-blue-200 overflow-hidden">
        <div className="p-4 bg-blue-50 border-b border-blue-200 flex items-center justify-between">
            <h3 className="font-bold text-blue-900 text-lg">2. Amazon Fees & Charges</h3>
            <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded">Fees Section</span>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
                <thead>
                    <tr className="bg-gray-50/50 text-gray-500 font-semibold text-xs border-b border-gray-200">
                        <SKUHeader />
                        <th className="p-2 min-w-[90px] text-blue-800 bg-blue-50/30">Ref. Fee (10.5%)</th>
                        <th className="p-2 min-w-[90px] text-blue-800 bg-blue-50/30">Closing</th>
                        <th className="p-2 min-w-[90px] text-blue-800 bg-blue-50/30">Pick & Pack</th>
                        <th className="p-2 min-w-[90px] text-blue-800 bg-blue-50/30">Ship Fee</th>
                        <th className="p-2 min-w-[90px] text-blue-800 bg-blue-50/30">Storage</th>
                        <th className="p-2 min-w-[90px] text-blue-800 bg-blue-50/30 border-l border-blue-100">GST (Fees)</th>
                        <th className="p-2 min-w-[90px] text-blue-800 bg-blue-50/30">GST (Sale)</th>
                        <th className="p-2 min-w-[80px] text-blue-800 bg-blue-50/30 border-l border-blue-100">Returns %</th>
                        <th className="p-2 min-w-[90px] text-blue-800 bg-blue-50/30">Ret. Cost</th>
                        <th className="p-2 min-w-[110px] text-blue-900 font-bold bg-blue-100/50 border-l border-blue-200">TOTAL MKT FEES</th>
                        <th className="p-2 min-w-[90px] text-blue-900 font-bold bg-blue-100/50">MKT FEE %</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                    {products.map(product => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                            <SKUCell product={product} onUpdate={onUpdate} />
                            
                            {/* Calculated Referral Fee */}
                            <td className="p-2">
                                <DisplayCell value={formatCurrency(product.referralFee)} className="bg-gray-100 text-gray-600" />
                            </td>

                            {/* Calculated Closing Fee */}
                            <td className="p-2">
                                <DisplayCell value={formatCurrency(product.fixedClosingFee)} className="bg-gray-100 text-gray-600" />
                            </td>

                            <td className="p-2"><InputCell id={product.id} field="pickAndPackFee" value={product.pickAndPackFee} onUpdate={onUpdate} /></td>
                            <td className="p-2"><InputCell id={product.id} field="shippingWeightFee" value={product.shippingWeightFee} onUpdate={onUpdate} /></td>
                            <td className="p-2"><InputCell id={product.id} field="storageFee" value={product.storageFee} onUpdate={onUpdate} /></td>
                            
                            <td className="p-2 border-l border-blue-100"><DisplayCell value={formatCurrency(product.gstOnMktFee)} className="bg-gray-100 text-gray-500"/></td>
                            <td className="p-2"><DisplayCell value={formatCurrency(product.gstOnSale)} className="bg-gray-100 text-gray-500"/></td>
                            
                            <td className="p-2 border-l border-blue-100"><InputCell id={product.id} field="returnsRatePercent" value={product.returnsRatePercent} prefix="%" onUpdate={onUpdate} /></td>
                            <td className="p-2"><DisplayCell value={formatCurrency(product.returnsCost)} className="bg-gray-100 text-gray-500"/></td>
                            
                            <td className="p-2 bg-blue-50/30 border-l border-blue-100">
                                <DisplayCell value={formatCurrency(product.totalMktFeesPerUnit)} className="bg-blue-100 text-blue-900" bold />
                            </td>
                            <td className="p-2 bg-blue-50/30">
                                <DisplayCell value={formatPercent(product.totalMktFeesPercent)} className="text-blue-900 font-bold" />
                            </td>
                        </tr>
                    ))}
                    {products.length === 0 && <EmptyRow colSpan={12} />}
                </tbody>
            </table>
        </div>
      </div>

      {/* --- SECTION 3: Operations & Take Home (Orange) --- */}
      <div className="bg-white rounded-xl shadow-lg border border-orange-200 overflow-hidden">
        <div className="p-4 bg-orange-50 border-b border-orange-200 flex items-center justify-between">
            <h3 className="font-bold text-orange-900 text-lg">3. Controllable Costs & Final Take-Home</h3>
            <span className="text-xs font-semibold text-orange-700 bg-orange-100 px-2 py-1 rounded">Profit Section</span>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
                <thead>
                    <tr className="bg-gray-50/50 text-gray-500 font-semibold text-xs border-b border-gray-200">
                        <SKUHeader />
                        <th className="p-2 min-w-[90px] text-orange-800 bg-orange-50/30">Est. Mo. Units</th>
                        <th className="p-2 min-w-[100px] text-orange-800 bg-orange-50/30">Mo. Revenue</th>
                        <th className="p-2 min-w-[80px] text-orange-800 bg-orange-50/30 border-l border-orange-100">Ads Cost %</th>
                        <th className="p-2 min-w-[90px] text-orange-800 bg-orange-50/30">Ads / Unit</th>
                        <th className="p-2 min-w-[100px] text-orange-800 bg-orange-50/30 border-l border-orange-100">Mo. Fixed Cost</th>
                        <th className="p-2 min-w-[90px] text-orange-800 bg-orange-50/30">Overhead / Unit</th>
                        <th className="p-2 min-w-[100px] text-orange-900 font-bold bg-orange-100/50 border-l border-orange-200">REAL NET PROFIT</th>
                        <th className="p-2 min-w-[80px] text-orange-900 font-bold bg-orange-100/50">NET %</th>
                        <th className="p-2 min-w-[80px] text-orange-900 font-bold bg-orange-100/50">ROI %</th>
                        <th className="p-2 min-w-[120px] text-orange-950 font-black bg-orange-200/50 border-l border-orange-300">Mo. Take Home</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                    {products.map(product => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                            <SKUCell product={product} onUpdate={onUpdate} />
                            <td className="p-2"><InputCell id={product.id} field="estMonthlySalesUnits" value={product.estMonthlySalesUnits} onUpdate={onUpdate} /></td>
                            <td className="p-2"><DisplayCell value={formatCurrency(product.monthlyRevenue)} className="bg-gray-100 text-gray-500"/></td>
                            
                            <td className="p-2 border-l border-orange-100"><InputCell id={product.id} field="adsCostPercent" value={product.adsCostPercent} prefix="%" onUpdate={onUpdate} /></td>
                            <td className="p-2"><DisplayCell value={formatCurrency(product.adsCostPerUnit)} className="bg-gray-100 text-gray-500"/></td>
                            
                            <td className="p-2 border-l border-orange-100"><InputCell id={product.id} field="monthlyFixedCosts" value={product.monthlyFixedCosts} onUpdate={onUpdate} /></td>
                            <td className="p-2"><DisplayCell value={formatCurrency(product.overheadPerUnit)} className="bg-gray-100 text-gray-500"/></td>
                            
                            <td className="p-2 bg-orange-50/30 border-l border-orange-200">
                                <DisplayCell value={formatCurrency(product.realNetProfit)} className="bg-orange-100 text-orange-800" bold />
                            </td>
                            <td className="p-2 bg-orange-50/30">
                                <div className={`px-2 py-1.5 text-xs font-bold rounded ${product.realNetProfitMargin < 15 ? 'text-red-500' : 'text-green-600'}`}>
                                    {formatPercent(product.realNetProfitMargin)}
                                </div>
                            </td>
                            <td className="p-2 bg-orange-50/30">
                                <DisplayCell value={formatPercent(product.roi)} className="text-gray-600" />
                            </td>
                            <td className="p-2 bg-orange-100/30 border-l border-orange-200">
                                <DisplayCell value={formatCurrency(product.totalMonthlyTakeHome)} className="bg-orange-200 text-orange-950 border-orange-300" bold />
                            </td>
                        </tr>
                    ))}
                    {products.length === 0 && <EmptyRow colSpan={11} />}
                    {products.length > 0 && (
                        <tr className="bg-orange-50 border-t-2 border-orange-200 font-bold text-orange-900">
                            <td className="p-2 sticky left-0 z-20 bg-orange-50 border-r border-orange-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] text-right pr-4">
                                TOTAL
                            </td>
                            <td className="p-2">
                                <DisplayCell value={totalMonthlyUnits} className="bg-transparent" bold />
                            </td>
                            <td className="p-2">
                                <DisplayCell value={formatCurrency(totalMonthlyRevenue)} className="bg-transparent" bold />
                            </td>
                            <td className="p-2 border-l border-orange-200"></td>
                            <td className="p-2"></td>
                            <td className="p-2 border-l border-orange-200">
                                <DisplayCell value={totalMonthlyFixedCosts} className="bg-transparent" bold />
                            </td>
                            <td className="p-2"></td>
                            <td className="p-2 bg-orange-50/30 border-l border-orange-200"></td>
                            <td className="p-2 bg-orange-50/30"></td>
                            <td className="p-2 bg-orange-50/30"></td>
                            <td className="p-2 bg-orange-100/50 border-l border-orange-300">
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