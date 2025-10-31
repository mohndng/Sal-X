import React, { useState, useMemo, useEffect } from 'react';
import { Transaction, UserProfile } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import useTheme from './hooks/useTheme';
import Header from './components/Header';
import Summary from './components/Summary';
import TransactionForm from './components/TransactionForm';
import TransactionTable from './components/TransactionTable';
import WelcomeScreen from './components/WelcomeScreen';
import LoadingSpinner from './components/LoadingSpinner';
import UserProfilePage from './components/UserProfilePage';
import FeedbackButton from './components/FeedbackButton';
import FeedbackModal from './components/FeedbackModal';
import InstallPWA_Modal from './components/InstallPWA_Modal';

const App: React.FC = () => {
    const [transactions, setTransactions] = useLocalStorage<Transaction[]>('sal-x-transactions', []);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [theme, toggleTheme] = useTheme();
    const [hasEntered, setHasEntered] = useLocalStorage('sal-x-has-entered', false);
    const [isLoading, setIsLoading] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [userProfile, setUserProfile] = useLocalStorage<UserProfile>('sal-x-user-profile', {
        name: 'Sal-X User',
        bio: 'Tracking my finances with Sal-X! A great way to stay on top of my budget.',
        employment: 'Not Specified',
        profilePictureUrl: null,
        coverPhotoUrl: null,
    });
    
    // PWA Install Prompt State
    const [installPrompt, setInstallPrompt] = useState<any>(null);
    const [showInstallModal, setShowInstallModal] = useState(false);
    const [hasSeenInstallPrompt, setHasSeenInstallPrompt] = useLocalStorage('sal-x-seen-install-prompt', false);


    useEffect(() => {
        if (hasEntered) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 1200);
            return () => clearTimeout(timer);
        } else {
            setIsLoading(false);
        }
    }, [hasEntered]);
    
    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setInstallPrompt(e);
            if (!hasSeenInstallPrompt) {
                setShowInstallModal(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, [hasSeenInstallPrompt]);

    const handleInstall = async () => {
        if (!installPrompt) return;
        const result = await installPrompt.prompt();
        console.log(`Install prompt outcome: ${result.outcome}`);
        setInstallPrompt(null);
        setShowInstallModal(false);
    };
    
    const handleCloseInstallModal = () => {
        setShowInstallModal(false);
        setHasSeenInstallPrompt(true);
    };

    const saveTransaction = (transactionData: Omit<Transaction, 'id'>, id?: string) => {
        if (id) {
            setTransactions(prev => prev.map(t => 
                t.id === id ? { id: t.id, ...transactionData } : t
            ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.id.localeCompare(b.id)));
        } else {
            const newTransaction: Transaction = {
                id: crypto.randomUUID(),
                ...transactionData
            };
            setTransactions(prev => [...prev, newTransaction]
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.id.localeCompare(b.id)));
        }
        setEditingTransaction(null);
    };

    const deleteTransaction = (id: string) => {
      setTransactions(prev => prev.filter(t => t.id !== id));
    };
    
    const deleteMultipleTransactions = (ids: string[]) => {
        const idsToDelete = new Set(ids);
        setTransactions(prev => prev.filter(t => !idsToDelete.has(t.id)));
    };

    const startEditing = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEditing = () => {
        setEditingTransaction(null);
    };

    const { totalSalary, totalExpenses, balance } = useMemo(() => {
        let salary = 0;
        let expenses = 0;
        transactions.forEach(t => {
            if (t.type === 'salary') salary += t.amount;
            else expenses += t.amount;
        });
        return { totalSalary: salary, totalExpenses: expenses, balance: salary - expenses };
    }, [transactions]);

    const exportToCsv = () => {
        if (transactions.length === 0) {
            alert("No transactions to export.");
            return;
        }
        const headers = ["Date", "Details", "Salary (PHP)", "Expenses (PHP)", "Balance (PHP)"];
        let csvContent = headers.join(",") + "\n";
        let runningBalance = 0;
        transactions.forEach(t => {
            const isSalary = t.type === 'salary';
            runningBalance += isSalary ? t.amount : -t.amount;
            const row = [
                t.date,
                `"${t.details.replace(/"/g, '""')}"`,
                isSalary ? t.amount.toFixed(2) : "",
                !isSalary ? t.amount.toFixed(2) : "",
                runningBalance.toFixed(2)
            ].join(",");
            csvContent += row + "\n";
        });
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `Sal-X_Export_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    
    if (!hasEntered) {
        return <WelcomeScreen onEnter={() => setHasEntered(true)} />;
    }

    return (
        <>
            {isLoading && <LoadingSpinner />}
            <UserProfilePage 
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                userProfile={userProfile}
                onSave={setUserProfile}
            />
            <FeedbackModal 
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
                userProfile={userProfile}
            />
            <InstallPWA_Modal 
                isOpen={showInstallModal}
                onClose={handleCloseInstallModal}
                onInstall={handleInstall}
            />
            <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white p-4 sm:p-6 lg:p-8 transition-all duration-500 ${isLoading || isProfileOpen || isFeedbackOpen || showInstallModal ? 'blur-sm pointer-events-none' : 'blur-0'}`}>
                <div className="max-w-7xl mx-auto">
                    <Header 
                        theme={theme} 
                        toggleTheme={toggleTheme} 
                        userProfile={userProfile}
                        onProfileClick={() => setIsProfileOpen(true)}
                    />
                    <main>
                        <Summary totalSalary={totalSalary} totalExpenses={totalExpenses} balance={balance} />
                        <TransactionForm 
                            saveTransaction={saveTransaction}
                            editingTransaction={editingTransaction}
                            cancelEdit={cancelEditing}
                            transactions={transactions}
                        />
                        <div className="mt-8">
                            <TransactionTable 
                                transactions={transactions} 
                                deleteTransaction={deleteTransaction}
                                deleteMultipleTransactions={deleteMultipleTransactions}
                                onEdit={startEditing} 
                            />
                        </div>
                        {transactions.length > 0 && (
                          <div className="text-center mt-8">
                            <button
                              onClick={exportToCsv}
                              className="bg-gray-300 dark:bg-gray-700 hover:bg-green-500 dark:hover:bg-green-600 text-gray-800 dark:text-white font-bold py-2 px-4 rounded-lg transition-colors"
                            >
                              <i className="fas fa-file-csv mr-2"></i>Export to CSV
                            </button>
                          </div>
                        )}
                    </main>
                    <footer className="text-center pt-12 pb-4">
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Sal-X v1.0</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Mon4rch</p>
                    </footer>
                </div>
            </div>
            <FeedbackButton onOpen={() => setIsFeedbackOpen(true)} />
        </>
    );
};

export default App;