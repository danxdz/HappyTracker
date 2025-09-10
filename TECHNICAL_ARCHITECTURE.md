# HappyTracker - Technical Architecture

## 🏗️ System Architecture Overview

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Backend API   │    │   Database      │
│   (React Native)│◄──►│   (Node.js)     │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Supabase      │    │   File Storage  │    │   Redis Cache   │
│   (Auth/Storage)│    │   (Images)      │    │   (Sessions)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 📱 Mobile App Architecture

### Tech Stack ✅ IMPLEMENTED
- **Web Framework**: Vite + React 19.1.1 + TypeScript ✅
- **Mobile Framework**: React Native with Expo (Planned)
- **State Management**: Redux Toolkit ✅
- **Web Routing**: React Router DOM ✅
- **Mobile Navigation**: React Navigation (Planned)
- **UI Components**: Headless UI (Web) ✅, React Native Elements (Mobile - Planned)
- **Styling**: Tailwind CSS ✅
- **Animations**: Framer Motion ✅
- **3D Graphics**: Three.js + React Three Fiber ✅
- **AI Integration**: Hugging Face API ✅
- **Camera**: Expo Camera (Planned)
- **Sensors**: Expo Sensors (Planned)
- **Storage**: AsyncStorage + Supabase (Planned)

### Module Structure
```typescript
// Core modules with plugin architecture
interface ModuleSystem {
  auth: AuthModule;           // Authentication & user management
  health: HealthModule;        // Health tracking & logging
  avatar: AvatarModule;        // Avatar system & world state
  social: SocialModule;       // Social features & community
  focus: FocusModule;         // Technology wellness & focus
}

// Each module is self-contained
interface Module {
  name: string;
  version: string;
  dependencies: string[];
  initialize(): Promise<void>;
  execute(action: string, data: any): Promise<any>;
  cleanup(): Promise<void>;
}
```

### State Management ✅ IMPLEMENTED
```typescript
// Redux Toolkit store structure - CURRENTLY IMPLEMENTED
interface AppState {
  auth: {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
  };
  
  health: {
    logs: HealthLog[];
    dailyGoals: DailyGoals;
    wellnessScore: number;
  };
  
  avatar: {
    appearance: AvatarAppearance;
    wellnessScore: number;
    worldState: WorldState;
    emotions: AvatarEmotions;
  };
  
  social: {
    friends: Friend[];
    challenges: Challenge[];
    leaderboards: Leaderboard[];
  };
  
  focus: {
    screenTime: ScreenTimeData;
    focusSessions: FocusSession[];
    balanceScore: number;
  };
}
```

---

## 🤖 AI & 3D Systems Architecture

### AI Integration ✅ IMPLEMENTED
```typescript
// Hugging Face AI Service
interface HuggingFaceService {
  // Face analysis and character generation
  analyzeFace(imageData: string): Promise<FaceAnalysis>;
  generate3DPop(imageData: string, onProgress?: (step: string, data?: any) => void): Promise<PopGenerationResult>;
  
  // Simplified single avatar generation
  generateSinglePopCharacter(description: string, characteristics: PopCharacteristics): Promise<string>;
  
  // Fallback systems
  createSimplePopImage(characteristics: PopCharacteristics): string;
}

// AI Pipeline (Simplified 4-Step Process)
interface AIPipeline {
  step1: 'Face Analysis' → 'AI analyzes photo for facial features and emotions';
  step2: 'Character Preview' → 'Creates personality traits and visual characteristics';
  step3: 'Pop Generation' → 'Generates single beautiful pop character with Stable Diffusion XL';
  step4: '3D Model' → 'Prepares 3D model for future interactive features';
}
```

### 3D Graphics System ✅ IMPLEMENTED
```typescript
// Three.js + React Three Fiber Integration
interface ThreeJSIntegration {
  // 3D Pop World
  PopWorld: {
    animatedCharacter: 'Health-responsive bouncing and rotation';
    environment: 'Trees, flowers, ground with realistic lighting';
    cameraControls: 'Touch-friendly rotation, zoom, pan';
    healthIntegration: 'Real-time visual changes based on wellness score';
  };
  
  // Galaxy System
  GalaxySystem: {
    galaxyTypes: 'Bright, Mystical, Crystal, Cosmic';
    starField: '2000+ procedurally generated stars in spiral pattern';
    centralSun: 'Health-energy responsive with solar flares and corona';
    nebulaEffects: 'Realistic gas clouds and dust particles';
    lighting: 'Multi-point lighting system with health-based intensity';
  };
  
  // Performance Optimization
  optimization: {
    geometry: 'Efficient mesh generation and LOD system';
    textures: 'Optimized material properties and PBR rendering';
    mobile: 'Touch controls and responsive design';
    memory: 'Proper cleanup and resource management';
  };
}
```

---

## 🖥️ Backend API Architecture

### Tech Stack
- **Runtime**: Node.js with Express
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Caching**: Redis
- **Validation**: Joi
- **Documentation**: Swagger/OpenAPI

### API Structure
```typescript
// RESTful API endpoints
interface APIEndpoints {
  // Authentication
  'POST /api/auth/login': LoginRequest;
  'POST /api/auth/register': RegisterRequest;
  'POST /api/auth/logout': LogoutRequest;
  'GET /api/auth/me': UserProfile;
  
  // Health tracking
  'POST /api/health/meal': MealLogRequest;
  'POST /api/health/water': WaterLogRequest;
  'POST /api/health/sleep': SleepLogRequest;
  'POST /api/health/movement': MovementLogRequest;
  'GET /api/health/summary/:period': HealthSummary;
  
  // Avatar system
  'GET /api/avatar/:userId': AvatarData;
  'PUT /api/avatar/update': AvatarUpdateRequest;
  'POST /api/avatar/emotion': EmotionUpdateRequest;
  
  // Social features
  'GET /api/social/friends': Friend[];
  'POST /api/social/friends/add': AddFriendRequest;
  'GET /api/social/challenges': Challenge[];
  'POST /api/social/challenges/join': JoinChallengeRequest;
  'GET /api/social/leaderboards': Leaderboard[];
  
  // Focus sessions
  'POST /api/focus/session/start': StartSessionRequest;
  'PUT /api/focus/session/end': EndSessionRequest;
  'GET /api/focus/sessions': FocusSession[];
  'GET /api/focus/screen-time': ScreenTimeData;
}
```

### Database Schema
```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_settings JSONB DEFAULT '{}',
    privacy_settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Health logs table
CREATE TABLE health_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'meal', 'water', 'sleep', 'movement'
    value JSONB NOT NULL,
    metadata JSONB DEFAULT '{}',
    logged_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Avatars table
CREATE TABLE avatars (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    wellness_score INT DEFAULT 50 CHECK (wellness_score >= 0 AND wellness_score <= 100),
    appearance JSONB DEFAULT '{}',
    world_state JSONB DEFAULT '{}',
    emotions JSONB DEFAULT '{}',
    last_updated TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Friends table
CREATE TABLE friends (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    friend_id INT REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'blocked'
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, friend_id)
);

-- Challenges table
CREATE TABLE challenges (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- 'individual', 'group', 'community'
    goal JSONB NOT NULL,
    duration_days INT DEFAULT 7,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Focus sessions table
CREATE TABLE focus_sessions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    duration_minutes INT NOT NULL,
    activity_type VARCHAR(50), -- 'meal', 'work', 'walk', 'rest'
    completed BOOLEAN DEFAULT false,
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Screen time data table
CREATE TABLE screen_time_data (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_minutes INT DEFAULT 0,
    app_usage JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, date)
);
```

---

## 🔌 Module Architecture

### Health Module
```typescript
interface HealthModule {
  // Core health tracking
  logMeal(mealData: MealData): Promise<HealthLog>;
  logWater(amount: number): Promise<HealthLog>;
  logSleep(duration: number): Promise<HealthLog>;
  logMovement(steps: number): Promise<HealthLog>;
  
  // Health analysis
  calculateWellnessScore(userId: string): Promise<number>;
  getHealthSummary(userId: string, period: string): Promise<HealthSummary>;
  getDailyGoals(userId: string): Promise<DailyGoals>;
  
  // Photo recognition (simulated)
  recognizeFood(imageUri: string): Promise<FoodRecognition>;
  calculateNutritionScore(foods: Food[]): Promise<number>;
}
```

### Avatar Module
```typescript
interface AvatarModule {
  // Avatar management
  createAvatar(userId: string): Promise<Avatar>;
  updateAvatar(userId: string, updates: AvatarUpdate): Promise<Avatar>;
  getAvatar(userId: string): Promise<Avatar>;
  
  // Wellness integration
  updateFromHealth(userId: string, healthData: HealthData): Promise<void>;
  updateFromScreenTime(userId: string, screenTime: number): Promise<void>;
  updateFromSocial(userId: string, socialActivity: SocialActivity): Promise<void>;
  
  // World state
  updateWorldState(userId: string, worldUpdate: WorldUpdate): Promise<void>;
  getWorldState(userId: string): Promise<WorldState>;
  
  // Emotions and animations
  setEmotion(userId: string, emotion: Emotion): Promise<void>;
  triggerAnimation(userId: string, animation: Animation): Promise<void>;
}
```

### Social Module
```typescript
interface SocialModule {
  // Friend management
  addFriend(userId: string, friendEmail: string): Promise<Friend>;
  acceptFriendRequest(userId: string, friendId: string): Promise<void>;
  removeFriend(userId: string, friendId: string): Promise<void>;
  getFriends(userId: string): Promise<Friend[]>;
  
  // Challenges
  createChallenge(challengeData: ChallengeData): Promise<Challenge>;
  joinChallenge(userId: string, challengeId: string): Promise<void>;
  getChallenges(userId: string): Promise<Challenge[]>;
  updateChallengeProgress(userId: string, challengeId: string, progress: number): Promise<void>;
  
  // Leaderboards
  getLeaderboard(type: string, period: string): Promise<Leaderboard>;
  getUserRank(userId: string, leaderboardType: string): Promise<number>;
  
  // Social features
  sendEncouragement(fromUserId: string, toUserId: string, message: string): Promise<void>;
  shareAchievement(userId: string, achievement: Achievement): Promise<void>;
}
```

### Focus Module
```typescript
interface FocusModule {
  // Focus sessions
  startFocusSession(userId: string, duration: number, activityType: string): Promise<FocusSession>;
  endFocusSession(sessionId: string): Promise<FocusSession>;
  getFocusSessions(userId: string): Promise<FocusSession[]>;
  
  // Screen time tracking
  getScreenTimeData(userId: string, date: Date): Promise<ScreenTimeData>;
  updateScreenTimeData(userId: string, data: ScreenTimeData): Promise<void>;
  getScreenTimeTrends(userId: string, period: string): Promise<ScreenTimeTrend[]>;
  
  // Balance calculation
  calculateBalanceScore(userId: string): Promise<number>;
  getBalanceRecommendations(userId: string): Promise<Recommendation[]>;
}
```

---

## 🔒 Security & Privacy

### Authentication
```typescript
// JWT-based authentication with Supabase
interface AuthConfig {
  jwtSecret: string;
  tokenExpiry: string; // '24h'
  refreshTokenExpiry: string; // '7d'
  passwordMinLength: number; // 8
  requireEmailVerification: boolean; // true
}

// Role-based access control
enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}
```

### Data Privacy
```typescript
// Privacy controls
interface PrivacySettings {
  shareHealthData: boolean; // Default: false
  shareScreenTime: boolean; // Default: false
  shareLocation: boolean; // Default: false
  allowFriendRequests: boolean; // Default: true
  showInLeaderboards: boolean; // Default: true
}

// Data encryption
interface EncryptionConfig {
  algorithm: string; // 'aes-256-gcm'
  keyDerivation: string; // 'pbkdf2'
  saltRounds: number; // 12
}
```

---

## 📊 Performance & Scalability

### Caching Strategy
```typescript
// Redis caching layers
interface CacheConfig {
  userProfiles: { ttl: 3600 }; // 1 hour
  healthSummaries: { ttl: 1800 }; // 30 minutes
  avatarData: { ttl: 900 }; // 15 minutes
  leaderboards: { ttl: 300 }; // 5 minutes
  screenTimeData: { ttl: 600 }; // 10 minutes
}
```

### Database Optimization
```sql
-- Indexes for performance
CREATE INDEX idx_health_logs_user_date ON health_logs(user_id, logged_at);
CREATE INDEX idx_avatars_user_id ON avatars(user_id);
CREATE INDEX idx_friends_user_id ON friends(user_id);
CREATE INDEX idx_focus_sessions_user_date ON focus_sessions(user_id, started_at);
CREATE INDEX idx_screen_time_user_date ON screen_time_data(user_id, date);
```

### API Rate Limiting
```typescript
// Rate limiting configuration
interface RateLimitConfig {
  auth: { requests: 5, window: '15m' }; // Login attempts
  health: { requests: 100, window: '1h' }; // Health logging
  social: { requests: 50, window: '1h' }; // Social features
  focus: { requests: 20, window: '1h' }; // Focus sessions
}
```

---

## 🚀 Deployment Architecture

### Production Environment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN           │    │   Load Balancer │    │   App Servers   │
│   (Static Assets)│    │   (Nginx)       │    │   (Node.js)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   File Storage  │    │   Redis Cluster │    │   Database      │
│   (Supabase)    │    │   (Sessions)    │    │   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Monitoring & Logging
```typescript
// Application monitoring
interface MonitoringConfig {
  healthChecks: {
    database: boolean;
    redis: boolean;
    externalAPIs: boolean;
  };
  
  metrics: {
    responseTime: boolean;
    errorRate: boolean;
    userActivity: boolean;
    systemResources: boolean;
  };
  
  alerts: {
    errorThreshold: number; // 5%
    responseTimeThreshold: number; // 2000ms
    memoryThreshold: number; // 80%
  };
}
```

---

## 🔧 Development Tools

### Code Quality
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript
- **Testing**: Jest + React Native Testing Library
- **E2E Testing**: Detox
- **Code Coverage**: Istanbul

### CI/CD Pipeline
```yaml
# GitHub Actions workflow
name: CI/CD Pipeline
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test
      - run: npm run lint
      - run: npm run type-check
  
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm run build
      - run: npm run build:mobile
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: npm run deploy:staging
```

---

This technical architecture provides a solid foundation for building HappyTracker with scalability, maintainability, and user privacy in mind. The modular design allows for easy feature additions and updates as the app grows.