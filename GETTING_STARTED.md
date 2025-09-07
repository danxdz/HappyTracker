# HappyTracker - Getting Started Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- React Native development environment set up
- PostgreSQL database access
- Supabase account for auth/storage

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd happytracker

# Install mobile dependencies
cd mobile
npm install

# Install backend dependencies
cd ../backend
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npm run db:migrate

# Start development servers
npm run dev
```

---

## 📱 Mobile App Setup

### Vite + React (Web Dashboard)
```bash
# Initialize Vite project
npm create vite@latest happytracker-web --template react-ts
cd happytracker-web

# Install required dependencies
npm install @reduxjs/toolkit react-redux
npm install react-router-dom
npm install tailwindcss @headlessui/react
npm install @supabase/supabase-js
npm install lucide-react
```

### React Native with Expo (Mobile App)
```bash
# Initialize new Expo project
npx create-expo-app happytracker-mobile --template blank-typescript
cd happytracker-mobile

# Install required dependencies
npm install @react-navigation/native @react-navigation/stack
npm install @reduxjs/toolkit react-redux
npm install expo-camera expo-media-library expo-sensors
npm install @supabase/supabase-js
npm install react-native-elements react-native-vector-icons
```

### Project Structure
```
mobile/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── AuthModule.ts
│   │   │   ├── AuthScreen.tsx
│   │   │   └── AuthService.ts
│   │   ├── health/
│   │   │   ├── HealthModule.ts
│   │   │   ├── MealLogger.tsx
│   │   │   ├── WaterTracker.tsx
│   │   │   └── HealthService.ts
│   │   ├── avatar/
│   │   │   ├── AvatarModule.ts
│   │   │   ├── AvatarRenderer.tsx
│   │   │   ├── WellnessCalculator.ts
│   │   │   └── WorldManager.ts
│   │   └── social/
│   │       ├── SocialModule.ts
│   │       ├── FriendManager.tsx
│   │       ├── ChallengeManager.tsx
│   │       └── SocialService.ts
│   ├── components/
│   │   ├── common/
│   │   ├── health/
│   │   └── avatar/
│   ├── screens/
│   │   ├── Auth/
│   │   ├── Health/
│   │   ├── Avatar/
│   │   └── Social/
│   ├── services/
│   │   ├── api.ts
│   │   ├── storage.ts
│   │   └── auth.ts
│   └── utils/
│       ├── constants.ts
│       ├── helpers.ts
│       └── types.ts
├── assets/
│   ├── images/
│   ├── fonts/
│   └── icons/
└── package.json
```

---

## 🖥️ Backend Setup

### Node.js with Express
```bash
# Initialize new Node.js project
mkdir happytracker-backend
cd happytracker-backend
npm init -y

# Install required dependencies
npm install express cors helmet morgan
npm install @supabase/supabase-js
npm install pg prisma
npm install joi bcryptjs jsonwebtoken
npm install redis ioredis
npm install swagger-ui-express swagger-jsdoc
```

### Project Structure
```
backend/
├── src/
│   ├── auth/
│   │   ├── authController.ts
│   │   ├── authService.ts
│   │   └── authMiddleware.ts
│   ├── health/
│   │   ├── healthController.ts
│   │   ├── healthService.ts
│   │   └── healthValidation.ts
│   ├── avatar/
│   │   ├── avatarController.ts
│   │   ├── avatarService.ts
│   │   └── wellnessCalculator.ts
│   ├── social/
│   │   ├── socialController.ts
│   │   ├── socialService.ts
│   │   └── friendManager.ts
│   ├── shared/
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   ├── logger.ts
│   │   └── errorHandler.ts
│   └── app.ts
├── migrations/
│   ├── 001_create_users.sql
│   ├── 002_create_health_logs.sql
│   ├── 003_create_avatars.sql
│   └── 004_create_social_tables.sql
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── package.json
```

---

## 🗄️ Database Setup

### PostgreSQL Configuration
```sql
-- Create database
CREATE DATABASE happytracker;

-- Create user
CREATE USER happytracker_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE happytracker TO happytracker_user;

-- Connect to database
\c happytracker;

-- Run migrations
\i migrations/001_create_users.sql
\i migrations/002_create_health_logs.sql
\i migrations/003_create_avatars.sql
\i migrations/004_create_social_tables.sql
```

### Prisma Schema
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  firstName String?
  lastName  String?
  avatar    Avatar?
  healthLogs HealthLog[]
  friends   Friend[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model HealthLog {
  id     Int    @id @default(autoincrement())
  userId Int
  type   String // 'meal', 'water', 'sleep', 'movement'
  value  Json
  loggedAt DateTime @default(now())
  user   User   @relation(fields: [userId], references: [id])
}

model Avatar {
  id           Int    @id @default(autoincrement())
  userId       Int    @unique
  wellnessScore Int   @default(50)
  appearance   Json   @default("{}")
  worldState   Json   @default("{}")
  user         User   @relation(fields: [userId], references: [id])
}
```

---

## 🔐 Authentication Setup

### Supabase Configuration
```typescript
// mobile/src/services/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'your-supabase-url'
const supabaseKey = 'your-supabase-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Auth service
export class AuthService {
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  }
}
```

---

## 🎮 Core Module Implementation

### Health Module
```typescript
// mobile/src/modules/health/HealthModule.ts
export class HealthModule {
  private apiService: ApiService
  private storageService: StorageService

  constructor() {
    this.apiService = new ApiService()
    this.storageService = new StorageService()
  }

  async logMeal(mealData: MealData): Promise<HealthLog> {
    try {
      const response = await this.apiService.post('/health/meal', mealData)
      return response.data
    } catch (error) {
      throw new Error(`Failed to log meal: ${error.message}`)
    }
  }

  async logWater(amount: number): Promise<HealthLog> {
    try {
      const response = await this.apiService.post('/health/water', { amount })
      return response.data
    } catch (error) {
      throw new Error(`Failed to log water: ${error.message}`)
    }
  }

  async getHealthSummary(period: string): Promise<HealthSummary> {
    try {
      const response = await this.apiService.get(`/health/summary/${period}`)
      return response.data
    } catch (error) {
      throw new Error(`Failed to get health summary: ${error.message}`)
    }
  }
}
```

### Avatar Module
```typescript
// mobile/src/modules/avatar/AvatarModule.ts
export class AvatarModule {
  private wellnessCalculator: WellnessCalculator
  private worldManager: WorldManager

  constructor() {
    this.wellnessCalculator = new WellnessCalculator()
    this.worldManager = new WorldManager()
  }

  async updateAvatar(userId: string, healthData: HealthData): Promise<Avatar> {
    const wellnessScore = this.wellnessCalculator.calculate(healthData)
    const worldState = this.worldManager.update(wellnessScore)
    
    const avatarUpdate = {
      wellnessScore,
      worldState,
      emotions: this.calculateEmotions(wellnessScore)
    }

    const response = await this.apiService.put(`/avatar/${userId}`, avatarUpdate)
    return response.data
  }

  private calculateEmotions(wellnessScore: number): AvatarEmotions {
    if (wellnessScore >= 80) return 'happy'
    if (wellnessScore >= 60) return 'content'
    if (wellnessScore >= 40) return 'neutral'
    if (wellnessScore >= 20) return 'sad'
    return 'sick'
  }
}
```

---

## 🧪 Testing Setup

### Unit Testing
```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react-native
npm install --save-dev @types/jest

# Configure Jest
# jest.config.js
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/setupTests.ts'
  ]
}
```

### E2E Testing
```bash
# Install Detox for E2E testing
npm install --save-dev detox
npx detox init

# Configure Detox
# .detoxrc.js
module.exports = {
  testRunner: 'jest',
  runnerConfig: 'e2e/config.json',
  configurations: {
    'ios.sim.debug': {
      type: 'ios.simulator',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/HappyTracker.app',
      build: 'xcodebuild -workspace ios/HappyTracker.xcworkspace -scheme HappyTracker -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build'
    }
  }
}
```

---

## 🚀 Deployment Setup

### Mobile App Deployment
```bash
# Build for production
expo build:android
expo build:ios

# Or use EAS Build
npm install -g @expo/cli
eas build --platform all
```

### Backend Deployment
```bash
# Deploy to Render
# 1. Connect GitHub repository
# 2. Set environment variables
# 3. Configure build command: npm run build
# 4. Configure start command: npm start

# Environment variables needed:
DATABASE_URL=postgresql://user:password@host:port/database
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
JWT_SECRET=your-jwt-secret
REDIS_URL=your-redis-url
```

---

## 🔧 Development Tools

### Code Quality
```bash
# Install ESLint and Prettier
npm install --save-dev eslint prettier
npm install --save-dev @typescript-eslint/eslint-plugin
npm install --save-dev eslint-config-prettier

# Configure ESLint
# .eslintrc.js
module.exports = {
  extends: [
    'expo',
    '@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'prettier/prettier': 'error'
  }
}
```

### Git Hooks
```bash
# Install Husky for git hooks
npm install --save-dev husky lint-staged

# Configure pre-commit hooks
# package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

---

## 📚 Additional Resources

### Documentation
- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)

### Community
- [React Native Community](https://github.com/react-native-community)
- [Expo Discord](https://discord.gg/expo)
- [Supabase Discord](https://discord.supabase.com/)

### Tools
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- [Flipper](https://fbflipper.com/)
- [React Native Performance](https://reactnative.dev/docs/performance)

---

This guide provides everything needed to get started with HappyTracker development. Follow the steps in order, and you'll have a working development environment ready for building the health MMO!