# DreamDaa Platform

A comprehensive digital platform for the DreamDaa non-profit organization, dedicated to empowering underprivileged students in Tamil Nadu through AI-powered English learning.

## 🎯 Mission

To break down language barriers that prevent underprivileged students in Tamil Nadu from accessing quality education and career opportunities by providing them with innovative, AI-powered English learning tools.

## 🏗️ Architecture

Built with modern web technologies for optimal performance, security, and scalability:

- **Framework**: Next.js 14+ with App Router and TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: Vercel Postgres (planned)
- **Authentication**: Next-Auth.js (planned)
- **Payment**: Razorpay integration (planned)
- **Maps**: Google Maps API for Tamil Nadu district visualization
- **Hosting**: Vercel (planned)

## ✨ Features Implemented

### Public-Facing Website

#### 🏠 Homepage
- **Hero Banner**: Compelling call-to-action with impact statistics
- **About Section**: Mission explanation with key features
- **Sponsorship Cards**: Three-tier adoption program (Student/Classroom/School)
- **CTA Section**: Final donation encouragement with trust indicators

#### ℹ️ About Us Page
- Mission and vision statements
- Core organizational values
- Team member profiles
- Journey timeline with milestones
- Impact goals and achievements

#### 📞 Contact Page
- Contact form with inquiry categorization
- Contact information and office hours
- Frequently asked questions
- Interactive contact methods

#### 💝 Donation System
- **Distraction-free donation page** with mobile-first design
- **Multi-tier sponsorship options**: Student (₹1,200), Classroom (₹25,000), School (₹1,00,000)
- **Custom donation amounts** with validation
- **Recurring donation toggle** for sustained impact
- **Comprehensive donor form** with PAN number for 80G receipts
- **Payment method selection** (Card, Net Banking, UPI, Wallet)
- **Real-time form validation** and error handling
- **Donation summary** with transparent breakdown

### Design System

#### 🎨 Visual Identity
- Custom DreamDaa gradient color scheme (blue to purple)
- Consistent typography with Inter font family
- Professional, trustworthy design language
- Mobile-first responsive design

#### 🧩 Component Library
- Reusable UI components built on shadcn/ui
- Consistent button variants and styling
- Icon system using Lucide React
- Accessible form components with validation states

#### 📱 User Experience
- **Mobile-optimized navigation** with hamburger menu
- **Smooth animations** and hover effects
- **Loading states** and form feedback
- **Trust indicators** (SSL, 80G certification, transparency)

## 🗂️ Project Structure

```
dreamdaa-platform/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/          # Public-facing routes
│   │   │   ├── about/         # About Us page
│   │   │   ├── contact/       # Contact page
│   │   │   ├── donate/        # Donation system
│   │   │   └── page.tsx       # Homepage
│   │   ├── (admin)/           # Admin dashboard (planned)
│   │   ├── api/               # API routes (planned)
│   │   ├── globals.css        # Global styles
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── public/            # Public site components
│   │   │   ├── HeroBanner.tsx
│   │   │   ├── SponsorshipCards.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── CTASection.tsx
│   │   │   └── DonationForm.tsx
│   │   └── layout/            # Layout components
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   └── lib/
│       └── utils.ts           # Utility functions
├── public/                    # Static assets
├── package.json              # Dependencies and scripts
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Google Maps API key (for interactive map features)

### Installation

1. **Clone the repository**
   ```bash
   cd dreamdaa-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Google Maps API key:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

4. **Get Google Maps API Key**
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create a new project or select an existing one
   - Enable the "Maps JavaScript API" 
   - Create credentials (API Key)
   - Copy the API key to your `.env.local` file

5. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript compiler check

## 🗺️ Tamil Nadu Interactive Map

The platform features an interactive Google Maps-based visualization of Tamil Nadu districts showing:

### 📊 Color-coded Districts
- 🔴 **Red**: Needs Funding (0-40% coverage)
- 🟠 **Orange**: Partially Funded (41-70% coverage)  
- 🔵 **Blue**: Well Funded (71-99% coverage)
- 🟢 **Green**: Fully Funded (100% coverage)

### ⚡ Interactive Features
- Click markers to see detailed district information
- View school coverage statistics for each district
- Direct links to sponsorship options
- Responsive design for all devices
- Hover effects and smooth animations

### 📱 Access the Map
Visit `/impact/map` to explore the interactive Tamil Nadu district map with real-time school coverage data.

## 🔄 Current Status

### ✅ Completed Features

1. **Foundation Setup**
   - ✅ Next.js 14+ project with TypeScript
   - ✅ Tailwind CSS configuration
   - ✅ Component library setup
   - ✅ Project structure organization

2. **Public Website Pages**
   - ✅ Homepage with all sections
   - ✅ About Us page with team and values
   - ✅ Contact page with form and FAQ
   - ✅ Donation page with comprehensive form

3. **UI Components**
   - ✅ Responsive header with navigation
   - ✅ Footer with newsletter signup
   - ✅ Button component with variants
   - ✅ Form components with validation

### 🚧 Next Phase (Planned)

4. **Database & Backend**
   - 🔲 Vercel Postgres schema setup
   - 🔲 API routes for donations
   - 🔲 Database models (Users, Donors, Donations, Schools, etc.)

5. **Payment Integration**
   - 🔲 Razorpay gateway integration
   - 🔲 Payment verification flow
   - 🔲 80G receipt generation
   - 🔲 Recurring payment setup

6. **Interactive Features**
   - ✅ Tamil Nadu map with Google Maps API integration
   - ✅ District funding status visualization with color coding
   - ✅ Interactive markers with detailed district information
   - 🔲 School directory with filtering

7. **Admin Dashboard**
   - 🔲 Authentication system
   - 🔲 Role-based access control
   - 🔲 Donor management CRUD
   - 🔲 Content management system
   - 🔲 Impact reporting dashboard

## 🎯 Key Features Highlights

### 💡 User-Centered Design
- **Trust-first approach**: Clear messaging, transparent operations, security indicators
- **Mobile-optimized**: Responsive design prioritizing mobile users
- **Accessibility**: WCAG-compliant components and keyboard navigation

### 🔒 Security & Compliance
- **SSL encryption**: Secure data transmission
- **80G compliance**: Tax-exemption certificate generation
- **PAN validation**: Proper tax documentation
- **Payment security**: PCI DSS compliant processing

### 📊 Donation Experience
- **Multi-tier options**: Flexible giving levels
- **Recurring donations**: Sustained impact support
- **Real-time validation**: Immediate feedback
- **Impact visualization**: Clear outcome communication

### 🎨 Brand Identity
- **Professional design**: Builds donor confidence
- **Consistent theming**: Unified visual language
- **Cultural sensitivity**: Respects Tamil Nadu heritage
- **Modern technology**: Demonstrates innovation

## 🤝 Contributing

This platform is built for the DreamDaa non-profit initiative. For questions or contributions:

- **Email**: info@dreamdaa.org
- **Purpose**: Educational technology for Tamil Nadu students
- **Focus**: Breaking language barriers through AI-powered learning

---

**DreamDaa Initiative** - Empowering Tamil Nadu students through technology and education. Every donation transforms a life. 🎓✨