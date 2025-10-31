# Sal-X: Monorepo

This repository contains the source code for Sal-X, a personal salary and expense tracker. The project is structured as a monorepo, with the frontend and backend code in separate directories.

## 📂 Project Structure

- **`/client`**: Contains the frontend React application built with Vite and TypeScript. See the [client README](./client/README.md) for more details.
- **`/server`**: Contains the backend Node.js application built with Express.js. This server provides a basic API for the frontend.

## 🚀 Getting Started

To run this project locally, you will need to install dependencies and run the development servers for both the client and the server.

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.

### Installation & Development

1.  **Install all dependencies:**
    - This command will install the dependencies for both the client and the server, as well as the root-level development tools.
    ```sh
    npm run install:all
    ```

2.  **Set up your environment variables:**
    - In the `/client` directory, create a `.env.local` file and add your `GEMINI_API_KEY`. See the [client README](./client/README.md) for more details.

3.  **Run the development servers:**
    - This command will start both the frontend and backend servers concurrently.
    ```sh
    npm run dev
    ```
    - The client will be available at `http://localhost:3000`.
    - The server will be running on `http://localhost:3001`.

## 部署

This project is configured for seamless deployment to [Vercel](https://vercel.com/). The `vercel.json` file in the root directory handles the build and routing for both the client and server.
