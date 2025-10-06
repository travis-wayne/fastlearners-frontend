# Fast Learner - Nigerian Education System

## 🎓 Overview

Fast Learner now includes a comprehensive **Nigerian Education System** implementation, designed specifically for Nigerian schools, students, and educators. The system follows the official Nigerian curriculum structure and educational standards.

## 🏫 Educational Structure

### Class Levels

- **Primary Education**: Primary 1-6 (ages 6-12)
- **Junior Secondary School (JSS)**: JSS 1-3 (ages 13-15)
- **Senior Secondary School (SSS)**: SSS 1-3 (ages 16-18)
  - Science Track (Physics, Chemistry, Biology)
  - Arts Track (Literature, Government, History)
  - Commercial Track (Accounting, Economics, Commerce)

### Academic Calendar

- **3 Terms per year**: 1st Term, 2nd Term, 3rd Term
- **Term Duration**: 10-14 weeks each
- **Assessment**: 40% Continuous Assessment + 60% Examination

## 🚀 Key Features

### 📚 Subjects Management

- Complete Nigerian curriculum subjects
- Class-specific subject allocation
- Progress tracking per subject
- Scheme of work integration

### 📖 Interactive Lessons

- Multimedia lesson content
- Progress tracking with timers
- Prerequisite and sequence management
- Nigerian curriculum-aligned content

### 🧪 Quiz System

- Multiple question types (MCQ, True/False, Fill-in-blank)
- Topic, term, and comprehensive assessments
- Timer-based quizzes
- Automatic scoring and feedback

### 📋 Past Questions

- WAEC, NECO, and JAMB question banks
- Practice mode with explanations
- Subject and year filtering
- Performance tracking

### 📊 Academic Records

- Nigerian grading system (A1-F9)
- CA and Examination score breakdown
- Term-wise performance analysis
- Class position tracking

## 🛠️ Technical Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Context + localStorage

## 📱 Pages & Navigation

```
/dashboard/
├── subjects/          # Subject overview with scheme of work
│   └── [id]/         # Individual subject details
├── lessons/          # Interactive lesson system
│   └── [id]/        # Lesson player
├── quizzes/         # Assessment management
│   └── [id]/       # Quiz runner
├── past-questions/  # Exam practice
└── records/        # Academic performance
```

## 🎯 Nigerian Standards Compliance

### Curriculum Subjects

- **Primary**: English, Mathematics, Basic Science, Social Studies, Civic Education
- **JSS**: Core subjects + Basic Technology, Computer Studies, Business Studies
- **SSS**: Track-specific subjects with electives

### Assessment System

- **Continuous Assessment (40%)**:
  - Classwork: 10%
  - Assignments: 10%
  - Tests: 20%
- **Examinations (60%)**
- **Grading**: A1 (75-100) to F9 (0-39)

### Academic Calendar

- **1st Term**: September - December (13-14 weeks)
- **2nd Term**: January - April (11-12 weeks)
- **3rd Term**: May - July (10-11 weeks)

## 🔧 Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/fast-leaner-frontend.git
   cd fast-leaner-frontend
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Run development server**

   ```bash
   pnpm run dev
   ```

4. **Build for production**
   ```bash
   pnpm run build
   ```

## 📋 Features Status

✅ **Completed**

- Nigerian education system configuration
- Academic context management (class/term selection)
- Subject management with scheme of work
- Interactive lesson system
- Comprehensive quiz system
- Past questions practice (WAEC/NECO/JAMB)
- Academic records and performance tracking
- Responsive UI with proper navigation
- Build verification and testing

## 🎨 UI Components

### Academic Selector

Multi-variant component for class and term selection with proper Nigerian educational terminology.

### Subject Cards

Progress tracking, grading integration, and assessment status for each subject.

### Lesson Player

Interactive content delivery with media support and progress tracking.

### Quiz Runner

Timer-based assessments with multiple question types and automatic scoring.

## 📖 Usage

1. **Select Class & Term**: Choose your current class (Primary 1-SSS 3) and term (1st-3rd)
2. **Browse Subjects**: View available subjects for your class level
3. **Study Lessons**: Access interactive lessons with progress tracking
4. **Take Quizzes**: Complete assessments to test your knowledge
5. **Practice Past Questions**: Prepare for WAEC, NECO, and JAMB exams
6. **Track Performance**: Monitor your academic progress and grades

## 🚀 Next Steps

### Phase 2 Development

- Real-time collaboration features
- Parent/Guardian dashboard
- Teacher content management
- Multi-school deployment
- Offline mode support

### Integration Opportunities

- School Management Systems
- Learning Management Systems
- Government education portals
- Examination bodies (WAEC, NECO, JAMB)

## 📞 Support

For questions about the Nigerian Education System implementation:

- Check the [Nigerian Education System Documentation](./NIGERIAN_EDUCATION_SYSTEM.md)
- Review the [Implementation Guide](./docs/nigerian-education-guide.md)
- Contact the development team

## 🤝 Contributing

We welcome contributions to improve the Nigerian education system implementation:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built for Nigerian Education** 🇳🇬  
_Empowering students, teachers, and schools across Nigeria with modern educational technology._
