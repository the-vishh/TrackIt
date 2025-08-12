# 💰 TrackIt - Smart Expense Tracker

A modern, intelligent expense tracking web application built with HTML, CSS, and JavaScript. TrackIt helps you manage your finances with AI-powered insights, location-based spending alerts, and gamified savings goals.

## ✨ Features

### 🧠 Smart Expense Management
- **Natural Language Entry**: Add expenses by simply describing them
- **AI-Powered Categorization**: Automatic expense categorization using machine learning
- **Receipt Scanning**: Upload receipts for instant expense extraction
- **Predictive Analytics**: Forecast future spending patterns

### 📍 Location-Based Intelligence
- **Spending Zone Alerts**: Get notified when entering high-expense areas
- **Contextual Spending**: Track where and when you spend money
- **Geo-fenced Budgets**: Set location-specific spending limits
- **Weather-Spending Correlation**: Understand how weather affects your spending

### 🎮 Gamification & Motivation
- **Spending Tree**: Visual representation of your financial health
- **Achievement System**: Unlock badges for reaching financial milestones
- **Savings Streaks**: Build and maintain saving habits
- **Community Challenges**: Anonymous comparison with similar users

### 📊 Advanced Analytics
- **Multi-dimensional Tracking**: Time, money, health, and environmental impact
- **Behavioral Insights**: Understand your spending triggers and patterns
- **Custom Reports**: Generate detailed financial reports
- **Export Data**: Download your data in various formats

### 🔔 Smart Notifications
- **Push Notifications**: Real-time alerts for budget limits and goals
- **Proactive Warnings**: Prevent overspending before it happens
- **Personalized Tips**: AI-generated financial advice
- **Scheduled Reminders**: Custom expense and budget reminders

## 🚀 Live Demo

[**Try TrackIt Now**](https://track-it-ashen-eight.vercel.app/)

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Grid & Flexbox
- **Icons**: Lucide Icons
- **Charts**: Chart.js for data visualization
- **Maps**: Google Maps API for location features
- **PWA**: Service Worker for offline functionality
- **Deployment**: Vercel for hosting

## 📁 Project Structure

```
trackit/
├── public/
│   ├── index.html             # Main HTML file
│   ├── trackit.css
│   ├── trackit.js
├── .gitignore
├── LICENSE
├── package.json               # Dependencies
├── package-lock.json          # Lock file
├── vercel.json                # Vercel deployment config
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (for development tools)
- Modern web browser with JavaScript enabled
- Internet connection (for external APIs)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/the-vishh/TrackIt.git
   cd TrackIt
   ```

2. **Install dependencies** (for development tools)
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `config.js` file in the `public/scripts/` directory:
   ```javascript
   const CONFIG = {
     OPENAI_API_KEY: 'your-openai-api-key',
     GOOGLE_MAPS_API_KEY: 'your-google-maps-api-key',
     VAPID_PUBLIC_KEY: 'your-vapid-public-key',
     // Add other API keys here
   };
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or simply open public/index.html in your browser
   ```

## 🔧 Configuration

### API Keys Setup

1. **OpenAI API** (for AI features)
   - Sign up at [OpenAI](https://openai.com)
   - Get your API key from the dashboard
   - Add to your config file

2. **Google Maps API** (for location features)
   - Create a project at [Google Cloud Console](https://console.cloud.google.com)
   - Enable Maps JavaScript API
   - Get your API key

3. **Push Notifications** (for web push)
   - Generate VAPID keys using online tools
   - Add public key to config

### Browser Permissions

The app requires the following permissions:
- **Location**: For spending zone alerts
- **Notifications**: For budget and goal alerts
- **Storage**: For offline functionality

## 🎯 Usage

### Adding Expenses

1. **Quick Add**: Use the floating action button to quickly add expenses
2. **Voice Entry**: Speak your expense ("Spent $15 on coffee at Starbucks")
3. **Receipt Scan**: Take a photo of your receipt for automatic parsing
4. **Manual Entry**: Fill out the detailed expense form

### Setting Budgets

1. Navigate to the Budget section
2. Create category-specific or general budgets
3. Set time periods (weekly, monthly, yearly)
4. Enable smart alerts for overspending

### Viewing Analytics

1. Access the Analytics dashboard
2. View spending trends over time
3. Analyze category breakdowns
4. Get AI-generated insights and recommendations

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow consistent coding style
- Add comments for complex logic
- Test on multiple browsers
- Ensure mobile responsiveness
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Chart.js](https://www.chartjs.org/) for beautiful charts
- [Lucide](https://lucide.dev/) for clean icons
- [OpenAI](https://openai.com/) for AI capabilities
- [Google Maps](https://developers.google.com/maps) for location services

**[⭐ Star this repo](https://github.com/the-vishh/TrackIt)** if you find it helpful!

## 👨‍💻 Author
Made with ❤️ by [@the-vishh](https://github.com/the-vishh)
---

### 📝 Quick Deploy Commands:

```bash
git add .
git commit -m "Update to TrackIt for spending zone alerts"
git push origin main
```
---
