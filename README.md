# Vortex Active

![Vortex Active Logo](https://img.shields.io/badge/Vortex%20Active-Internship%20Finder-blueviolet)

> A high-performance internship discovery platform for students

Vortex Active is a modern, responsive web application designed to help students discover and explore internship opportunities across various domains. Built with cutting-edge React technology and featuring a sleek dark-themed interface with neon accents, Vortex Active provides an intuitive platform for students to find their perfect internship match.

## 🚀 Features

### Core Functionality

- **Dynamic Internship Filtering**: Filter opportunities by category, type, duration, and stipend
- **Real-time Search**: Instant search functionality across all internship listings
- **Smart Bookmarking**: Save favorite internships for easy access later
- **User Profiles**: Personalized dashboard with user information and saved opportunities

### User Experience

- **Clean, Modern UI**: Dark-themed interface with vibrant neon accents
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Card-based Layout**: Easy browsing with intuitive card-based presentation
- **Interactive Elements**: Smooth animations and hover effects throughout

### Advanced Features

- **College Detection**: Automatic detection and tracking for BIT Bhilai students
- **Mass Bunk Protocol**: Special features for collective student actions
- **3D City Visualization**: Immersive cityscape background with interactive elements
- **Data-driven**: Real-time data fetching from Google Sheets

## 🛠 Tech Stack

### Frontend Technologies

- **React 18** - Modern component-based UI library
- **Vite** - Lightning-fast build tool and development server
- **React Hooks** - useState, useEffect, useMemo for state management
- **CSS-in-JS** - Inline styling with styled-components approach

### Key Dependencies

- **React Router** - Client-side routing
- **Google Sheets API** - Real-time data fetching
- **Three.js** - 3D visualizations and animations
- **Custom Utilities** - College detection and user tracking

### Development Tools

- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Modern JavaScript** - ES6+ features throughout

## 📦 Project Structure

```
e:\Plans\Intern_finder/
├── public/                          # Static assets
│   ├── angry-thiago-mad.gif        # GIF assets
│   ├── favicon.svg                 # Site favicon
│   └── icons.svg                   # Icon library
├── src/                            # Source code
│   ├── components/                 # React components
│   │   ├── internship/            # Internship-related components
│   │   │   ├── InternshipFinder.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── ThreeInternshipGrid.jsx
│   │   │   └── InternshipCard.jsx
│   │   ├── city/                  # 3D city visualization
│   │   │   ├── StudentCity.jsx
│   │   │   ├── House.jsx
│   │   │   ├── Tree.jsx
│   │   │   └── Tornado.jsx
│   │   ├── Login.jsx              # Authentication
│   │   ├── Dashboard.jsx          # User dashboard
│   │   ├── MassBunkPage.jsx       # Special features
│   │   └── LoadingScreen.jsx      # Loading states
│   ├── data/                      # Static data files
│   │   ├── intern-data.json       # Internship listings
│   │   └── bit_bhilai_variants.json
│   ├── services/                  # API services
│   │   └── dataService.js         # Google Sheets integration
│   ├── utils/                     # Utility functions
│   │   ├── detectCollege.js       # College detection logic
│   │   ├── collegeTracker.js      # User tracking
│   │   └── bitDetection.js        # BIT-specific features
│   ├── App.jsx                    # Main application component
│   ├── main.tsx                   # Application entry point
│   └── index.css                  # Global styles
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Intern_finder
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🔮 Future Roadmap

### Phase 1: Enhanced User Experience

- [ ] **Direct Application System** - Apply to internships directly through the platform
- [ ] **Advanced User Profiles** - Detailed user profiles with skills and preferences
- [ ] **Notification System** - Email and in-app notifications for new opportunities
- [ ] **Resume Builder** - Integrated resume creation and editing tools

### Phase 2: Advanced Features

- [ ] **AI-Powered Recommendations** - Machine learning for personalized internship suggestions
- [ ] **Interview Preparation** - Mock interviews and preparation resources
- [ ] **Company Reviews** - Student reviews and ratings for companies
- [ ] **Progress Tracking** - Track application status and progress

### Phase 3: Community & Analytics

- [ ] **Student Community** - Forums and discussion boards
- [ ] **Analytics Dashboard** - Insights into application trends and success rates
- [ ] **Mentor Matching** - Connect with alumni and industry professionals
- [ ] **Mobile App** - Native mobile applications for iOS and Android

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Sheets API** - For seamless data integration
- **Three.js Community** - For incredible 3D visualization capabilities
- **React Ecosystem** - For powerful and flexible component architecture
- **All Contributors** - For making this project possible

## 📱 Mobile Support

Vortex Active is fully responsive and optimized for mobile devices. The application features:

- **Mobile-First Design**: Seamless experience across all screen sizes
- **Touch-Friendly Interface**: Optimized buttons and gestures for mobile navigation
- **Responsive Grid Layout**: Cards adapt to mobile screen dimensions
- **Mobile Search**: Easy-to-use search functionality on smaller screens

## 📞 Contact

For support, questions, or feature requests:

- **Project Maintainer**: [GrayDinosaur893]
- **Email**: [crdino893@gmail.com]
- **Project Link**: [https://github.com/GrayDinosaur893/Intern_finder](https://github.com/GrayDinosaur893/Intern_finder)

---

**Vortex Active** - Where opportunities meet ambition. 🌟

**Live Demo**: [https://intern_finder.vercel.app](https://intern_finder.vercel.app)
