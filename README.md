<div align="center">

  <h1>🚀 Flashbot</h1>
  <p>
    <strong>A lightning-fast, modern support widget and dashboard for your SaaS.</strong>
  </p>

  <p>
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
    <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" /></a>
    <a href="https://ui.shadcn.com"><img src="https://img.shields.io/badge/Shadcn_UI-Radix-black?style=for-the-badge&logo=radix-ui" alt="Shadcn UI" /></a>
    <a href="https://orm.drizzle.team"><img src="https://img.shields.io/badge/Drizzle_ORM-PostgreSQL-C5F74F?style=for-the-badge&logo=postgresql&logoColor=black" alt="Drizzle ORM" /></a>
    <a href="https://www.docker.com"><img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker" alt="Docker" /></a>
  </p>

  <p>
    <a href="#features">Features</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#deployment">Deployment</a> •
    <a href="#tech-stack">Tech Stack</a>
  </p>
</div>

<br />

## ✨ Features

- **⚡ Embeddable Widget**: A lightweight, high-performance support widget you can drop into any website.
- **📊 Admin Dashboard**: Comprehensive dashboard to manage tickets, view analytics, and configure settings.
- **🎨 Modern UI/UX**: Built with **Shadcn UI** and **Tailwind CSS** for a sleek, accessible, and responsive design.
- **🔒 Secure Authentication**: Robust authentication system powered by Scalekit.
- **🗄️ Database Management**: Type-safe database interactions with **Drizzle ORM** and **PostgreSQL**.
- **🐳 Dockerized**: Fully containerized for easy deployment and scalability.
- **🤖 CI/CD Ready**: Automated build and deployment pipelines using **GitHub Actions**.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Deployment**: [Docker](https://www.docker.com/) & [GitHub Actions](https://github.com/features/actions)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Docker (optional, for containerized run)
- PostgreSQL Database

### Installation

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/your-username/flashbot.git
    cd flashbot
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in the root directory and add the following variables:

    ```env
    # Database
    DATABASE_URL="postgres://user:password@host:port/database?sslmode=no-verify"

    # Scalekit (Auth)
    SCALEKIT_ENVIRONMENT_URL="https://flashbot.scalekit.dev"
    SCALEKIT_CLIENT_ID="your-client-id"
    SCALEKIT_CLIENT_SECRET="your-client-secret"
    SCALEKIT_REDIRECT_URI="http://localhost:3000/api/auth/callback"
    SCALEKIT_WEBHOOK_SECRET="your-webhook-secret"

    # AI & Tools
    GEMINI_API_KEY="your-gemini-api-key"
    ZENROWS_API_KEY="your-zenrows-api-key"

    # Security
    JWT_SECRET="your-jwt-secret"
    ```

4.  **Database Migration**:
    Push the schema to your database:

    ```bash
    npm run db:push
    ```

5.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📦 Deployment

This project is optimized for deployment on AWS EC2 using Docker and GitHub Actions.

### Manual Deployment (Docker)

1.  **Build the image**:

    ```bash
    docker build -t flashbot .
    ```

2.  **Run the container**:
    ```bash
    docker run -p 3000:3000 --env-file .env flashbot
    ```

### Automated Deployment (GitHub Actions)

We use GitHub Actions to automatically build and deploy the application to your EC2 instance on every push to `main`.

1.  **Configure Secrets**: Add `EC2_HOST`, `EC2_USER`, and `EC2_KEY` to your repository secrets.
2.  **Push to Main**: The workflow will handle the rest!

## 📂 Project Structure

```bash
.
├── app/                  # Next.js App Router pages
│   ├── api/              # API Routes
│   ├── dashboard/        # Dashboard views
│   └── embed/            # Embeddable widget code
├── components/           # Reusable UI components
├── db/                   # Database schema and client
├── drizzle/              # Migration files
├── lib/                  # Utility functions
├── public/               # Static assets
└── ...
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
