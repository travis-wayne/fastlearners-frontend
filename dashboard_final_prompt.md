# FastLearners Student Dashboard - Complete Implementation Prompt

## 🎯 Mission Statement
Build a **production-ready, stunning, accessible** student dashboard that seamlessly integrates your existing dark theme implementation with new features from the Figma design, following modern design principles and leveraging MCP servers for rapid development.

---

## 📋 Context & Current State

### What We Have (Keep & Enhance)
- ✅ Beautiful dark theme with time-based gradient header
- ✅ Dynamic greeting system (Good morning/afternoon/evening/night)
- ✅ Functional sidebar navigation with hover effects
- ✅ "Today's Lessons" table with progress tracking
- ✅ Current stats cards (Lessons Completed, Streak, Score, Time)
- ✅ shadcn/ui MCP installed and configured

### What We're Adding (New Features)
- 🆕 Progress donut chart with subject dropdown
- 🆕 Achievements section with 3 animated cards
- 🆕 Performance bars for all subjects
- 🆕 Overview statistics grid
- 🆕 Leader's Board rankings table
- 🆕 Updated navigation structure

---

## 🛠️ Required Setup

### 1. Install Required Packages (pnpm)

```bash
# Core dependencies (if not already installed)
pnpm install react-router-dom recharts date-fns lucide-react

# Install all required shadcn/ui components at once
pnpm dlx shadcn@latest add card avatar progress select badge table dropdown-menu separator skeleton tabs
```

### 2. MCP Servers to Use

**Priority 1 - Essential (Use Now):**
```
✅ shadcn/ui MCP - Already installed
✅ Tailwind MCP - For class suggestions and consistency
```

**Priority 2 - Recommended (Set up during development):**
```
□ Figma MCP - Sync design tokens if available
□ Supabase MCP - For future backend integration
```

---

## 🎨 Design System Rules (MUST FOLLOW)

### Color Palette (Dark Theme)
```typescript
// Background layers
background: {
  primary: 'bg-slate-950',      // Main background
  secondary: 'bg-slate-900',    // Cards, elevated content
  tertiary: 'bg-slate-800',     // Nested cards, inputs
}

// Text hierarchy
text: {
  primary: 'text-slate-100',    // Main headings
  secondary: 'text-slate-300',  // Body text
  tertiary: 'text-slate-400',   // Muted text, labels
  disabled: 'text-slate-600',   // Disabled states
}

// Brand colors
brand: {
  primary: 'bg-blue-600 hover:bg-blue-700',
  secondary: 'bg-purple-600 hover:bg-purple-700',
  accent: 'bg-emerald-500 hover:bg-emerald-600',
}

// Semantic colors
semantic: {
  success: 'text-emerald-400 bg-emerald-500/10',
  warning: 'text-amber-400 bg-amber-500/10',
  error: 'text-red-400 bg-red-500/10',
  info: 'text-blue-400 bg-blue-500/10',
}

// Borders & dividers
borders: 'border-slate-700/50'

// Interactive states
interactive: {
  hover: 'hover:bg-slate-800/50',
  active: 'active:scale-95',
  focus: 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900',
}
```

### Spacing System (MUST USE)
```typescript
// Use ONLY these spacing values
spacing: {
  xs: 'p-2 gap-2',      // 8px - Tight spacing
  sm: 'p-4 gap-4',      // 16px - Compact
  md: 'p-6 gap-6',      // 24px - DEFAULT for cards
  lg: 'p-8 gap-8',      // 32px - Generous
  xl: 'p-12 gap-12',    // 48px - Section spacing
}

// Section margins
margins: {
  section: 'mb-8',      // Between major sections
  subsection: 'mb-6',   // Between subsections
  element: 'mb-4',      // Between elements
}
```

### Typography Scale (MUST USE)
```typescript
typography: {
  // Headlines
  h1: 'text-4xl font-bold text-slate-100 tracking-tight',
  h2: 'text-3xl font-bold text-slate-100',
  h3: 'text-2xl font-semibold text-slate-100',
  h4: 'text-xl font-semibold text-slate-200',
  
  // Body
  body: 'text-base text-slate-300 leading-relaxed',
  bodyLarge: 'text-lg text-slate-300 leading-relaxed',
  
  // Small text
  small: 'text-sm text-slate-400',
  tiny: 'text-xs text-slate-500',
  
  // Labels
  label: 'text-sm font-medium text-slate-300',
}
```

### Component Standards
```typescript
// Card base
card: 'bg-slate-900 rounded-lg border border-slate-800/50 p-6 shadow-lg shadow-black/20'

// Card with hover effect
cardInteractive: 'bg-slate-900 rounded-lg border border-slate-800/50 p-6 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer'

// Button primary
buttonPrimary: 'px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg shadow-blue-500/20 transition-all duration-200 active:scale-95 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900'

// Button secondary
buttonSecondary: 'px-6 py-2.5 border-2 border-slate-700 hover:bg-slate-800 text-slate-300 font-medium rounded-lg transition-all duration-200 active:scale-95'

// Input field
input: 'w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'

// Badge
badge: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium'

// Progress bar
progress: 'h-2 rounded-full bg-slate-800 overflow-hidden'
```

### Border Radius (MUST USE)
```typescript
borderRadius: {
  sm: 'rounded-md',   // 6px - Small elements
  md: 'rounded-lg',   // 8px - DEFAULT for cards, buttons
  lg: 'rounded-xl',   // 12px - Large cards, modals
  full: 'rounded-full' // Pills, avatars
}
```

### Shadow System (MUST USE)
```typescript
shadows: {
  sm: 'shadow-lg shadow-black/20',        // Subtle cards
  md: 'shadow-xl shadow-black/30',        // Elevated cards
  lg: 'shadow-2xl shadow-black/40',       // Modals, dropdowns
  colored: 'shadow-lg shadow-blue-500/20' // Accent elements
}
```

---

## 📐 Layout Structure & Specifications

### Overall Layout
```typescript
<div className="flex h-screen bg-slate-950">
  {/* Sidebar - Fixed width */}
  <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
    {/* Sidebar content */}
  </aside>
  
  {/* Main content - Flexible */}
  <main className="flex-1 overflow-y-auto">
    <div className="max-w-[1600px] mx-auto p-8">
      {/* Dashboard content with proper spacing */}
    </div>
  </main>
</div>
```

### Grid System
```typescript
// Dashboard main grid
grid: 'grid grid-cols-12 gap-6'

// Common layouts
layouts: {
  // Full width
  fullWidth: 'col-span-12',
  
  // Three columns (Progress, Achievements, Overview)
  threeCol: 'col-span-12 lg:col-span-4',
  
  // Two columns
  twoCol: 'col-span-12 lg:col-span-6',
  
  // Sidebar content (2/3 split)
  sidebar: 'col-span-12 lg:col-span-3',
  main: 'col-span-12 lg:col-span-9',
}
```

---

## 🎯 Component Implementation Details

### 1. Updated Sidebar Navigation

**File**: `src/components/layout/Sidebar.tsx`

**Requirements**:
```typescript
// Navigation structure
const navigation = {
  main: [
    { name: 'Dashboard', href: '/', icon: Home, current: true },
    { name: 'Subjects', href: '/subjects', icon: BookOpen },
    { name: 'Lessons', href: '/lessons', icon: Book },
    { name: 'Quiz', href: '/quiz', icon: HelpCircle },
    { name: 'Past Questions', href: '/past-questions', icon: FileText },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
  ],
  bottom: [
    { name: 'Subscription', href: '/subscription', icon: CreditCard },
    { name: 'Support', href: '/support', icon: MessageCircle },
    { name: 'Logout', href: '/logout', icon: LogOut },
  ]
}

// Styling rules
navItem: {
  base: 'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
  inactive: 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50',
  active: 'text-white bg-blue-600 shadow-lg shadow-blue-500/20',
}

// Logo section
logo: 'px-4 py-6 border-b border-slate-800/50'

// Bottom section
bottom: 'mt-auto pt-4 border-t border-slate-800/50'
```

**Accessibility Requirements**:
- All nav items must have `aria-label`
- Active item must have `aria-current="page"`
- Keyboard navigable with Tab
- Focus states clearly visible

---

### 2. Dynamic Header Component

**File**: `src/components/dashboard/DynamicHeader.tsx`

**Requirements**:
```typescript
interface TimeGreeting {
  time: 'morning' | 'afternoon' | 'evening' | 'night';
  greeting: string;
  icon: ReactNode;
  gradient: string;
}

// Time-based configuration
const greetings: Record<string, TimeGreeting> = {
  morning: {
    time: 'morning',
    greeting: 'Good morning',
    icon: <Sun className="h-8 w-8 text-yellow-400" />,
    gradient: 'bg-gradient-to-br from-blue-400 via-cyan-300 to-yellow-200',
  },
  afternoon: {
    time: 'afternoon',
    greeting: 'Good afternoon',
    icon: <CloudSun className="h-8 w-8 text-orange-400" />,
    gradient: 'bg-gradient-to-br from-blue-500 via-purple-400 to-orange-300',
  },
  evening: {
    time: 'evening',
    greeting: 'Good evening',
    icon: <Sunset className="h-8 w-8 text-orange-500" />,
    gradient: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400',
  },
  night: {
    time: 'night',
    greeting: 'Good night',
    icon: <Moon className="h-8 w-8 text-blue-300" />,
    gradient: 'bg-gradient-to-br from-slate-800 via-purple-900 to-blue-900',
  },
}

// Time logic
function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}
```

**Layout**:
```typescript
<div className={`relative overflow-hidden rounded-2xl p-8 ${currentGreeting.gradient}`}>
  {/* Date & Time - Top left */}
  <div className="flex items-center gap-2 text-white/80 text-sm mb-4">
    <Calendar className="h-4 w-4" />
    <span>{formattedDate}</span>
    <Clock className="h-4 w-4 ml-4" />
    <span>{formattedTime}</span>
  </div>
  
  {/* Greeting - Main */}
  <div className="flex items-center gap-4 mb-6">
    {currentGreeting.icon}
    <h1 className="text-4xl font-bold text-white">
      {currentGreeting.greeting}, {userName}!
    </h1>
  </div>
  
  {/* Subtitle */}
  <p className="text-white/90 text-lg mb-6">
    Ready to learn something amazing today?
  </p>
  
  {/* Badges */}
  <div className="flex flex-wrap gap-3">
    <Badge className="bg-white/20 backdrop-blur-sm text-white border-0">
      <User className="h-3 w-3 mr-1" />
      Student
    </Badge>
    <Badge className="bg-white/20 backdrop-blur-sm text-white border-0">
      <Trophy className="h-3 w-3 mr-1" />
      Level 5
    </Badge>
    <Badge className="bg-white/20 backdrop-blur-sm text-white border-0">
      <Flame className="h-3 w-3 mr-1" />
      7 day streak
    </Badge>
    <Badge className="bg-white/20 backdrop-blur-sm text-white border-0">
      <BookOpen className="h-3 w-3 mr-1" />
      3 lessons today
    </Badge>
  </div>
  
  {/* Animated icon - Absolute positioned */}
  <div className="absolute -right-8 -bottom-8 opacity-20">
    {/* Large animated version of time icon */}
  </div>
</div>
```

**Animation Requirements**:
- Icon should have subtle floating animation
- Gradient should smoothly transition when time period changes
- Use `transition-all duration-700 ease-in-out` for time changes

---

### 3. Progress Chart Component 🆕

**File**: `src/components/dashboard/ProgressChart.tsx`

**Requirements**:
```typescript
interface SubjectProgress {
  subject: string;
  completed: number;
  total: number;
  color: string;
}

const subjectData: SubjectProgress[] = [
  { subject: 'Mathematics', completed: 65, total: 100, color: '#3b82f6' },
  { subject: 'Physics', completed: 50, total: 100, color: '#8b5cf6' },
  { subject: 'Chemistry', completed: 80, total: 100, color: '#10b981' },
  { subject: 'Biology', completed: 90, total: 100, color: '#f59e0b' },
];
```

**Layout**:
```typescript
<Card className="bg-slate-900 border-slate-800/50">
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle className="text-xl font-semibold text-slate-100">
        Progress
      </CardTitle>
      <Select>
        {/* Subject dropdown */}
      </Select>
    </div>
  </CardHeader>
  <CardContent>
    {/* Recharts PieChart - Donut style */}
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={90}
          dataKey="value"
          startAngle={90}
          endAngle={-270}
        >
          {/* Animated cells */}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
    
    {/* Center text - Absolute positioned */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <p className="text-4xl font-bold text-slate-100">{percentage}%</p>
        <p className="text-sm text-slate-400">Complete</p>
      </div>
    </div>
    
    {/* Legend */}
    <div className="flex items-center justify-center gap-6 mt-4">
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-blue-500" />
        <span className="text-sm text-slate-400">Completed</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-slate-700" />
        <span className="text-sm text-slate-400">Remaining</span>
      </div>
    </div>
  </CardContent>
</Card>
```

**Design Requirements**:
- Smooth animation on data change (duration: 1000ms, easing: ease-out)
- Hover effect on chart segments
- Dropdown should update chart instantly
- Use `stroke-width="2"` for crisp edges

---

### 4. Achievements Section 🆕

**File**: `src/components/dashboard/AchievementsSection.tsx`

**Requirements**:
```typescript
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  iconBg: string;
  earned: boolean;
  date?: string;
}

const achievements: Achievement[] = [
  {
    id: '1',
    title: '7-Day Learning Streak',
    description: 'Logged in for 7 consecutive days',
    icon: <Flame className="h-6 w-6" />,
    iconBg: 'bg-orange-500/10 text-orange-400',
    earned: true,
    date: 'Earned today',
  },
  {
    id: '2',
    title: 'Perfect Score',
    description: 'Scored 100% on a quiz',
    icon: <Star className="h-6 w-6" />,
    iconBg: 'bg-yellow-500/10 text-yellow-400',
    earned: true,
    date: 'Earned 2 days ago',
  },
  {
    id: '3',
    title: 'Quiz Master',
    description: 'Completed 10 quizzes',
    icon: <Trophy className="h-6 w-6" />,
    iconBg: 'bg-purple-500/10 text-purple-400',
    earned: true,
    date: 'Earned last week',
  },
];
```

**Layout**:
```typescript
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {achievements.map((achievement) => (
    <Card 
      key={achievement.id}
      className={`
        bg-slate-900 border-slate-800/50 
        hover:shadow-xl hover:shadow-black/30 
        hover:-translate-y-1 hover:scale-[1.02]
        transition-all duration-300 cursor-pointer
        ${!achievement.earned && 'opacity-50 grayscale'}
      `}
    >
      <CardContent className="p-6">
        {/* Icon */}
        <div className={`
          inline-flex p-3 rounded-xl mb-4 
          ${achievement.iconBg}
        `}>
          {achievement.icon}
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-semibold text-slate-100 mb-2">
          {achievement.title}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-slate-400 mb-3">
          {achievement.description}
        </p>
        
        {/* Date badge */}
        {achievement.earned && (
          <Badge className="bg-emerald-500/10 text-emerald-400 border-0 text-xs">
            <Check className="h-3 w-3 mr-1" />
            {achievement.date}
          </Badge>
        )}
      </CardContent>
    </Card>
  ))}
</div>
```

**Animation Requirements**:
- Stagger animation on mount (each card delays by 100ms)
- 3D tilt effect on hover (use CSS transform or Aceternity's CardHover)
- Pulse effect on newly earned achievements
- Lock icon for unearned achievements

---

### 5. Performance Bars Section 🆕

**File**: `src/components/dashboard/PerformanceSection.tsx`

**Requirements**:
```typescript
interface SubjectPerformance {
  subject: string;
  percentage: number;
  color: string;
  icon: ReactNode;
}

const performances: SubjectPerformance[] = [
  { subject: 'Mathematics', percentage: 65, color: 'bg-blue-500', icon: <Calculator /> },
  { subject: 'Physics', percentage: 50, color: 'bg-purple-500', icon: <Atom /> },
  { subject: 'Chemistry', percentage: 80, color: 'bg-emerald-500', icon: <FlaskConical /> },
  { subject: 'Biology', percentage: 90, color: 'bg-amber-500', icon: <Dna /> },
];
```

**Layout**:
```typescript
<Card className="bg-slate-900 border-slate-800/50">
  <CardHeader>
    <CardTitle className="text-xl font-semibold text-slate-100">
      Performance
    </CardTitle>
    <p className="text-sm text-slate-400">
      Your progress across all subjects
    </p>
  </CardHeader>
  <CardContent className="space-y-6">
    {performances.map((perf, index) => (
      <div key={perf.subject} className="space-y-2">
        {/* Subject header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-lg">
              {perf.icon}
            </div>
            <span className="font-medium text-slate-200">
              {perf.subject}
            </span>
          </div>
          <span className="text-lg font-semibold text-slate-100">
            {perf.percentage}%
          </span>
        </div>
        
        {/* Progress bar */}
        <Progress 
          value={perf.percentage}
          className="h-2.5"
          indicatorClassName={perf.color}
        />
      </div>
    ))}
  </CardContent>
</Card>
```

**Animation Requirements**:
- Progress bars animate from 0 to value on mount
- Use `animation-delay` based on index (index * 200ms)
- Smooth easing: `ease-out`
- Duration: 1000ms
- Add subtle hover effect on each row

---

### 6. Overview Stats Grid 🆕

**File**: `src/components/dashboard/OverviewGrid.tsx`

**Requirements**:
```typescript
interface OverviewStat {
  label: string;
  value: string | number;
  icon: ReactNode;
  iconColor: string;
  change?: {
    value: number;
    trend: 'up' | 'down';
  };
}

const stats: OverviewStat[] = [
  {
    label: 'Subjects Registered',
    value: 4,
    icon: <BookOpen className="h-5 w-5" />,
    iconColor: 'text-blue-400',
  },
  {
    label: 'Quizzes Completed',
    value: '12/20',
    icon: <CheckCircle className="h-5 w-5" />,
    iconColor: 'text-emerald-400',
    change: { value: 3, trend: 'up' },
  },
  {
    label: 'Average Score',
    value: '85%',
    icon: <TrendingUp className="h-5 w-5" />,
    iconColor: 'text-purple-400',
    change: { value: 5, trend: 'up' },
  },
  {
    label: 'Time Spent Learning',
    value: '24.5h',
    icon: <Clock className="h-5 w-5" />,
    iconColor: 'text-amber-400',
    change: { value: 2, trend: 'up' },
  },
  {
    label: 'Current Streak',
    value: '7 days',
    icon: <Flame className="h-5 w-5" />,
    iconColor: 'text-orange-400',
  },
  {
    label: 'Subscription Status',
    value: 'Active',
    icon: <CreditCard className="h-5 w-5" />,
    iconColor: 'text-emerald-400',
  },
];
```

**Layout**:
```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {stats.map((stat, index) => (
    <Card 
      key={stat.label}
      className="bg-slate-900 border-slate-800/50 hover:border-slate-700 transition-all duration-200"
    >
      <CardContent className="p-6">
        {/* Icon */}
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 bg-slate-800 rounded-lg ${stat.iconColor}`}>
            {stat.icon}
          </div>
          {stat.change && (
            <Badge className={`
              ${stat.change.trend === 'up' 
                ? 'bg-emerald-500/10 text-emerald-400' 
                : 'bg-red-500/10 text-red-400'
              } border-0
            `}>
              {stat.change.trend === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {stat.change.value}%
            </Badge>
          )}
        </div>
        
        {/* Value */}
        <div className="text-3xl font-bold text-slate-100 mb-1">
          {stat.value}
        </div>
        
        {/* Label */}
        <div className="text-sm text-slate-400">
          {stat.label}
        </div>
      </CardContent>
    </Card>
  ))}
</div>
```

**Design Requirements**:
- Cards should have subtle hover effect
- Icons should have consistent size (h-5 w-5)
- Numbers should be large and prominent (text-3xl)
- Change indicators should be color-coded (green up, red down)

---

### 7. Leader's Board Component 🆕

**File**: `src/components/dashboard/LeaderBoard.tsx`

**Requirements**:
```typescript
interface LeaderboardEntry {
  rank: number;
  user: {
    name: string;
    avatar: string;
    level: number;
  };
  score: number;
  lastSeen: string;
}

const leaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    user: { name: 'Victor Smith', avatar: '/avatars/victor.jpg', level: 8 },
    score: 2850,
    lastSeen: '2 minutes ago',
  },
  {
    rank: 2,
    user: { name: 'Sarah Johnson', avatar: '/avatars/sarah.jpg', level: 7 },
    score: 2640,
    lastSeen: '1 hour ago',
  },
  {
    rank: 3,
    user: { name: 'Mike Chen', avatar: '/avatars/mike.jpg', level: 7 },
    score: 2580,
    lastSeen: '3 hours ago',
  },
  {
    rank: 4,
    user: { name: 'Emma Davis', avatar: '/avatars/emma.jpg', level: 6 },
    score: 2420,
    lastSeen: 'Yesterday',
  },
];

// Trophy colors
const trophyColors = {
  1: 'text-yellow-400',
  2: 'text-slate-400',
  3: 'text-amber-600',
};
```

**Layout**:
```typescript
<Card className="bg-slate-900 border-slate-800/50">
  <CardHeader>
    <div className="flex items-center justify-between">
      <div>
        <CardTitle className="text-xl font-semibold text-slate-100">
          Leader's Board
        </CardTitle>
        <p className="text-sm text-slate-400 mt-1">
          Top performers this week
        </p>
      </div>
      <Badge className="bg-blue-500/10 text-blue-400 border-0">
        <Trophy className="h-3 w-3 mr-1" />
        Top 100
      </Badge>
    </div>
  </CardHeader>
  <CardContent>
    <Table>
      <TableHeader>
        <TableRow className="border-slate-800 hover:bg-transparent">
          <TableHead className="text-slate-400">Rank</TableHead>
          <TableHead className="text-slate-400">User</TableHead>
          <TableHead className="text-slate-400">Score</TableHead>
          <TableHead className="text-slate-400 text-right">Last Seen</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leaderboard.map((entry) => (
          <TableRow 
            key={entry.rank}
            className="border-slate-800 hover:bg-slate-800/50 transition-colors"
          >
            {/* Rank with trophy */}
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                {entry.rank <= 3 ? (
                  <Trophy className={`h-5 w-5 ${trophyColors[entry.rank]}`} />
                ) : (
                  <span className="text-slate-400">#{entry.rank}</span>
                )}
              </div>
            </TableCell>
            
            {/* User info */}
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-slate-700">
                  <AvatarImage src={entry.user.avatar} alt={entry.user.name} />
                  <AvatarFallback className="bg-slate-800 text-slate-300">
                    {entry.user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-slate-200">{entry.user.name}</p>
                  <p className="text-xs text-slate-500">Level {entry.user.level}</p>
                </div>
              </div>
            </TableCell>
            
            {/* Score */}
            <TableCell>
              <span className="font-semibold text-slate-100">
                {entry.score.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 ml-1">pts</span>
            </TableCell>
            
            {/* Last seen */}
            <TableCell className="text-right text-sm text-slate-400">
              {entry.lastSeen}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </CardContent>
</Card>
```

**Design Requirements**:
- Trophy icons for top 3 (gold, silver, bronze)
- Hover effect on table rows
- Avatar with fallback initials
- Responsive: Consider card layout on mobile
- Smooth transitions on hover

---

### 8. Today's Lessons Component (Keep & Enhance)

**File**: `src/components/dashboard/TodaysLessons.tsx`

**Current Implementation**: ✅ Keep it, but ensure it follows design standards

**Enhancement Suggestions**:
```typescript
// Ensure these styling standards:
<Card className="bg-slate-900 border-slate-800/50">
  <CardHeader>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <Calendar className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <CardTitle className="text-xl font-semibold text-slate-100">
            Today's Lessons
          </CardTitle>
          <p className="text-sm text-slate-400">
            Start with your scheduled lessons for today
          </p>
        </div>
      </div>
      <Badge className="bg-blue-500/10 text-blue-400 border-0">
        3 lessons
      </Badge>
    </div>
  </CardHeader>
  <CardContent>
    <Table>
      <TableHeader>
        <TableRow className="border-slate-800 hover:bg-transparent">
          <TableHead className="text-slate-400">Subject</TableHead>
          <TableHead className="text-slate-400">Lesson</TableHead>
          <TableHead className="text-slate-400">Duration</TableHead>
          <TableHead className="text-slate-400">Progress</TableHead>
          <TableHead className="text-slate-400 text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Keep your existing table rows */}
        {/* Just ensure hover:bg-slate-800/50 on rows */}
      </TableBody>
    </Table>
  </CardContent>
</Card>
```

---

## 📱 Responsive Design Requirements

### Breakpoint Strategy
```typescript
// Mobile First - Default (< 640px)
mobile: {
  layout: 'single column',
  sidebar: 'hidden (hamburger menu)',
  cards: 'full width',
  padding: 'p-4',
  fontSize: 'text-base',
}

// Tablet (640px - 1023px)
tablet: {
  layout: 'sm:grid-cols-2',
  sidebar: 'collapsible',
  cards: 'sm:col-span-1',
  padding: 'sm:p-6',
}

// Desktop (1024px+)
desktop: {
  layout: 'lg:grid-cols-12',
  sidebar: 'fixed visible',
  cards: 'proper grid distribution',
  padding: 'lg:p-8',
}
```

### Mobile Hamburger Menu
```typescript
// Add hamburger button for mobile
<button 
  className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 rounded-lg border border-slate-800"
  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
>
  <Menu className="h-6 w-6 text-slate-300" />
</button>

// Sidebar should slide in from left on mobile
<aside className={`
  fixed lg:static inset-y-0 left-0 z-40
  w-64 bg-slate-900 border-r border-slate-800
  transform transition-transform duration-300
  ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
  lg:translate-x-0
`}>
  {/* Sidebar content */}
</aside>

// Overlay when mobile menu is open
{mobileMenuOpen && (
  <div 
    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
    onClick={() => setMobileMenuOpen(false)}
  />
)}
```

---

## 🎬 Animation & Interaction Guidelines

### Page Load Animations
```typescript
// Stagger animations for sections
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// Apply to main container
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  <motion.div variants={itemVariants}>{/* Header */}</motion.div>
  <motion.div variants={itemVariants}>{/* Stats */}</motion.div>
  <motion.div variants={itemVariants}>{/* Progress */}</motion.div>
  {/* etc */}
</motion.div>
```

### Hover Interactions
```typescript
// Cards
hover: {
  transform: 'translateY(-4px) scale(1.01)',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
  transition: 'all 200ms ease-out',
}

// Buttons
hover: {
  transform: 'scale(1.02)',
  transition: 'all 150ms ease-out',
}
active: {
  transform: 'scale(0.98)',
}

// Navigation items
hover: {
  backgroundColor: 'rgba(30, 41, 59, 0.5)', // slate-800/50
  transition: 'all 200ms ease-out',
}
```

### Loading States
```typescript
// Skeleton loader for initial load
import { Skeleton } from '@/components/ui/skeleton';

<div className="space-y-6">
  <Skeleton className="h-48 w-full rounded-lg" /> {/* Header */}
  <div className="grid grid-cols-3 gap-6">
    <Skeleton className="h-32 rounded-lg" />
    <Skeleton className="h-32 rounded-lg" />
    <Skeleton className="h-32 rounded-lg" />
  </div>
  <Skeleton className="h-96 w-full rounded-lg" /> {/* Table */}
</div>
```

---

## 🧪 Testing Checklist

### Visual Testing
```
□ All colors follow the design system
□ Typography scale is consistent
□ Spacing is systematic (using only defined values)
□ Border radius is consistent
□ Shadows are applied correctly
□ Dark theme looks polished throughout
□ No text is too small (<14px)
□ No contrast issues (check with browser tools)
```

### Functional Testing
```
□ Time-based greeting changes correctly (test at different hours)
□ All navigation links work
□ Active navigation state updates
□ Subject dropdown updates progress chart
□ Progress bars animate on load
□ Achievement cards have hover effects
□ Leaderboard displays correctly
□ Today's lessons table is functional
□ All buttons have proper hover/active states
□ Mobile menu opens and closes smoothly
```

### Responsive Testing
```
□ Test at 320px (small mobile)
□ Test at 375px (iPhone)
□ Test at 768px (tablet)
□ Test at 1024px (laptop)
□ Test at 1920px (desktop)
□ Sidebar behavior correct at all breakpoints
□ Grid layouts adapt properly
□ Text remains readable at all sizes
□ Touch targets are ≥44px on mobile
```

### Accessibility Testing
```
□ Keyboard navigation works (Tab through all elements)
□ Focus indicators are visible
□ All images have alt text
□ All interactive elements have proper ARIA labels
□ Color contrast passes WCAG AA (use browser dev tools)
□ Screen reader testing (basic navigation)
□ No elements have outline-none without replacement
```

### Performance Testing
```
□ Initial page load < 3 seconds
□ No layout shift during load
□ Smooth animations (60fps)
□ Images are optimized
□ No console errors or warnings
```

---

## 📂 File Structure Summary

```
src/
├── components/
│   ├── ui/                              # shadcn/ui components
│   │   ├── card.tsx
│   │   ├── avatar.tsx
│   │   ├── progress.tsx
│   │   ├── select.tsx
│   │   ├── badge.tsx
│   │   ├── table.tsx
│   │   ├── skeleton.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── Sidebar.tsx                  # ✏️ UPDATE navigation
│   │   ├── DashboardLayout.tsx          # ✅ KEEP
│   │   └── MobileMenu.tsx               # 🆕 NEW
│   └── dashboard/
│       ├── DynamicHeader.tsx            # ✅ KEEP (enhance)
│       ├── StatsCards.tsx               # ✅ KEEP current 4 cards
│       ├── ProgressChart.tsx            # 🆕 NEW
│       ├── AchievementsSection.tsx      # 🆕 NEW
│       ├── PerformanceSection.tsx       # 🆕 NEW
│       ├── OverviewGrid.tsx             # 🆕 NEW
│       ├── LeaderBoard.tsx              # 🆕 NEW
│       └── TodaysLessons.tsx            # ✅ KEEP (enhance styling)
├── pages/
│   ├── Dashboard.tsx                    # ✏️ UPDATE (add new sections)
│   ├── Subjects.tsx                     # ✅ KEEP
│   ├── Lessons.tsx                      # ✅ KEEP
│   ├── Quiz.tsx                         # ✅ KEEP (was Quizzes)
│   ├── PastQuestions.tsx                # ✅ KEEP
│   ├── Reports.tsx                      # 🆕 NEW placeholder
│   ├── Subscription.tsx                 # 🆕 NEW placeholder
│   └── Support.tsx                      # ✅ KEEP
├── lib/
│   ├── utils.ts                         # ✅ KEEP
│   └── timeGreeting.ts                  # ✅ KEEP
├── types/
│   └── index.ts                         # ✏️ UPDATE (add new types)
└── App.tsx                              # ✏️ UPDATE routes
```

---

## 🎯 Implementation Priority

### Phase 1 - Core Layout (Day 1)
```
1. Update Sidebar navigation items
2. Ensure DynamicHeader follows design standards
3. Add mobile hamburger menu
4. Test responsive behavior
```

### Phase 2 - New Sections (Day 2)
```
5. Create ProgressChart component
6. Create AchievementsSection component
7. Create PerformanceSection component
8. Create OverviewGrid component
9. Create LeaderBoard component
```

### Phase 3 - Integration (Day 3)
```
10. Update Dashboard.tsx to include all new sections
11. Implement proper grid layout
12. Add loading states
13. Add animations
14. Test all interactions
```

### Phase 4 - Polish & Testing (Day 4)
```
15. Refine animations
16. Accessibility audit
17. Performance optimization
18. Cross-browser testing
19. Mobile testing
20. Fix any bugs
```

---

## 🚀 Getting Started Commands

```bash
# 1. Ensure all dependencies are installed
pnpm install

# 2. Install required shadcn/ui components
pnpm dlx shadcn@latest add card avatar progress select badge table dropdown-menu separator skeleton tabs

# 3. Start development server
pnpm dev

# 4. Open in browser
# http://localhost:5173 (or your configured port)
```

---

## 💾 Sample Data Structure

### types/index.ts
```typescript
// User
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level: number;
  role: 'student' | 'teacher' | 'admin';
}

// Subject Progress
export interface SubjectProgress {
  subject: string;
  completed: number;
  total: number;
  percentage: number;
  color: string;
  icon?: React.ReactNode;
}

// Achievement
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  earned: boolean;
  earnedDate?: string;
  category: 'streak' | 'score' | 'completion' | 'engagement';
}

// Leaderboard Entry
export interface LeaderboardEntry {
  rank: number;
  user: {
    name: string;
    avatar: string;
    level: number;
  };
  score: number;
  lastSeen: string;
  trend?: 'up' | 'down' | 'same';
}

// Lesson
export interface Lesson {
  id: string;
  subject: string;
  title: string;
  duration: number; // minutes
  progress: number; // percentage
  status: 'not-started' | 'in-progress' | 'completed';
  scheduledFor?: Date;
}

// Overview Stats
export interface OverviewStat {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconColor: string;
  change?: {
    value: number;
    trend: 'up' | 'down';
  };
  format?: 'number' | 'percentage' | 'time' | 'text';
}

// Dashboard Data
export interface DashboardData {
  user: User;
  subjects: SubjectProgress[];
  achievements: Achievement[];
  leaderboard: LeaderboardEntry[];
  todaysLessons: Lesson[];
  stats: OverviewStat[];
}
```

---

## 🎨 Design Token Reference

```typescript
// colors.ts - Use these exact values
export const colors = {
  // Backgrounds
  bg: {
    primary: 'rgb(2, 6, 23)',      // slate-950
    secondary: 'rgb(15, 23, 42)',  // slate-900
    tertiary: 'rgb(30, 41, 59)',   // slate-800
  },
  
  // Text
  text: {
    primary: 'rgb(241, 245, 249)',   // slate-100
    secondary: 'rgb(203, 213, 225)', // slate-300
    tertiary: 'rgb(148, 163, 184)',  // slate-400
    disabled: 'rgb(71, 85, 105)',    // slate-600
  },
  
  // Brand
  brand: {
    primary: 'rgb(37, 99, 235)',     // blue-600
    primaryHover: 'rgb(29, 78, 216)', // blue-700
    secondary: 'rgb(124, 58, 237)',  // purple-600
    accent: 'rgb(16, 185, 129)',     // emerald-500
  },
  
  // Semantic
  success: 'rgb(16, 185, 129)',  // emerald-500
  warning: 'rgb(245, 158, 11)',  // amber-500
  error: 'rgb(239, 68, 68)',     // red-500
  info: 'rgb(59, 130, 246)',     // blue-500
  
  // Borders
  border: 'rgba(51, 65, 85, 0.5)', // slate-700/50
};

// spacing.ts
export const spacing = {
  xs: '0.5rem',   // 8px
  sm: '1rem',     // 16px
  md: '1.5rem',   // 24px
  lg: '2rem',     // 32px
  xl: '3rem',     // 48px
  '2xl': '4rem',  // 64px
};

// typography.ts
export const typography = {
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

// borderRadius.ts
export const borderRadius = {
  sm: '0.375rem',  // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
};

// shadows.ts
export const shadows = {
  sm: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
  md: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
  lg: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
  colored: {
    blue: '0 10px 20px -5px rgba(59, 130, 246, 0.2)',
    purple: '0 10px 20px -5px rgba(124, 58, 237, 0.2)',
    emerald: '0 10px 20px -5px rgba(16, 185, 129, 0.2)',
  },
};
```

---

## 🎓 Best Practices Reminders

### Code Quality
```typescript
✅ DO:
- Use TypeScript for type safety
- Create reusable components
- Use proper semantic HTML
- Add meaningful comments
- Follow consistent naming (camelCase for variables, PascalCase for components)
- Extract magic numbers into constants
- Use proper error boundaries

❌ DON'T:
- Use 'any' type in TypeScript
- Inline large chunks of JSX
- Hardcode values that should be configurable
- Forget to handle loading/error states
- Use console.log in production code
- Create deeply nested components (max 3 levels)
```

### Performance
```typescript
✅ DO:
- Use React.memo for expensive components
- Implement proper key props in lists
- Lazy load routes
- Debounce search inputs
- Use proper image formats (WebP)
- Implement virtual scrolling for long lists

❌ DON'T:
- Create functions inside render
- Use inline object/array literals in props
- Fetch data on every render
- Create unnecessary re-renders
- Load all data upfront
```

### Accessibility
```typescript
✅ DO:
- Use semantic HTML (button, nav, main, etc.)
- Add ARIA labels where needed
- Ensure keyboard navigation
- Maintain focus management
- Test with screen readers
- Use proper heading hierarchy

❌ DON'T:
- Use div for everything
- Remove focus outlines without replacement
- Rely solely on color for information
- Create inaccessible custom controls
- Forget alt text on images
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Chart not rendering
```typescript
// Solution: Ensure ResponsiveContainer has explicit height
<ResponsiveContainer width="100%" height={250}>
  <PieChart>
    {/* Chart content */}
  </PieChart>
</ResponsiveContainer>
```

### Issue 2: Animations janky on mobile
```typescript
// Solution: Use GPU-accelerated properties
// ❌ Bad
transition: 'all 200ms'

// ✅ Good
transition: 'transform 200ms, opacity 200ms'
transform: 'translateY(-4px)' // GPU accelerated
```

### Issue 3: Dark mode flicker
```typescript
// Solution: Set theme class on HTML element before render
// In index.html or _document.tsx
<script>
  document.documentElement.classList.add('dark');
</script>
```

### Issue 4: Tailwind classes not working
```typescript
// Solution: Ensure classes are complete strings, not concatenated
// ❌ Bad
className={`text-${color}-500`}

// ✅ Good
className={color === 'blue' ? 'text-blue-500' : 'text-purple-500'}
```

---

## 📚 Additional Resources

### Documentation
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Recharts Docs](https://recharts.org)
- [Lucide Icons](https://lucide.dev)
- [Aceternity UI](https://ui.aceternity.com)

### Tools
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) - VS Code extension
- [Contrast Checker](https://webaim.org/resources/contrastchecker/) - WCAG compliance
- [React DevTools](https://react.dev/learn/react-developer-tools) - Debugging
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance audit

---

## ✅ Final Checklist Before Submission

```
Setup:
□ All pnpm packages installed
□ shadcn/ui components added
□ MCP servers configured
□ Environment variables set

Implementation:
□ All 7 new components created
□ Sidebar navigation updated
□ Dashboard layout integrated
□ Responsive design implemented
□ Animations added
□ Loading states implemented
□ Error handling added

Design Standards:
□ Follows color system exactly
□ Uses spacing scale consistently
□ Typography scale adhered to
□ Border radius consistent
□ Shadows applied correctly
□ Dark theme polished

Quality:
□ TypeScript types defined
□ No console errors
□ No TypeScript errors
□ Code is well-commented
□ Components are reusable
□ Performance optimized

Testing:
□ All features work
□ Responsive on all breakpoints
□ Keyboard navigation works
□ Accessibility standards met
□ Cross-browser tested
□ Mobile tested on real device

Documentation:
□ README updated
□ Component props documented
□ Setup instructions clear
□ Known issues documented
```

---

## 🎉 Success Criteria

Your dashboard implementation is complete when:

1. ✨ **Visual Excellence**: Matches design system perfectly with consistent styling
2. 🚀 **Performance**: Loads in < 3 seconds, animations are smooth (60fps)
3. ♿ **Accessibility**: Passes WCAG AA, keyboard navigable, screen reader friendly
4. 📱 **Responsive**: Works flawlessly on mobile, tablet, and desktop
5. 🎯 **Functional**: All features work, no bugs, proper error handling
6. 🧹 **Code Quality**: Clean, typed, well-organized, reusable components
7. 📖 **Documented**: Clear comments, README, easy for others to understand

---

**Now go build something amazing! 🚀**

Remember: Progress over perfection. Start with Phase 1, get it working, then iterate. The design system and guidelines are here to help you make consistent decisions quickly. When in doubt, refer back to the Essential Design Rules.

Good luck, and happy coding! 💻✨