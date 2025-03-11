# 🌱 MindBloom

A full-stack wellness application that transforms your mental health journey into an engaging growth experience.

**Live Demo:** [MindBloom Application](http://ec2-3-23-82-189.us-east-2.compute.amazonaws.com/)

## Overview

MindBloom is a wellness application designed to help users track their mental wellbeing through daily mood logging and mindfulness challenges. The application features a plant-based visualization that grows as users complete challenges and maintain streaks, creating an engaging incentive for consistent wellness practices.

## Key Features

- **Mood Tracking** 🎭 - Express yourself with emoji selections and reflective journal entries
- **Wellness Challenges** 🏆 - Engage with daily, weekly, and monthly mindfulness activities
- **Progress Visualization** 🌿 - Watch your progress on your wellness journey
- **Streak Tracking** 🔥 - Maintain consistency with visual tracking of your daily engagement
- **Calendar View** 📅 - Review your historical mood data in an intuitive calendar format
- **Responsive Design** 📱 - Enjoy a seamless experience on both mobile and desktop platforms
- **Secure Authentication** 🔒 - Your wellness journey remains private with JWT-based security

## Technologies

### Frontend
- React
- TypeScript
- React Router
- CSS for responsive styling

### Backend
- Node.js
- Express.js
- PostgreSQL database
- JWT authentication

## Getting Started

### Prerequisites
- Node.js and npm
- PostgreSQL database

### Setup Instructions

1. Clone the repository
   ```
   git clone https://github.com/JRodriguez-Luna/MindBloom.git
   cd MindBloom
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   DATABASE_URL=your_postgresql_connection_string
   PORT=3000
   TOKEN_SECRET=your_jwt_secret_key
   ```

4. Set up the database
   ```
   npm run db:setup
   ```

5. Start the development server
   ```
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000`

## Project Structure

- `/client`: Frontend React application
- `/server`: Backend Express application
- `/database`: Database schemas and sample data

## API Documentation

### Authentication
- `POST /api/auth/sign-up`: Register a new user
- `POST /api/auth/sign-in`: Login existing user

### User Data
- `GET /api/progress/:userId`: Retrieve user progress
- `GET /api/mood-tracking/:userId`: Access user mood data for specific dates
- `POST /api/mood-logs/:userId`: Create a new mood entry

### Challenges
- `GET /api/challenges`: Retrieve all available challenges
- `GET /api/user-challenges/:userId`: Access user-completed challenges
- `POST /api/user-challenges/completion/:userId`: Mark challenges as completed

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request with enhancements or bug fixes.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all contributors who helped develop and test MindBloom
- Icons and imagery sourced from open-source resources

---

**Remember**: Just as plants need consistent care to flourish, your mental well-being thrives with regular attention. MindBloom is here to make that journey both enjoyable and rewarding.
