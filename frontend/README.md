# AgroLink Sri Lanka 🌾

A modern agricultural marketplace platform connecting farmers directly with buyers across Sri Lanka. Built with React, TypeScript, and Supabase.

## 🌟 Features

### For Farmers
- **Product Management**: List and manage farm produce with detailed descriptions
- **Order Tracking**: Monitor incoming orders and manage deliveries
- **Direct Sales**: Sell directly to buyers without intermediaries
- **Blog Platform**: Share farming knowledge and experiences
- **Profile Management**: Showcase farm details and build reputation

### For Buyers
- **Marketplace**: Browse fresh produce from local farmers
- **Direct Ordering**: Place orders directly with farmers
- **Order History**: Track purchase history and delivery status
- **Review System**: Rate and review farmers and products
- **Blog Interaction**: Read and share agricultural insights

### For Administrators
- **User Management**: Manage farmer and buyer accounts
- **Content Moderation**: Oversee blog posts and platform content
- **Analytics Dashboard**: Monitor platform usage and performance
- **Communication Tools**: Send notifications and updates to users

## 👤 Default Admin Account

To access the admin dashboard:

1. Go to `/register`
2. Click the **Admin** tab
3. Create admin account with:
   - **Email**: admin@agrolink.lk
   - **Password**: admin123
   - **Name**: System Administrator
4. After registration, login at `/login` using the Admin tab

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/ui, Radix UI
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Routing**: React Router
- **Icons**: Lucide React
- **Build Tool**: Vite
- **State Management**: React Query
- **Multi-language**: Context-based i18n

## 🌐 Multi-language Support

The platform supports:
- **English** (default)
- **Sinhala** (සිංහල)
- **Tamil** (தமிழ்)

Language can be switched using the language selector in the header.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)
- **VS Code** (recommended) - [Download here](https://code.visualstudio.com/)

## 🛠️ Getting Started

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd agrolink-sri-lanka
```

### Step 2: Install Dependencies

```bash
# Install all dependencies
npm install
```

### Step 3: Start Development Server

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Step 4: Set Up Admin Account

1. Open the application in your browser
2. Navigate to `/register`
3. Click the **Admin** tab
4. Create the admin account as described above

## 🗄️ Database Schema

The application uses Supabase with the following main tables:
- **profiles** - User profiles (farmers, buyers, admins)
- **products** - Agricultural products listed by farmers
- **orders** - Purchase orders between buyers and farmers
- **reviews** - Product and farmer reviews  
- **product_categories** - Product categorization

Row Level Security (RLS) is enabled for data protection.

## 📱 User Roles & Access

### Farmers
- Create and manage product listings
- View and manage incoming orders
- Write blog posts about farming
- Update profile and farm information

### Buyers  
- Browse marketplace and search products
- Place orders with farmers
- Write reviews and ratings
- Create blog posts about experiences

### Administrators
- Manage all users and content
- Access analytics and reports
- Moderate blog posts and reviews
- Send communications to users

## 💻 Development

### Recommended VS Code Extensions

1. **ES7+ React/Redux/React-Native snippets** - React snippets
2. **Tailwind CSS IntelliSense** - Tailwind autocomplete
3. **TypeScript Importer** - Auto imports
4. **Prettier - Code formatter** - Code formatting
5. **ESLint** - Code linting
6. **Auto Rename Tag** - HTML tag renaming

### Available Scripts

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

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Header, Footer components  
│   └── ui/             # Shadcn UI components
├── contexts/           # React contexts (Language, etc.)
├── hooks/              # Custom React hooks
├── integrations/       # Supabase integration
├── lib/                # Utility functions
├── pages/              # Application pages
├── App.tsx            # Main app component
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## 🔐 Authentication & Security

- **Supabase Auth**: Email/password authentication
- **Row Level Security (RLS)**: Database-level security policies  
- **Role-based Access**: Different permissions per user type
- **Email Verification**: Optional email confirmation

## 🚀 Deployment

### Using Lovable Platform (Recommended)

1. Visit the [Lovable Project](https://lovable.dev/projects/81c623c6-d35c-4cef-8d16-584c63bd64fe)
2. Click Share → Publish
3. Optional: Connect custom domain in Project Settings

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy the dist/ folder to your hosting provider
# (Vercel, Netlify, etc.)
```

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**: Dev server will auto-select available port
2. **Dependencies**: Delete `node_modules` and reinstall if issues occur
3. **TypeScript errors**: Restart VS Code or run `npm run build`
4. **Login issues**: Ensure admin account is created via registration form

### Database Issues

- Verify Supabase connection in integration settings
- Check RLS policies if data access fails
- Confirm user roles are set correctly

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)  
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 Development Guidelines

- Use TypeScript for type safety
- Follow React best practices
- Use Tailwind CSS for styling (avoid custom CSS)
- Implement proper error handling
- Test across different user roles

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Supabase for backend infrastructure
- Shadcn/ui for component library
- Lucide React for icons
- Sri Lankan farming community

---

**Made with ❤️ for Sri Lankan Agriculture**
