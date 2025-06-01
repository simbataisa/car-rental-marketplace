This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Car Rental Marketplace

A modern, responsive car rental marketplace built with Next.js, featuring a sleek design and comprehensive booking system.

## Features

- 🚗 **Vehicle Search & Filtering** - Advanced search with location, dates, and vehicle type filters
- 📱 **Responsive Design** - Modern UI that works seamlessly across all devices
- 🎨 **Beautiful Interface** - Gradient designs, smooth animations, and intuitive user experience
- 🔒 **Secure Platform** - Built-in security headers and best practices
- ⚡ **Performance Optimized** - Fast loading with image optimization and efficient bundling
- 🌐 **SEO Ready** - Optimized for search engines with proper meta tags

## Tech Stack

- **Framework**: Next.js 15.3.3 with App Router
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **State Management**: Zustand
- **Database**: Supabase (configured)
- **Authentication**: Firebase (configured)
- **Deployment**: Vercel (optimized)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd car-rental-marketplace
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── components/      # Page-specific components
│   ├── search/         # Search page
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # Reusable components
│   └── ui/            # UI component library
└── lib/               # Utilities and configurations
```

## Deployment

This project is optimized for Vercel deployment with:

- ✅ **vercel.json** - Deployment configuration
- ✅ **next.config.ts** - Production optimizations
- ✅ **.vercelignore** - Deployment exclusions
- ✅ **Standalone output** - Optimized serverless functions
- ✅ **Security headers** - Enhanced protection
- ✅ **Image optimization** - WebP/AVIF support

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/car-rental-marketplace)

### Manual Deployment

1. **Via Vercel Dashboard**:
   - Connect your Git repository
   - Vercel will auto-detect Next.js settings
   - Deploy with one click

2. **Via Vercel CLI**:
   ```bash
   npm i -g vercel
   vercel login
   vercel
   ```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Key Features Implementation

- **Search Functionality**: Advanced filtering system in `/search`
- **Modern Design**: Gradient backgrounds, hover effects, and smooth transitions
- **Component Architecture**: Reusable UI components with Radix UI
- **Performance**: Optimized images, fonts, and bundle splitting

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- 📧 Email: support@example.com
- 💬 Issues: [GitHub Issues](https://github.com/your-username/car-rental-marketplace/issues)
- 📖 Documentation: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**Built with ❤️ using Next.js and Vercel**
