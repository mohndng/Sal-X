# Sal-X: Your Personal Salary & Expense Tracker

Sal-X is a modern, responsive web application designed to help you effortlessly track your income and expenses. With an intuitive interface and powerful features, managing your personal finances has never been easier.

## ✨ Features

- **Transaction Management:** Easily add, edit, and delete salary and expense transactions.
- **Financial Summary:** Get a clear overview of your total salary, total expenses, and current balance at a glance.
- **Customizable User Profile:** Personalize your experience by updating your name, bio, profile picture, and cover photo. You can also specify your nature of work and salary details.
- **Data Export:** Export your transaction history to a CSV file for your records or further analysis.
- **Dark Mode:** Switch between light and dark themes for comfortable viewing in any lighting condition.
- **PWA Ready:** Install Sal-X as a Progressive Web App (PWA) on your mobile device for a native app-like experience.
- **Responsive Design:** Enjoy a seamless experience across all your devices, from desktops to mobile phones.
- **Local Storage:** Your data is securely saved in your browser's local storage, so you don't have to worry about losing it.

## 🚀 Getting Started

To run this project locally, follow these simple steps:

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/sal-x.git
    cd sal-x
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up your environment variables:**
    - Create a new file named `.env.local` in the root of your project.
    - Add the following line to the file, replacing `YOUR_API_KEY_HERE` with your actual Gemini API key:
      ```
      GEMINI_API_KEY="YOUR_API_KEY_HERE"
      ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```

    The application should now be running on [http://localhost:3000](http://localhost:3000).

## 🛠️ Built With

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
