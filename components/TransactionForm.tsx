import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType } from '../types';
import ConfirmationDialog from './ConfirmationDialog';
import InfoDialog from './InfoDialog';

interface TransactionFormProps {
  saveTransaction: (transaction: Omit<Transaction, 'id'>, id?: string) => void;
  editingTransaction: Transaction | null;
  cancelEdit: () => void;
  transactions: Transaction[];
}

const TransactionForm: React.FC<TransactionFormProps> = ({ saveTransaction, editingTransaction, cancelEdit, transactions }) => {
    const [amount, setAmount] = useState<string>('');
    const [details, setDetails] = useState('');
    const [type, setType] = useState<TransactionType>('salary');
    const [error, setError] = useState<string>('');
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
    const [dataToSave, setDataToSave] = useState<{ transaction: Omit<Transaction, 'id'>; id?: string } | null>(null);

    const isEditing = !!editingTransaction;

    useEffect(() => {
        if (editingTransaction) {
            setAmount(editingTransaction.amount.toString());
            setDetails(editingTransaction.details);
            setType(editingTransaction.type);
            setError(''); 
        } else {
            setAmount('');
            setDetails('');
            setType('salary');
            setError('');
        }
    }, [editingTransaction]);

    const handleTypeChange = (newType: TransactionType) => {
        setType(newType);
        setDetails(''); // Reset details when type changes
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        
        if (transactions.length === 0 && type === 'expense') {
            setIsInfoDialogOpen(true);
            return;
        }

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            setError('Please enter a valid, positive amount.');
            return;
        }

        // Assign default details if the input is empty
        const finalDetails = details.trim() === ''
            ? (type === 'salary' ? 'Income' : 'Expense')
            : details;
        
        setDataToSave({
            transaction: {
                date: editingTransaction ? editingTransaction.date : new Date().toISOString(),
                type,
                amount: numAmount,
                details: finalDetails,
            },
            id: editingTransaction ? editingTransaction.id : undefined
        });
        setIsConfirmOpen(true);
    };

    const handleConfirmSave = () => {
        if (dataToSave) {
            saveTransaction(dataToSave.transaction, dataToSave.id);
        }
    };

    const handleCancel = () => {
        cancelEdit();
    };

    return (
        <>
            <InfoDialog
                isOpen={isInfoDialogOpen}
                onClose={() => setIsInfoDialogOpen(false)}
                title="First Transaction Rule"
                message={<p>To avoid a negative balance, your first transaction must be a <span className="font-semibold text-green-500 dark:text-green-400">Salary</span> entry. Please add an income source before recording an expense.</p>}
            />
            <ConfirmationDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmSave}
                title={isEditing ? 'Confirm Update' : 'Confirm Save'}
                message={<p>Are you sure you want to {isEditing ? 'update this transaction' : 'add this new transaction'}?</p>}
                confirmButtonText={isEditing ? 'Update' : 'Save'}
            />
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-green-500 dark:text-green-400">{isEditing ? 'Edit Transaction' : 'Add New Transaction'}</h2>
                {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-1">
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Amount (₱)</label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            step="0.01"
                            className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="details" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Details</label>
                        <input
                            type="text"
                            id="details"
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            placeholder={type === 'salary' ? "e.g., Monthly Paycheck" : "e.g., Groceries, Rent"}
                            className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                        />
                    </div>
                    <div className="md:col-span-1 grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => handleTypeChange('salary')}
                            className={`w-full p-2 rounded-md transition font-semibold ${type === 'salary' ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                        >
                            <i className="fas fa-plus mr-2"></i>Salary
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTypeChange('expense')}
                            className={`w-full p-2 rounded-md transition font-semibold ${type === 'expense' ? 'bg-red-500 text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                        >
                        <i className="fas fa-minus mr-2"></i>Expense
                        </button>
                    </div>
                    <div className="md:col-span-4 flex flex-col sm:flex-row gap-2 mt-2">
                        <button
                            type="submit"
                            className="flex-grow w-full p-3 rounded-md transition font-bold text-lg bg-green-600 hover:bg-green-700 text-white shadow-lg"
                        >
                            {isEditing ? 'Update Transaction' : 'Add Transaction'}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="w-full sm:w-auto p-3 px-6 rounded-md transition font-semibold bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-500 text-white"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </>
    );
};

export default TransactionForm;