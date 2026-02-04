# Nawaz Mobiles - Second-Hand Marketplace

A modern, trust-first eCommerce platform for refurbished smartphones, accessories, wearables, and vehicles. Built with Next.js 14, TypeScript, and Supabase.

## 🚀 Features

### Customer Features
- **Global Search** with autosuggest and filters
- **Dynamic Product Browsing** with category-specific attributes
- **Condition Grading System** (A/B/C) with detailed testing information
- **Shopping Cart** with price snapshots
- **Secure Checkout** with guest and account options
- **Order Tracking** and history
- **Vehicle Quote Requests** for cars and bikes
- **Trust Signals**: Warranty badges, testing checklists, return policy

### Admin Features
- **Product Management** with dynamic attributes
- **Bulk CSV Import** for inventory
- **Order Management** with status tracking
- **Inventory Alerts** for low stock
- **Vehicle Inquiry Management**
- **Dashboard** with key metrics

### Technical Features
- **Server-Side Rendering** with Next.js App Router
- **TypeScript** for type safety
- **Supabase** for database, auth, and storage
- **Row Level Security** for data protection
- **SEO Optimized** with meta tags and structured data
- **Responsive Design** mobile-first approach
- **Professional Animations** and micro-interactions

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account ([supabase.com](https://supabase.com))
- Git

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd nawaz_mobiles
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API
3. Copy your project URL and anon key

### 4. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run database migrations

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `supabase/migrations/20260204_initial_schema.sql`
4. Paste and run the SQL

This will create:
- All database tables with proper relationships
- Indexes for performance
- Row Level Security policies
- Sample categories and subcategories
- Attribute definitions for smartphones

### 6. Set up Storage (Optional)

1. In Supabase dashboard, go to Storage
2. Create a new bucket called `product-images`
3. Set it to public
4. Add policy to allow public reads and authenticated uploads

### 7. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
nawaz_mobiles/
├── app/                          # Next.js App Router
│   ├── (shop)/                   # Public shop routes
│   ├── (account)/                # Customer account routes
│   ├── (admin)/                  # Admin panel routes
│   ├── (content)/                # Static content pages
│   ├── api/                      # API routes
│   ├── globals.css               # Global styles & design tokens
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── components/
│   ├── ui/                       # Reusable UI components
│   ├── layout/                   # Layout components
│   ├── product/                  # Product-related components
│   ├── search/                   # Search components
│   ├── filters/                  # Filter components
│   ├── cart/                     # Cart components
│   └── admin/                    # Admin components
├── lib/
│   ├── supabase/                 # Supabase clients
│   ├── hooks/                    # Custom React hooks
│   ├── utils/                    # Utility functions
│   └── types/                    # TypeScript types
├── public/                       # Static assets
├── supabase/
│   └── migrations/               # Database migrations
└── package.json
```

## 🎨 Design System

### Colors
- **Primary**: Blue (`hsl(220, 90%, 56%)`)
- **Accent**: Pink (`hsl(340, 82%, 52%)`)
- **Success**: Green (`hsl(142, 71%, 45%)`)
- **Warning**: Orange (`hsl(38, 92%, 50%)`)
- **Error**: Red (`hsl(0, 84%, 60%)`)

### Typography
- **Display Font**: Poppins (headings)
- **Body Font**: Inter (body text)

### Animations
- Fade in, slide up/down, scale in
- Float, pulse, shimmer, bounce
- Hover effects: lift, scale, glow

## 🔐 Authentication

The app uses Supabase Auth for user management:

- Email/password authentication
- Row Level Security for data protection
- User profiles with addresses
- Guest checkout option

## 📊 Database Schema

### Core Tables
- `users` - User profiles
- `categories` - Product categories
- `subcategories` - Product subcategories
- `attribute_definitions` - Dynamic product attributes
- `products` - Product catalog
- `product_attributes` - Product attribute values
- `product_images` - Product images
- `cart_items` - Shopping cart
- `orders` - Order history
- `order_items` - Order line items
- `vehicle_inquiries` - Vehicle quote requests

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
```

## 📝 Development Workflow

### Adding a New Product

1. Log in to admin panel (to be implemented)
2. Go to Products → New Product
3. Select category and subcategory
4. Fill in product details
5. Add dynamic attributes
6. Upload images
7. Set condition grade and warranty
8. Publish

### Adding a New Subcategory

1. Add subcategory in Supabase dashboard
2. Define attribute_definitions for the subcategory
3. Attributes will automatically appear in product forms

## 🧪 Testing

```bash
# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## 📚 Key Concepts

### Condition Grading
- **Grade A (Like New)**: Minimal wear, battery >90%, 6-month warranty
- **Grade B (Good)**: Visible wear, battery >80%, 3-month warranty
- **Grade C (Fair)**: Noticeable wear, battery >70%, 30-day warranty

### Dynamic Attributes
Products have category-specific attributes defined in `attribute_definitions`. This allows:
- Smartphones to have: brand, model, storage, RAM, color, battery health
- Vehicles to have: make, model, year, kms, fuel type, owner count
- Flexible filtering and display

### Price Snapshots
Cart items store the price at the time of adding to cart, protecting against price changes during checkout.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your own marketplace.

## 🆘 Support

For issues or questions:
1. Check the documentation
2. Review existing issues on GitHub
3. Create a new issue with details

## 🎯 Roadmap

- [ ] Payment gateway integration (Razorpay)
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced search with Algolia
- [ ] Mobile app (React Native)

---

Built with ❤️ using Next.js and Supabase
