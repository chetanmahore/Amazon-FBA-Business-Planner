import React, { useState, useMemo, useEffect } from 'react';
import { ProductInput, Product } from './types';
import { calculateMetrics, INITIAL_PRODUCTS, DEFAULT_PRODUCT_TEMPLATE } from './utils';
import { ProductTable } from './components/ProductTable';
import { SummaryCards } from './components/SummaryCards';
import { Charts } from './components/Charts';
import { Calculator, RotateCcw, CheckCircle } from 'lucide-react';

const STORAGE_KEY = 'amazon_fba_calc_data_v1';

const App: React.FC = () => {
  // Initialize state from local storage or default
  const [productInputs, setProductInputs] = useState<ProductInput[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load saved data:', e);
    }
    // Return a deep copy of initial products to avoid reference issues
    return INITIAL_PRODUCTS.map(p => ({...p}));
  });

  // Auto-save data whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(productInputs));
  }, [productInputs]);

  // Calculate detailed metrics for all products whenever inputs change
  const products: Product[] = useMemo(() => {
    return productInputs.map(input => ({
      ...input,
      ...calculateMetrics(input)
    }));
  }, [productInputs]);

  const handleUpdate = (id: string, field: keyof ProductInput, value: number | string) => {
    setProductInputs(prev => prev.map(p => {
      if (p.id !== id) return p;
      return { ...p, [field]: value };
    }));
  };

  const handleAddProduct = () => {
    // Ensure unique ID even if clicked rapidly
    const newId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setProductInputs(prev => [
      ...prev,
      {
        ...DEFAULT_PRODUCT_TEMPLATE,
        id: newId,
        sku: `New Product ${prev.length + 1}`,
      }
    ]);
  };

  const handleDelete = (id: string) => {
    // Removed window.confirm to ensure the action is not blocked by browser settings
    setProductInputs(prev => prev.filter(p => p.id !== id));
  };

  const handleReset = () => {
    // Reset immediately to defaults
    // The useEffect will catch this change and update localStorage automatically
    setProductInputs(INITIAL_PRODUCTS.map(product => ({...product})));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-md">
                <Calculator className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Amazon FBA Business Planner
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
             {/* Auto-save Indicator */}
             <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 shadow-sm">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Auto-saved</span>
             </div>

            {/* Reset Button */}
            <button 
                onClick={handleReset}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors border border-transparent hover:border-red-100"
                title="Reset to default data"
            >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Reset Defaults</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dashboard Summary */}
        <SummaryCards products={products} />

        {/* Charts */}
        <Charts products={products} />

        {/* Product Table */}
        <ProductTable 
            products={products} 
            onUpdate={handleUpdate} 
            onDelete={handleDelete}
            onAdd={handleAddProduct}
        />

        <div className="mt-8 text-center text-xs text-gray-400">
            <p>Calculations provided are estimates based on standard marketplace fee structures (GST 18% on fees, 5% on product). Data is saved automatically.</p>
        </div>

      </main>
    </div>
  );
};

export default App;