import React, { useState, useMemo, useEffect } from 'react';
import { Transaction } from '../types';
import ConfirmationDialog from './ConfirmationDialog';

interface TransactionTableProps {
  transactions: Transaction[];
  deleteTransaction: (id: string) => void;
  deleteMultipleTransactions: (ids: string[]) => void;
  onEdit: (transaction: Transaction) => void;
}

const currencyFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
});

type SortKey = keyof Transaction | 'balance';

interface SortConfig {
  key: SortKey;
  direction: 'ascending' | 'descending';
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, deleteTransaction, deleteMultipleTransactions, onEdit }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'date', direction: 'descending' });
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleteConfirmOpen, setIsBulkDeleteConfirmOpen] = useState(false);
  const [isHistoryVisible, setIsHistoryVisible] = useState(true);

  useEffect(() => {
    // Clear selection when the underlying transaction list changes to avoid stale selections
    setSelectedIds([]);
  }, [transactions]);

  const transactionsWithBalance = useMemo(() => {
    let runningBalance = 0;
    const sortedByDate = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.id.localeCompare(b.id));
    
    const transactionsMap = new Map(sortedByDate.map(t => {
        runningBalance += t.type === 'salary' ? t.amount : -t.amount;
        return [t.id, { ...t, balance: runningBalance }];
    }));
    
    return transactions.map(t => transactionsMap.get(t.id)!);
  }, [transactions]);

  const sortedTransactions = useMemo(() => {
    let sortableItems = [...transactionsWithBalance];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    }
    return sortableItems;
  }, [transactionsWithBalance, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const handleMobileSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [key, direction] = e.target.value.split('-');
    setSortConfig({
      key: key as SortKey,
      direction: direction as 'ascending' | 'descending',
    });
  };

  const handleConfirmDelete = () => {
    if (transactionToDelete) {
        deleteTransaction(transactionToDelete.id);
    }
  };

  const handleConfirmBulkDelete = () => {
    deleteMultipleTransactions(selectedIds);
    setSelectedIds([]);
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(sortedTransactions.map(t => t.id));
    } else {
      setSelectedIds([]);
    }
  };
  
  const isAllSelected = selectedIds.length === sortedTransactions.length && sortedTransactions.length > 0;

  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) {
      return <i className="fas fa-sort text-gray-400 dark:text-gray-600 ml-2 opacity-50"></i>;
    }
    if (sortConfig.direction === 'ascending') {
      return <i className="fas fa-sort-up text-green-500 dark:text-green-400 ml-2"></i>;
    }
    return <i className="fas fa-sort-down text-green-500 dark:text-green-400 ml-2"></i>;
  };

  const SortableHeader: React.FC<{ sortKey: SortKey; label: string; className?: string }> = ({ sortKey, label, className }) => {
    const getSortTooltip = () => {
      if (sortConfig.key !== sortKey) {
        return `Sort by ${label}`;
      }
      if (sortConfig.direction === 'ascending') {
        return `Sort descending by ${label}`;
      }
      return `Sort ascending by ${label}`;
    };

    return (
      <th className={`p-3 text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider ${className}`}>
        <button 
          onClick={() => requestSort(sortKey)} 
          className={`flex items-center hover:text-gray-900 dark:hover:text-white transition-colors w-full ${className?.includes('text-right') ? 'justify-end' : ''}`}
          title={getSortTooltip()}
        >
          {label} {getSortIcon(sortKey)}
        </button>
      </th>
    );
  };

  return (
    <>
      <ConfirmationDialog
        isOpen={!!transactionToDelete}
        onClose={() => setTransactionToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message={<> <p>Are you sure you want to permanently delete this transaction?</p> {transactionToDelete && ( <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-900/50 rounded-md border border-gray-200 dark:border-gray-700 text-sm"> <p className="font-semibold break-words">{transactionToDelete.details}</p> <p className="text-gray-500 dark:text-gray-400">{new Date(transactionToDelete.date).toLocaleDateString()}</p> <p className={`font-bold ${transactionToDelete.type === 'salary' ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}> {currencyFormatter.format(transactionToDelete.amount)} </p> </div> )} <p className="mt-4 text-red-500 dark:text-red-400 font-semibold"><i className="fas fa-exclamation-triangle mr-2"></i>This action cannot be undone.</p> </>}
        confirmButtonText="Delete"
        confirmButtonColor="bg-red-600 hover:bg-red-700 focus:ring-red-500"
      />
      <ConfirmationDialog
        isOpen={isBulkDeleteConfirmOpen}
        onClose={() => setIsBulkDeleteConfirmOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Confirm Bulk Deletion"
        message={<> <p>Are you sure you want to permanently delete <span className="font-bold text-gray-900 dark:text-white">{selectedIds.length}</span> selected transaction(s)?</p> <p className="mt-4 text-red-500 dark:text-red-400 font-semibold"><i className="fas fa-exclamation-triangle mr-2"></i>This action cannot be undone.</p> </>}
        confirmButtonText={`Delete ${selectedIds.length} Items`}
        confirmButtonColor="bg-red-600 hover:bg-red-700 focus:ring-red-500"
      />
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
        <button
            onClick={() => setIsHistoryVisible(!isHistoryVisible)}
            className="w-full flex justify-between items-center text-left focus:outline-none focus:ring-2 focus:ring-green-500/50 rounded-md p-2 -m-2 mb-2"
            aria-expanded={isHistoryVisible}
            aria-controls="history-content"
          >
            <h2 className="text-2xl font-semibold text-green-500 dark:text-green-400">History</h2>
            <i className={`fas fa-chevron-down text-gray-500 dark:text-gray-400 transition-transform duration-300 ${isHistoryVisible ? 'transform rotate-180' : ''}`}></i>
        </button>

        <div
            id="history-content"
            className={`transition-all duration-500 ease-in-out overflow-hidden ${isHistoryVisible ? 'max-h-[5000px] mt-4' : 'max-h-0 mt-0'}`}
          >
            {transactions.length === 0 ? (
              <div className="text-center py-16 text-gray-500 dark:text-gray-500">
                <svg 
                  className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
                <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">No Transactions Found</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Get started by adding your first salary or expense above.</p>
              </div>
            ) : (
              <>
                <div className="md:hidden mb-4">
                  <label htmlFor="sort-select" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Sort by</label>
                  <select id="sort-select" value={`${sortConfig.key}-${sortConfig.direction}`} onChange={handleMobileSortChange} className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition" >
                    <option value="date-descending">Date (Newest)</option>
                    <option value="date-ascending">Date (Oldest)</option>
                    <option value="amount-descending">Amount (Highest)</option>
                    <option value="amount-ascending">Amount (Lowest)</option>
                    <option value="details-ascending">Details (A-Z)</option>
                    <option value="details-descending">Details (Z-A)</option>
                    <option value="type-ascending">Type (Expense/Salary)</option>
                    <option value="type-descending">Type (Salary/Expense)</option>
                    <option value="balance-descending">Balance (Highest)</option>
                    <option value="balance-ascending">Balance (Lowest)</option>
                  </select>
                </div>

                <div className="overflow-x-auto hidden md:block">
                  <table className="w-full text-left min-w-[760px]">
                    <thead className="border-b-2 border-gray-200 dark:border-gray-700">
                      <tr>
                        <th className="p-3 w-12 text-center">
                          <input type="checkbox" className="form-checkbox h-5 w-5 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded text-green-500 focus:ring-green-500/50" onChange={handleSelectAll} checked={isAllSelected} aria-label="Select all transactions" title="Select all visible transactions" />
                        </th>
                        <SortableHeader sortKey="date" label="Date" />
                        <SortableHeader sortKey="details" label="Details" />
                        <SortableHeader sortKey="type" label="Type" />
                        <SortableHeader sortKey="amount" label="Salary" className="text-right" />
                        <SortableHeader sortKey="amount" label="Expenses" className="text-right" />
                        <SortableHeader sortKey="balance" label="Balance" className="text-right" />
                        <th className="p-3 text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedTransactions.map((t) => (
                        <tr key={t.id} className={`border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${selectedIds.includes(t.id) ? 'bg-blue-100 dark:bg-blue-900/50' : ''}`}>
                          <td className="p-3 text-center">
                            <input type="checkbox" className="form-checkbox h-5 w-5 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded text-green-500 focus:ring-green-500/50" checked={selectedIds.includes(t.id)} onChange={() => handleSelectOne(t.id)} aria-label={`Select transaction for ${t.details}`} title="Select this transaction" />
                          </td>
                          <td className="p-3 whitespace-nowrap text-gray-600 dark:text-gray-400">{new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                          <td className="p-3 text-gray-900 dark:text-white max-w-xs truncate" title={t.details}>{t.details}</td>
                          <td className={`p-3 whitespace-nowrap capitalize font-medium ${t.type === 'salary' ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>{t.type}</td>
                          <td className={`p-3 text-right font-medium whitespace-nowrap ${t.type === 'salary' ? 'text-green-500 dark:text-green-400' : 'text-gray-500'}`}>{t.type === 'salary' ? currencyFormatter.format(t.amount) : '—'}</td>
                          <td className={`p-3 text-right font-medium whitespace-nowrap ${t.type === 'expense' ? 'text-red-500 dark:text-red-400' : 'text-gray-500'}`}>{t.type === 'expense' ? currencyFormatter.format(t.amount) : '—'}</td>
                          <td className="p-3 text-right font-bold whitespace-nowrap text-blue-500 dark:text-blue-400">{currencyFormatter.format(t.balance)}</td>
                          <td className="p-3 text-center whitespace-nowrap">
                            <button onClick={() => onEdit(t)} className="text-gray-400 dark:text-gray-500 hover:text-green-500 dark:hover:text-green-400 transition-colors px-2" aria-label={`Edit transaction for ${t.details}`} title="Edit transaction"><i className="fas fa-pencil-alt"></i></button>
                            <button onClick={() => setTransactionToDelete(t)} className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors px-2" aria-label={`Delete transaction for ${t.details}`} title="Delete transaction"><i className="fas fa-trash-alt"></i></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="md:hidden space-y-3">
                  {sortedTransactions.map((t) => (
                    <div key={t.id} className={`bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700 transition-colors ${selectedIds.includes(t.id) ? 'bg-blue-100 border-blue-300 dark:bg-blue-900/50 dark:border-blue-700' : ''}`}>
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-start gap-3 flex-grow">
                          <input type="checkbox" className="form-checkbox h-5 w-5 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded text-green-500 focus:ring-green-500/50 mt-1" checked={selectedIds.includes(t.id)} onChange={() => handleSelectOne(t.id)} aria-label={`Select transaction for ${t.details}`} title="Select this transaction" />
                          <span className="font-semibold text-gray-900 dark:text-white break-words flex-grow">{t.details}</span>
                        </div>
                        <span className={`font-bold text-lg whitespace-nowrap ${t.type === 'salary' ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                          {t.type === 'salary' ? '+' : '−'}{currencyFormatter.format(t.amount)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-3 text-sm">
                        <span className="text-gray-500 dark:text-gray-400">{new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <div className="text-right">
                          <span className="block text-gray-500 dark:text-gray-400 text-xs">Balance</span>
                          <span className="font-semibold text-blue-500 dark:text-blue-400">{currencyFormatter.format(t.balance)}</span>
                        </div>
                      </div>
                      <div className="flex justify-end items-center mt-3 border-t border-gray-200 dark:border-gray-600 pt-2 gap-2">
                        <button onClick={() => onEdit(t)} className="text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors px-2 py-1 text-sm rounded" aria-label={`Edit transaction for ${t.details}`} title="Edit transaction">
                          <i className="fas fa-pencil-alt mr-1"></i> Edit
                        </button>
                        <button onClick={() => setTransactionToDelete(t)} className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors px-2 py-1 text-sm rounded" aria-label={`Delete transaction for ${t.details}`} title="Delete transaction">
                          <i className="fas fa-trash-alt mr-1"></i> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 shadow-lg z-40 animate-slide-in-up">
          <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
            <span className="font-semibold text-gray-900 dark:text-white">{selectedIds.length} item(s) selected</span>
            <div className="flex gap-2">
              <button onClick={() => setSelectedIds([])} className="px-4 py-2 rounded-md font-semibold bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white transition-colors" title="Deselect all transactions">
                Cancel
              </button>
              <button onClick={() => setIsBulkDeleteConfirmOpen(true)} className="px-4 py-2 rounded-md font-semibold text-white transition-colors bg-red-600 hover:bg-red-700" title="Delete all selected transactions">
                <i className="fas fa-trash-alt mr-2"></i>Delete Selected
              </button>
            </div>
          </div>
          <style>{`
            @keyframes slide-in-up {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
            }
            .animate-slide-in-up {
              animation: slide-in-up 0.3s ease-out forwards;
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default TransactionTable;