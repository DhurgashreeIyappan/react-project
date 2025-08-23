# Property Rental Platform

A modern, vibrant property rental platform built with React.js, featuring a beautiful UI design and comprehensive rental management features.

## 🎨 Design Style

- **Theme**: Modern + Vibrant + Friendly
- **Colors**: 
  - Primary: #FF6B35 (bright orange)
  - Secondary: #4ECDC4 (aqua)
  - Accent: #FFD93D (sun yellow)
  - Background: #F7F8FC (soft white)
- **UI Features**: Gradient property cards, glassmorphism search bar, curved section dividers, smooth animations

## ✨ Features

### 1. User Authentication & Profiles
- JWT-based authentication system
- Two user roles: Owner (list properties) & Renter (book properties)
- Profile management with contact info, profile picture, and rental history
- MongoDB Collection: `users`

### 2. Property Listings Management
- Owners can add, edit, and delete property listings
- Rich property details: title, description, price/month, location, amenities, images
- Card-based display with pagination and advanced filtering
- MongoDB Collection: `properties`

### 3. Advanced Search & Filters
- Location-based search with MongoDB `$text` search
- Price range filtering
- Property type filtering (apartment, villa, studio, house, condo)
- Additional filters: furnished status, pet-friendly, availability date
- Geospatial queries for location-based searches

### 4. Booking & Enquiry System
- Renters can send booking requests and enquiries to owners
- Owners can accept/reject booking requests
- Real-time status updates and notifications
- MongoDB Collections: `bookings` + `messages`

### 5. Review & Rating System
- Renters can leave reviews and star ratings for properties
- Average rating displayed on property cards and detail pages
- MongoDB Collection: `reviews`

## 🚀 Tech Stack

- **Frontend**: React.js 19.1.1
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Authentication**: JWT with jwt-decode
- **Icons**: React Icons
- **Notifications**: React Hot Toast
- **State Management**: React Context API

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── bookings/       # Booking management
│   ├── layout/         # Layout components (Navbar, Footer)
│   ├── properties/     # Property management
│   └── pages/          # Page components
├── context/            # React Context providers
├── App.js             # Main application component
└── index.js           # Application entry point
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd property-rental-platform
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```
   Note: Using `--legacy-peer-deps` due to React 19 compatibility with some packages.

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Tailwind CSS
The project uses a custom Tailwind configuration with:
- Custom color palette matching the design system
- Custom animations and keyframes
- Inter font family integration

### Environment Variables
Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=your_backend_api_url
REACT_APP_MAPBOX_TOKEN=your_mapbox_token
```

## 📱 Responsive Design

The platform is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎯 Key Components

- **Navbar**: Responsive navigation with user role-based menu
- **Hero Section**: Glassmorphism search bar with background patterns
- **Property Cards**: Gradient cards with hover animations
- **Search & Filters**: Advanced filtering system with smooth transitions
- **Booking Management**: Status-based booking workflow
- **Profile System**: Comprehensive user profile management

## 🔒 Security Features

- JWT token-based authentication
- Protected routes for authenticated users
- Role-based access control (Owner/Renter)
- Input validation and sanitization

## 🚧 Development Status

- ✅ Frontend components and UI design
- ✅ Authentication system structure
- ✅ Property management interface
- ✅ Booking system interface
- ✅ Search and filtering system
- ✅ Responsive design implementation
- 🔄 Backend API integration (pending)
- 🔄 Database setup (pending)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Built with ❤️ using React.js and Tailwind CSS**
