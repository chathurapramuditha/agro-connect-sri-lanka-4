# AgroLink Sri Lanka - Direct Farmer-to-Buyer Platform

Connect directly with Sri Lankan farmers. Buy fresh produce, get AI-powered farming advice, and support local agriculture.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **VS Code** - [Download here](https://code.visualstudio.com/)
- **Git** - [Download here](https://git-scm.com/)

## Getting Started with VS Code

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd agrolink-sri-lanka
```

### Step 2: Open in VS Code

```bash
# Open the project in VS Code
code .
```

Or alternatively:
1. Open VS Code
2. Go to File → Open Folder
3. Select the project directory

### Step 3: Install Dependencies

Open the VS Code terminal (Terminal → New Terminal) and run:

```bash
# Install all dependencies
npm install
```

### Step 4: Start Development Server

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`

## Recommended VS Code Extensions

Install these extensions for the best development experience:

1. **ES7+ React/Redux/React-Native snippets** - Provides useful React snippets
2. **Tailwind CSS IntelliSense** - Autocomplete for Tailwind classes
3. **TypeScript Importer** - Auto import for TypeScript
4. **Prettier - Code formatter** - Code formatting
5. **ESLint** - Code linting
6. **Auto Rename Tag** - Automatically rename paired HTML tags

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Header, Footer components
│   └── ui/             # Shadcn UI components
├── contexts/           # React contexts (Language, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Main application pages
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
├── index.css          # Global styles and design tokens
└── vite-env.d.ts      # TypeScript declarations
```

## Features

- **Multilingual Support**: English, Sinhala, Tamil
- **AI-Powered Features**: Chat assistant, price predictions, recommendations
- **Responsive Design**: Mobile-first responsive design
- **Modern UI**: Built with Tailwind CSS and Shadcn UI
- **Type Safety**: Full TypeScript support

## Development Tips

1. **Hot Reload**: The development server supports hot reload - changes will be reflected instantly
2. **TypeScript**: The project uses TypeScript for type safety
3. **Tailwind CSS**: Use Tailwind classes for styling
4. **Component Architecture**: Create reusable components in the `components/` directory

## Troubleshooting

### Common Issues

1. **Port already in use**: If port 8080 is busy, the dev server will automatically use the next available port
2. **Dependencies not installing**: Try deleting `node_modules` and `package-lock.json`, then run `npm install` again
3. **TypeScript errors**: Make sure all dependencies are installed and restart VS Code

### VS Code Configuration

Create a `.vscode/settings.json` file for project-specific settings:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

## Backend Integration

This project includes a Supabase integration for backend functionality:
- User authentication
- Database management
- Real-time features
- File storage

To enable backend features, connect to Supabase using the green Supabase button in the Lovable interface.

## Deployment

### Using Lovable

1. Visit the [Lovable Project](https://lovable.dev/projects/81c623c6-d35c-4cef-8d16-584c63bd64fe)
2. Click Share → Publish

### Manual Deployment

```bash
# Build the project
npm run build

# The dist/ folder contains the built application
# Deploy the contents of dist/ to your hosting provider
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/81c623c6-d35c-4cef-8d16-584c63bd64fe) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
