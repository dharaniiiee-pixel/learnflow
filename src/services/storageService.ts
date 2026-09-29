import { 
  UserProfile, 
  StudyPlan, 
  SolvedDoubt, 
  GeneratedNotes, 
  Quiz, 
  StudySessionLog, 
  AcademicResource, 
  UserSettings 
} from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'studymate_profile_v1',
  STUDY_PLANS: 'studymate_plans_v1',
  SOLVED_DOUBTS: 'studymate_doubts_v1',
  NOTES: 'studymate_notes_v1',
  QUIZZES: 'studymate_quizzes_v1',
  STUDY_LOGS: 'studymate_logs_v1',
  SETTINGS: 'studymate_settings_v1',
  BOOKMARKED_RESOURCES: 'studymate_bookmarked_res_v1',
};

export const defaultSettings: UserSettings = {
  darkMode: false,
  aiPersona: 'socratic',
  dailyStudyGoalMinutes: 180, // 3 hours
  soundEffects: true,
  notificationsEnabled: true,
  pomodoroWorkMinutes: 25,
  pomodoroBreakMinutes: 5,
};

export const defaultProfile: UserProfile = {
  id: 'usr_default_01',
  name: 'Alex Johnson',
  email: 'alex.j@university.edu',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  major: 'Computer Science & Mathematics',
  institution: 'Pacific State University',
  year: 'Sophomore (Year 2)',
  targetGpa: '3.90',
  currentGpa: '3.82',
  streakDays: 8,
  totalStudyHours: 42.5,
  quizzesCompleted: 14,
  notesGenerated: 23,
  doubtsSolved: 19,
  goals: [
    {
      id: 'g_1',
      title: 'Master Graph Algorithms (Dijkstra, Bellman-Ford, A*)',
      subject: 'Computer Science',
      progress: 75,
      dueDate: '2026-10-15',
      completed: false,
    },
    {
      id: 'g_2',
      title: 'Score 95%+ in Multivariable Calculus Midterm',
      subject: 'Mathematics',
      progress: 60,
      dueDate: '2026-10-22',
      completed: false,
    },
    {
      id: 'g_3',
      title: 'Complete Organic Chemistry Reaction Mechanisms Review',
      subject: 'Chemistry',
      progress: 90,
      dueDate: '2026-10-05',
      completed: false,
    },
  ],
};

export const defaultStudyPlans: StudyPlan[] = [
  {
    id: 'plan_calc_1',
    subject: 'Mathematics (Calculus II & Differential Equations)',
    targetGoal: 'Ace Midterm Exam & Master Integration Techniques',
    examDate: '2026-10-28',
    dailyHours: 2.5,
    learningStyle: 'practical',
    difficulty: 'Advanced',
    createdAt: '2026-09-24',
    totalTasks: 12,
    completedTasks: 5,
    weeks: [
      {
        weekNumber: 1,
        title: 'Techniques of Integration & Improper Integrals',
        objective: 'Master integration by parts, trigonometric substitutions, and partial fractions.',
        days: [
          {
            dayNumber: 1,
            dayTitle: 'Integration by Parts Mastery',
            focusArea: 'Tabular method & logarithmic integrals',
            tasks: [
              {
                id: 't_1',
                title: 'Review LIATE rule and derivation from product rule',
                description: 'Understand when to pick u vs dv and edge cases like cyclic integrals.',
                estimatedMinutes: 45,
                completed: true,
                priority: 'high',
                topic: 'Integration by Parts',
              },
              {
                id: 't_2',
                title: 'Solve 10 Tabular Method challenge problems',
                description: 'Focus on polynomial times exponential and trigonometric functions.',
                estimatedMinutes: 60,
                completed: true,
                priority: 'medium',
                topic: 'Problem Solving',
              },
            ],
          },
          {
            dayNumber: 2,
            dayTitle: 'Trigonometric Integrals & Substitution',
            focusArea: 'Powers of sin/cos and tan/sec substitutions',
            tasks: [
              {
                id: 't_3',
                title: 'Derive Weierstrass substitution formula',
                description: 'Rationalizing substitutions for stubborn rational trig expressions.',
                estimatedMinutes: 40,
                completed: true,
                priority: 'medium',
                topic: 'Theory & Formulae',
              },
              {
                id: 't_4',
                title: 'Complete 8 Tri-sub exercises (sqrt(a^2 - x^2), sqrt(a^2 + x^2))',
                description: 'Draw right triangles to convert angles back to x coordinates.',
                estimatedMinutes: 60,
                completed: true,
                priority: 'high',
                topic: 'Practice',
              },
            ],
          },
          {
            dayNumber: 3,
            dayTitle: 'Partial Fraction Decomposition',
            focusArea: 'Linear & irreducible quadratic factors',
            tasks: [
              {
                id: 't_5',
                title: 'Master Heaviside cover-up method for distinct linear terms',
                description: 'Fast shortcut for decomposing complex rational fractions.',
                estimatedMinutes: 30,
                completed: true,
                priority: 'medium',
                topic: 'Shortcuts',
              },
              {
                id: 't_6',
                title: 'Timed Mock Drill: 5 Mixed Integration Questions',
                description: 'Self-evaluate speed and accuracy under exam constraints.',
                estimatedMinutes: 50,
                completed: false,
                priority: 'high',
                topic: 'Mock Test',
              },
            ],
          },
        ],
      },
      {
        weekNumber: 2,
        title: 'Infinite Series, Convergence Tests, and Taylor Series',
        objective: 'Recognize test conditions (Ratio, Root, Integral, Alternating Series) and calculate radius of convergence.',
        days: [
          {
            dayNumber: 4,
            dayTitle: 'Convergence Tests Arsenal',
            focusArea: 'Direct vs Limit Comparison Tests',
            tasks: [
              {
                id: 't_7',
                title: 'Create comparative summary chart of 8 convergence tests',
                description: 'Include conditions, edge cases, and test failures.',
                estimatedMinutes: 45,
                completed: false,
                priority: 'medium',
                topic: 'Study Guide',
              },
              {
                id: 't_8',
                title: 'Solve 12 series convergence classification problems',
                description: 'Identify the fastest test for various algebraic expressions.',
                estimatedMinutes: 60,
                completed: false,
                priority: 'high',
                topic: 'Problem Solving',
              },
            ],
          },
        ],
      },
    ],
  },
];

export const defaultSolvedDoubts: SolvedDoubt[] = [
  {
    id: 'd_1',
    title: 'Intuition behind Time Complexity of Merge Sort vs Quick Sort',
    subject: 'Computer Science',
    question: 'Why is Merge Sort always O(N log N) while Quick Sort can degrade to O(N^2), but in practice Quick Sort is often faster?',
    createdAt: '2026-09-27',
    bookmarked: true,
    messages: [
      {
        id: 'dm_1',
        sender: 'user',
        text: 'Why is Merge Sort always O(N log N) while Quick Sort can degrade to O(N^2), but in practice Quick Sort is often faster?',
        timestamp: '10:14 AM',
      },
      {
        id: 'dm_2',
        sender: 'ai',
        text: 'Great algorithmic question! The difference comes down to tree balance guarantees, cache locality, and auxiliary memory allocation.',
        timestamp: '10:14 AM',
        keyConcept: 'Divide and conquer recursion tree depth combined with hardware cache friendliness.',
        stepBreakdown: [
          {
            stepNumber: 1,
            title: 'Divide Guarantee vs Pivot Dependency',
            explanation: 'Merge Sort unconditionally splits the array into exact halves (N/2, N/2), guaranteeing a recursion tree height of exactly log2(N). Quick Sort depends on the pivot choice; if the smallest or largest element is picked every time (e.g. sorted array with naive pivot), the partitions become 1 and N-1, creating an unbalanced tree of height N with sum(1..N) = O(N^2).',
            formulaOrCode: 'T(N) = 2T(N/2) + O(N) => O(N log N) [Merge Sort]\nT(N) = T(N-1) + O(N) => O(N^2) [Worst Quick Sort]',
          },
          {
            stepNumber: 2,
            title: 'Cache Locality & Constant Factors (Why Quick Sort Wins in Practice)',
            explanation: 'Quick Sort partitions elements in-place with sequential memory access patterns that CPU caches adore (L1/L2 hits). Merge Sort requires allocating a temporary auxiliary array of size O(N), leading to memory copying overhead and frequent cache misses.',
            formulaOrCode: '// QuickSort: in-place swapping\nswap(&arr[i], &arr[j]);',
          },
          {
            stepNumber: 3,
            title: 'Real-world Hybrid Solutions',
            explanation: 'Modern production standard libraries use Introsort (starts with Quick Sort, switches to Heap Sort if recursion exceeds 2*log(N) to prevent O(N^2)) or Timsort (for Python/Java objects).',
          },
        ],
        commonPitfall: 'Assuming big-O notation accounts for hardware cache lines and constant multiplier factors. Big-O only describes asymptotic growth.',
        followUpQuestion: 'Would you like to analyze how 3-way partitioning handles arrays with duplicate keys?',
      },
    ],
  },
  {
    id: 'd_2',
    title: 'How does Lenz\'s Law enforce Conservation of Energy in Faraday\'s Law?',
    subject: 'Physics',
    question: 'Why must the induced current in a loop oppose the change in magnetic flux rather than reinforce it?',
    createdAt: '2026-09-26',
    bookmarked: false,
    messages: [
      {
        id: 'dm_3',
        sender: 'user',
        text: 'Why must the induced current in a loop oppose the change in magnetic flux rather than reinforce it?',
        timestamp: '03:40 PM',
      },
      {
        id: 'dm_4',
        sender: 'ai',
        text: 'This is a foundational concept in electromagnetism! If the induced magnetic field reinforced the flux change, it would violate the First Law of Thermodynamics.',
        timestamp: '03:41 PM',
        keyConcept: 'Lenz\'s Law negative sign in EMF = -d(Phi)/dt is a mathematical manifestation of energy conservation.',
        stepBreakdown: [
          {
            stepNumber: 1,
            title: 'The Counter-Factual Thought Experiment',
            explanation: 'Imagine a north pole approaching a closed conducting ring. If the induced current produced a south pole facing the magnet, it would attract the magnet, pulling it in faster without any external work.',
          },
          {
            stepNumber: 2,
            title: 'Runaway Perpetual Energy Paradox',
            explanation: 'As the magnet accelerates faster, d(Phi)/dt increases further, producing stronger attraction and infinite kinetic energy from nothing! To prevent this impossibility, nature pushes back: the ring creates a like pole (North facing North), requiring external mechanical work to push the magnet forward.',
            formulaOrCode: 'EMF = - \\frac{d\\Phi_B}{dt}',
          },
          {
            stepNumber: 3,
            title: 'Work Converted to Joule Heating',
            explanation: 'The mechanical work done against the magnetic repulsive force equals the electrical energy dissipated as heat (I^2 * R * t) in the conductor wire.',
          },
        ],
        commonPitfall: 'Thinking that induced current opposes the magnetic field itself. It only opposes the CHANGE in magnetic flux.',
        followUpQuestion: 'Would you like to examine what happens when the magnet is pulled away instead of pushed in?',
      },
    ],
  },
];

export const defaultNotes: GeneratedNotes[] = [
  {
    id: 'note_1',
    title: 'Cellular Respiration & ATP Synthase Mechanism',
    subject: 'Biology',
    format: 'cornell',
    createdAt: '2026-09-25',
    cornell: {
      cues: [
        'Glycolysis location & net ATP',
        'Krebs / TCA cycle inputs',
        'Chemiosmosis & Proton Gradient',
        'Role of Oxygen as terminal acceptor',
      ],
      notes: [
        {
          section: '1. Glycolysis (Cytosol)',
          points: [
            'Glucose (6C) is cleaved into 2 Pyruvate (3C).',
            'Invests 2 ATP, yields 4 ATP via substrate-level phosphorylation -> Net yield: 2 ATP + 2 NADH.',
            'Anaerobic process (does not require O2).',
          ],
        },
        {
          section: '2. Citric Acid Cycle (Mitochondrial Matrix)',
          points: [
            'Pyruvate converted to Acetyl-CoA via Pyruvate Dehydrogenase complex.',
            'Combines with Oxaloacetate (4C) to form Citrate (6C).',
            'Generates per glucose: 6 NADH, 2 FADH2, 2 GTP/ATP, and releases 4 CO2.',
          ],
        },
        {
          section: '3. Oxidative Phosphorylation (Inner Mitochondrial Membrane)',
          points: [
            'Electron transport chain (Complexes I-IV) transfers electrons from NADH/FADH2 to O2.',
            'Protons (H+) are pumped from matrix into intermembrane space, creating steep electrochemical gradient.',
            'ATP Synthase rotary motor drives phosphorylation of ADP + Pi -> ATP.',
            'Total theoretical yield: ~30-32 ATP per glucose molecule.',
          ],
        },
      ],
      summary: 'Cellular respiration converts glucose into usable cellular currency (ATP) in 3 stages: Glycolysis (cytoplasm, net 2 ATP), Krebs Cycle (matrix, high-energy electron carriers), and Oxidative Phosphorylation (membrane, proton motive force powers ATP Synthase to generate bulk ATP). Oxygen is required as the final electron acceptor, forming H2O.',
    },
  },
  {
    id: 'note_2',
    title: 'Dynamic Programming & Memoization Essentials',
    subject: 'Computer Science',
    format: 'cheatsheet',
    createdAt: '2026-09-26',
    cheatsheet: {
      keyTerms: [
        { term: 'Optimal Substructure', definition: 'The optimal solution to the problem can be constructed from optimal solutions to its subproblems.' },
        { term: 'Overlapping Subproblems', definition: 'The space of subproblems is small; the recursive algorithm solves the same subproblems repeatedly rather than generating new ones.' },
        { term: 'Memoization (Top-Down)', definition: 'Recursive formulation caching intermediate results in a hash table or array to eliminate redundant branches.' },
        { term: 'Tabulation (Bottom-Up)', definition: 'Iterative approach filling a table starting from base cases up to the desired target.' },
      ],
      formulas: [
        { name: 'Fibonacci State Recurrence', formula: 'dp[i] = dp[i-1] + dp[i-2]', explanation: 'Base cases: dp[0]=0, dp[1]=1' },
        { name: '0/1 Knapsack Recurrence', formula: 'dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w - wt[i-1]])', explanation: 'Decide whether to include item i given remaining capacity w.' },
        { name: 'Longest Common Subsequence', formula: 'dp[i][j] = (s1[i]==s2[j]) ? 1 + dp[i-1][j-1] : max(dp[i-1][j], dp[i][j-1])', explanation: 'Character match extends sequence diagonal; mismatch branches left/up.' },
      ],
      rulesAndLaws: [
        'Always establish base cases first before writing the recurrence relation.',
        'State space reduction: If current state only depends on the previous row or k elements, reduce space complexity from O(N*W) to O(W) with rolling arrays.',
        'Check for cyclic dependencies; DP only applies to Directed Acyclic Graphs (DAGs) of states.',
      ],
      examTips: [
        'Draw the recursion tree for small n (n=3 or 4) to visually spot redundant subtree calculations.',
        'When space complexity optimization is requested, look for the minimum state variables necessary.',
      ],
    },
  },
];

export const defaultQuizzes: Quiz[] = [
  {
    id: 'quiz_dsa_1',
    title: 'Data Structures & Algorithmic Complexity',
    subject: 'Computer Science',
    difficulty: 'Intermediate',
    timeLimitMinutes: 10,
    completed: true,
    score: 4,
    totalScore: 5,
    takenAt: '2026-09-27',
    questions: [
      {
        id: 'q_1',
        question: 'What is the worst-case time complexity of searching for an element in an unbalanced Binary Search Tree (BST)?',
        type: 'multiple-choice',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
        correctAnswer: 'O(N)',
        userAnswer: 'O(N)',
        isCorrect: true,
        explanation: 'In the worst case (e.g. elements inserted in sorted order), the BST degenerates into a singly linked list, requiring linear O(N) comparisons.',
      },
      {
        id: 'q_2',
        question: 'Which data structure is typically utilized to implement Breadth-First Search (BFS) on a graph?',
        type: 'multiple-choice',
        options: ['Stack', 'FIFO Queue', 'Priority Queue', 'Disjoint Set'],
        correctAnswer: 'FIFO Queue',
        userAnswer: 'FIFO Queue',
        isCorrect: true,
        explanation: 'BFS explores neighbor nodes level by level using a First-In-First-Out (FIFO) queue.',
      },
      {
        id: 'q_3',
        question: 'True or False: Hash table lookups are guaranteed to be O(1) in the worst case.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 'False',
        userAnswer: 'False',
        isCorrect: true,
        explanation: 'If all keys hash to the same bucket (hash collision attack or catastrophic collision), lookups degrade to O(N) unless balanced trees are used (which gives O(log N)).',
      },
      {
        id: 'q_4',
        question: 'What is the space complexity of merge sort on an array of N integers?',
        type: 'multiple-choice',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
        correctAnswer: 'O(N)',
        userAnswer: 'O(log N)',
        isCorrect: false,
        explanation: 'Merge sort requires an auxiliary array of size O(N) to merge the partitioned sub-arrays.',
      },
      {
        id: 'q_5',
        question: 'Which algorithm is specifically designed to find the Shortest Path in a weighted graph with non-negative edge weights?',
        type: 'multiple-choice',
        options: ['Dijkstra\'s Algorithm', 'Kruskal\'s Algorithm', 'Floyd-Warshall', 'Tarjan\'s Algorithm'],
        correctAnswer: 'Dijkstra\'s Algorithm',
        userAnswer: 'Dijkstra\'s Algorithm',
        isCorrect: true,
        explanation: 'Dijkstra uses a greedy priority queue approach to find shortest paths from a single source on graphs with non-negative edge weights.',
      },
    ],
  },
  {
    id: 'quiz_calc_2',
    title: 'Differential Calculus & Derivatives Challenge',
    subject: 'Mathematics',
    difficulty: 'Intermediate',
    timeLimitMinutes: 8,
    completed: false,
    questions: [
      {
        id: 'qc_1',
        question: 'What is the derivative of f(x) = ln(cos(x)) with respect to x?',
        type: 'multiple-choice',
        options: ['tan(x)', '-tan(x)', 'sec(x)', '-cot(x)'],
        correctAnswer: '-tan(x)',
        explanation: 'Using the chain rule: d/dx[ln(u)] = (1/u) * u\'. Here u = cos(x), so u\' = -sin(x). Thus (-sin(x))/cos(x) = -tan(x).',
      },
      {
        id: 'qc_2',
        question: 'If f\'(c) = 0 and f\'\'(c) < 0, what does the Second Derivative Test indicate about point c?',
        type: 'multiple-choice',
        options: ['Local Minimum', 'Local Maximum', 'Inflection Point', 'Inconclusive'],
        correctAnswer: 'Local Maximum',
        explanation: 'When the first derivative is zero and the second derivative is negative, the function is concave down, meaning c is a local maximum.',
      },
      {
        id: 'qc_3',
        question: 'True or False: A function must be continuous at x = a to be differentiable at x = a.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Differentiability implies continuity. If a function is not continuous at a point, it cannot be differentiable there.',
      },
      {
        id: 'qc_4',
        question: 'What is the limit of (sin x) / x as x approaches 0?',
        type: 'multiple-choice',
        options: ['0', '1', 'Infinity', 'Undefined'],
        correctAnswer: '1',
        explanation: 'By L\'Hopital\'s rule or geometric squeeze theorem, lim x->0 sin(x)/x = cos(0)/1 = 1.',
      },
    ],
  },
];

export const defaultStudyLogs: StudySessionLog[] = [
  { id: 'log_1', subject: 'Computer Science', minutes: 75, date: '2026-09-28', notes: 'Mastered Red-Black tree insertion cases and color rotation invariants.' },
  { id: 'log_2', subject: 'Mathematics', minutes: 90, date: '2026-09-27', notes: 'Solved 15 integration by parts exercises and tabular shortcuts.' },
  { id: 'log_3', subject: 'Physics', minutes: 60, date: '2026-09-27', notes: 'Faraday\'s law and Lenz\'s law induction loop problems.' },
  { id: 'log_4', subject: 'Biology', minutes: 45, date: '2026-09-26', notes: 'Reviewed electron transport chain complexes and ATP yield calculations.' },
  { id: 'log_5', subject: 'Computer Science', minutes: 80, date: '2026-09-25', notes: 'Implemented Top-Down vs Bottom-Up Knapsack algorithm in TypeScript.' },
  { id: 'log_6', subject: 'Chemistry', minutes: 60, date: '2026-09-24', notes: 'Acid-base buffer equilibrium and Henderson-Hasselbalch equation.' },
  { id: 'log_7', subject: 'Mathematics', minutes: 50, date: '2026-09-23', notes: 'Partial fractions decomposition practice set.' },
];

export const defaultResources: AcademicResource[] = [
  {
    id: 'res_1',
    title: 'Calculus & Integration Master Formula Sheet',
    subject: 'Mathematics',
    category: 'Formula Sheet',
    description: 'High-density printable reference covering all standard integral forms, trigonometric substitutions, series convergence tests, and Taylor expansions.',
    authorOrSource: 'MIT OpenCourseWare / StudyMate Academic Team',
    url: '#',
    downloadsCount: 1420,
    tags: ['Calculus', 'Integrals', 'Formulas', 'Cheat Sheet'],
  },
  {
    id: 'res_2',
    title: 'Data Structures & Algorithms Visualizer Guide',
    subject: 'Computer Science',
    category: 'Interactive Tool',
    description: 'Step-by-step interactive visual breakdowns of sorting algorithms, graph traversals, and dynamic programming tree memoization.',
    authorOrSource: 'Stanford CS Education Collective',
    url: '#',
    downloadsCount: 2890,
    tags: ['Algorithms', 'Data Structures', 'Visual Guide', 'LeetCode Prep'],
  },
  {
    id: 'res_3',
    title: 'Physics Mechanics & Electromagnetism Derivation Handbook',
    subject: 'Physics',
    category: 'Cheat Sheet',
    description: 'Concise derivations for Maxwell\'s equations, Lagrangian dynamics, rotational inertia formulas, and relativistic kinematics.',
    authorOrSource: 'CERN Academic Outreach',
    url: '#',
    downloadsCount: 980,
    tags: ['Physics', 'Electromagnetism', 'Mechanics', 'Derivations'],
  },
  {
    id: 'res_4',
    title: 'Organic Chemistry Reaction Mechanisms Quick Reference',
    subject: 'Chemistry',
    category: 'Cheat Sheet',
    description: 'Arrow-pushing guide for SN1, SN2, E1, E2, electrophilic aromatic substitution, and carbonyl additions with stereochemistry tips.',
    authorOrSource: 'ACS Division of Chemical Education',
    url: '#',
    downloadsCount: 1750,
    tags: ['Organic Chemistry', 'Reactions', 'Mechanisms', 'MCAT'],
  },
  {
    id: 'res_5',
    title: 'Biochemistry Pathways & Metabolic Maps',
    subject: 'Biology',
    category: 'Textbook Guide',
    description: 'High-resolution diagrammatic guide connecting Glycolysis, Krebs cycle, Pentose Phosphate shunt, and Beta-Oxidation.',
    authorOrSource: 'NCBI Bookshelf & Cell Press',
    url: '#',
    downloadsCount: 1120,
    tags: ['Biochemistry', 'Metabolism', 'Biology', 'Cellular Respiration'],
  },
  {
    id: 'res_6',
    title: 'Effective Academic Writing & Research Paper Architecture',
    subject: 'Literature & Writing',
    category: 'Textbook Guide',
    description: 'A comprehensive playbook for thesis statements, literature reviews, APA/IEEE citation standards, and peer-review preparation.',
    authorOrSource: 'Harvard Writing Center',
    url: '#',
    downloadsCount: 830,
    tags: ['Academic Writing', 'Research Papers', 'Citations', 'Thesis'],
  },
];

// Local Storage Helper Functions
export const storageService = {
  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  },
  saveProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  getStudyPlans(): StudyPlan[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDY_PLANS);
      return data ? JSON.parse(data) : defaultStudyPlans;
    } catch {
      return defaultStudyPlans;
    }
  },
  saveStudyPlans(plans: StudyPlan[]): void {
    localStorage.setItem(STORAGE_KEYS.STUDY_PLANS, JSON.stringify(plans));
  },

  getSolvedDoubts(): SolvedDoubt[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SOLVED_DOUBTS);
      return data ? JSON.parse(data) : defaultSolvedDoubts;
    } catch {
      return defaultSolvedDoubts;
    }
  },
  saveSolvedDoubts(doubts: SolvedDoubt[]): void {
    localStorage.setItem(STORAGE_KEYS.SOLVED_DOUBTS, JSON.stringify(doubts));
  },

  getNotes(): GeneratedNotes[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES);
      return data ? JSON.parse(data) : defaultNotes;
    } catch {
      return defaultNotes;
    }
  },
  saveNotes(notes: GeneratedNotes[]): void {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  },

  getQuizzes(): Quiz[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUIZZES);
      return data ? JSON.parse(data) : defaultQuizzes;
    } catch {
      return defaultQuizzes;
    }
  },
  saveQuizzes(quizzes: Quiz[]): void {
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
  },

  getStudyLogs(): StudySessionLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDY_LOGS);
      return data ? JSON.parse(data) : defaultStudyLogs;
    } catch {
      return defaultStudyLogs;
    }
  },
  saveStudyLogs(logs: StudySessionLog[]): void {
    localStorage.setItem(STORAGE_KEYS.STUDY_LOGS, JSON.stringify(logs));
  },

  getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  },
  saveSettings(settings: UserSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  getBookmarkedResourceIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKED_RESOURCES);
      return data ? JSON.parse(data) : ['res_1', 'res_2'];
    } catch {
      return ['res_1', 'res_2'];
    }
  },
  saveBookmarkedResourceIds(ids: string[]): void {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKED_RESOURCES, JSON.stringify(ids));
  },

  resetAllData(): void {
    localStorage.clear();
  },
};
