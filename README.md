# 🎯 Track Aim - Productivity & Focus Management App

A comprehensive Next.js application designed to help users track their goals, manage tasks, maintain focus, and monitor daily progress. Built with modern web technologies and a clean, intuitive interface.

## ✨ Features

### 🎯 Goal Tracking
- **Yearly Goals Management**: Set, track, and manage long-term goals
- **Progress Visualization**: Visual representation of goal completion
- **Goal Status Updates**: Mark goals as completed or in progress

### 📅 Task Management
- **Daily Tasks**: Create and manage tasks for specific dates
- **Scheduled Tasks**: Plan and organize future tasks
- **Task Status**: Track task completion (Pending, In Progress, Completed)
- **Date-based Organization**: Calendar integration for task scheduling

### ⏱️ Focus Tracker
- **Pomodoro Timer**: Customizable focus sessions with break intervals
- **Circular Clock Visualization**: Beautiful radial timer display
- **Audio Notifications**: Sound alerts for session start/end
- **Session Management**: Start, pause, reset, and navigate between sessions

### 📊 Date Tracker
- **Calendar Integration**: Interactive calendar for date selection
- **Daily Progress**: Track activities and progress for specific dates
- **Data Persistence**: Store and retrieve daily tracking information

## 🏗️ Project Structure

```
my-app/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   │   ├── daily-tasks/   # Daily tasks API endpoints
│   │   │   └── scheduled-tasks/ # Scheduled tasks API endpoints
│   │   ├── date-tracker/      # Date tracking page
│   │   ├── focus-tracker/     # Focus timer page
│   │   ├── goal-tracker/      # Goal management page
│   │   ├── task-manager/      # Task management page
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout component
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable components
│   │   ├── ui/               # UI component library
│   │   │   ├── button.tsx    # Button component
│   │   │   ├── calendar.tsx  # Calendar component
│   │   │   ├── CircularClock.jsx # Timer visualization
│   │   │   ├── input.tsx     # Input field component
│   │   │   ├── label.tsx     # Label component
│   │   │   ├── sparkles.tsx  # Animated background
│   │   │   └── YearlyGoals.jsx # Goal management component
│   │   ├── Hero.jsx          # Hero section component
│   │   └── navabar.jsx       # Navigation component
│   ├── lib/                  # Utility libraries
│   │   ├── mongo.ts         # MongoDB connection
│   │   └── utils.ts         # Utility functions
│   └── middleware.ts         # Next.js middleware
├── public/                   # Static assets
│   ├── sounds/              # Audio files
│   │   ├── beep.wav         # Timer completion sound
│   │   └── clock-ticking.wav # Timer tick sound
│   └── logo.jpg             # Application logo
├── package.json              # Dependencies and scripts
├── next.config.ts           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB database (for data persistence)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_public_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, CSS Modules
- **UI Components**: Radix UI, Lucide React Icons
- **Authentication**: Clerk
- **Database**: MongoDB
- **State Management**: React Hooks
- **Animations**: Framer Motion
- **Audio**: Web Audio API

## 📱 Pages & Features

### 🏠 Home Page (`/`)
- Hero section with animated background
- Navigation to all app features
- Modern, responsive design

### 🎯 Goal Tracker (`/goal-tracker`)
- Create yearly goals
- Track progress visually
- Mark goals as completed
- Delete unwanted goals

### 📋 Task Manager (`/task-manager`)
- Create and manage tasks
- Set task status
- Edit task details
- Delete completed tasks

### ⏱️ Focus Tracker (`/focus-tracker`)
- Pomodoro timer (25/5 minute cycles)
- Customizable session lengths
- Audio notifications
- Beautiful circular clock visualization
- Session navigation controls

### 📅 Date Tracker (`/date-tracker`)
- Interactive calendar
- Daily task creation
- Date-specific progress tracking
- Task management by date

## 🔧 API Endpoints

### Daily Tasks
- `GET /api/daily-tasks` - Retrieve daily tasks
- `POST /api/daily-tasks` - Create new daily task
- `PUT /api/daily-tasks/:id` - Update daily task
- `DELETE /api/daily-tasks/:id` - Delete daily task

### Scheduled Tasks
- `GET /api/scheduled-tasks` - Retrieve scheduled tasks
- `POST /api/scheduled-tasks` - Create new scheduled task
- `PUT /api/scheduled-tasks/:id` - Update scheduled task
- `DELETE /api/scheduled-tasks/:id` - Delete scheduled task

## 🎨 Customization

### Styling
- Modify `src/app/globals.css` for global styles
- Update Tailwind configuration for theme changes
- Customize component styles in individual component files

### Audio
- Replace audio files in `public/sounds/` directory
- Supported formats: WAV, MP3, OGG
- Update audio references in focus tracker component

### Components
- All UI components are modular and customizable
- Modify component props for different behaviors
- Add new components in the `src/components/` directory

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
1. Build the project: `npm run build`
2. Start production server: `npm start`
3. Deploy the `out/` directory to your hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
- Check the existing issues in the repository
- Create a new issue with detailed information
- Contact the development team

## 🔮 Future Enhancements

- [ ] Dark mode support
- [ ] Mobile app version
- [ ] Data export/import functionality
- [ ] Advanced analytics and reporting
- [ ] Team collaboration features
- [ ] Integration with external calendar services
- [ ] Offline mode support
- [ ] Advanced notification system

---

**Built with ❤️ using Next.js and modern web technologies**
