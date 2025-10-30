import React, { useState } from 'react';

interface SummaryProps {
  totalSalary: number;
  totalExpenses: number;
  balance: number;
}

const currencyFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
});

const SummaryCard: React.FC<{ title: string; amount: number; icon: string; colorClass: string }> = ({ title, amount, icon, colorClass }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-center space-x-4">
    <div className={`text-3xl p-3 rounded-full ${colorClass}`}>
      <i className={`fa-solid ${icon}`}></i>
    </div>
    <div>
      <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{currencyFormatter.format(amount)}</p>
    </div>
  </div>
);


const Summary: React.FC<SummaryProps> = ({ totalSalary, totalExpenses, balance }) => {
  const [isChartVisible, setIsChartVisible] = useState(false); // Collapsed by default

  const expensePercentage = totalSalary > 0 ? Math.min((totalExpenses / totalSalary) * 100, 100) : 0;
  const hasDataForChart = totalSalary > 0 || totalExpenses > 0;

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Total Salary" amount={totalSalary} icon="fa-arrow-down" colorClass="bg-green-500/20 text-green-500 dark:text-green-400" />
        <SummaryCard title="Total Expenses" amount={totalExpenses} icon="fa-arrow-up" colorClass="bg-red-500/20 text-red-500 dark:text-red-400" />
        <SummaryCard title="Current Balance" amount={balance} icon="fa-wallet" colorClass="bg-blue-500/20 text-blue-500 dark:text-blue-400" />
      </div>

      {hasDataForChart && (
        <div className="mt-6 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
          <button
            onClick={() => setIsChartVisible(!isChartVisible)}
            className="w-full flex justify-between items-center text-left focus:outline-none focus:ring-2 focus:ring-green-500/50 rounded-md p-2 -m-2"
            aria-expanded={isChartVisible}
            aria-controls="breakdown-chart"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Income vs. Expense Breakdown</h3>
            <i className={`fas fa-chevron-down text-gray-500 dark:text-gray-400 transition-transform duration-300 ${isChartVisible ? 'transform rotate-180' : ''}`}></i>
          </button>

          <div
            id="breakdown-chart"
            className={`transition-all duration-500 ease-in-out overflow-hidden ${isChartVisible ? 'max-h-48 mt-4' : 'max-h-0 mt-0'}`}
          >
            <div className="space-y-4">
              {/* Salary Bar */}
              <div>
                <div className="flex justify-between items-center mb-1 text-sm">
                  <span className="font-medium text-gray-600 dark:text-gray-300">Total Salary</span>
                  <span className="font-bold text-green-500 dark:text-green-400">{currencyFormatter.format(totalSalary)}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `100%` }}></div>
                </div>
              </div>

              {/* Expense Bar */}
              <div>
                <div className="flex justify-between items-center mb-1 text-sm">
                  <span className="font-medium text-gray-600 dark:text-gray-300">Total Expenses</span>
                  <span className="font-bold text-red-500 dark:text-red-400">{currencyFormatter.format(totalExpenses)}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${expensePercentage}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Summary;