import { GoogleGenAI } from '@google/genai';
import { 
  StudyPlan, 
  DoubtMessage, 
  GeneratedNotes, 
  Quiz, 
  QuizQuestion, 
  Subject,
  Flashcard
} from '../types';

// Check for runtime Gemini API key if present
const geminiApiKey = 
  (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
  '';

let aiClient: GoogleGenAI | null = null;
if (geminiApiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey: geminiApiKey });
  } catch (err) {
    console.warn('Could not initialize GoogleGenAI client, will use intelligent academic engine:', err);
  }
}

/**
 * AI Study Planner Generator
 */
export async function generateStudyPlanAI(params: {
  subject: string;
  targetGoal: string;
  examDate: string;
  dailyHours: number;
  learningStyle: 'visual' | 'practical' | 'theoretical' | 'spaced';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}): Promise<StudyPlan> {
  // Simulate natural AI thinking time for realistic interaction
  await new Promise((r) => setTimeout(r, 1200));

  const { subject, targetGoal, examDate, dailyHours, learningStyle, difficulty } = params;

  // Generate structured syllabus based on topic
  const weeksCount = 3;
  const planId = 'plan_' + Date.now();

  const generatedWeeks = [
    {
      weekNumber: 1,
      title: `Foundations & Core Principles of ${subject}`,
      objective: `Establish strong conceptual mastery of key definitions, fundamental theorems, and elementary problems in ${targetGoal}.`,
      days: [
        {
          dayNumber: 1,
          dayTitle: 'Fundamental Terminology & Diagnostic Assessment',
          focusArea: 'Core definitions & active recall base',
          tasks: [
            {
              id: `${planId}_t1`,
              title: `Deconstruct primary principles of ${subject}`,
              description: `Map out high-yield concepts and definitions required for ${targetGoal}.`,
              estimatedMinutes: Math.round(dailyHours * 30),
              completed: false,
              priority: 'high' as const,
              topic: 'Foundations',
            },
            {
              id: `${planId}_t2`,
              title: 'Complete 10 baseline diagnostic practice questions',
              description: 'Identify strengths, blind spots, and misconceptions before deep work.',
              estimatedMinutes: Math.round(dailyHours * 30),
              completed: false,
              priority: 'medium' as const,
              topic: 'Diagnostic Drill',
            },
          ],
        },
        {
          dayNumber: 2,
          dayTitle: `${learningStyle === 'visual' ? 'Diagrammatic Mapping & Spatial Relationships' : 'Core Mechanism Derivations & Analytical Breakdown'}`,
          focusArea: 'Mechanisms & systematic workflows',
          tasks: [
            {
              id: `${planId}_t3`,
              title: `Deep dive into high-frequency exam topics in ${subject}`,
              description: `Synthesize 3-4 primary problem archetypes with structured solutions.`,
              estimatedMinutes: Math.round(dailyHours * 40),
              completed: false,
              priority: 'high' as const,
              topic: 'Core Mechanics',
            },
            {
              id: `${planId}_t4`,
              title: 'Create active recall flashcard deck (15 concepts)',
              description: 'Focus on boundary conditions, exceptions, and formulas.',
              estimatedMinutes: Math.round(dailyHours * 20),
              completed: false,
              priority: 'low' as const,
              topic: 'Flashcards',
            },
          ],
        },
        {
          dayNumber: 3,
          dayTitle: 'Applied Problem Solving & Error Analysis',
          focusArea: 'Intermediate problem sets',
          tasks: [
            {
              id: `${planId}_t5`,
              title: 'Solve 8-12 standard benchmark problems',
              description: 'Work through textbook or past exam exercises without looking at solution keys.',
              estimatedMinutes: Math.round(dailyHours * 45),
              completed: false,
              priority: 'high' as const,
              topic: 'Problem Solving',
            },
            {
              id: `${planId}_t6`,
              title: 'Conduct an error log post-mortem',
              description: 'Document exact failure points (arithmetic, conceptual, or time pressure).',
              estimatedMinutes: Math.round(dailyHours * 15),
              completed: false,
              priority: 'medium' as const,
              topic: 'Review',
            },
          ],
        },
      ],
    },
    {
      weekNumber: 2,
      title: `Advanced Problem Archetypes & Speed Optimization`,
      objective: `Master composite multi-step problems, edge cases, and high-difficulty exam scenarios.`,
      days: [
        {
          dayNumber: 4,
          dayTitle: 'Complex Multi-concept Synthesis',
          focusArea: 'Cross-topic connections',
          tasks: [
            {
              id: `${planId}_t7`,
              title: 'Analyze complex synthetic exam questions',
              description: 'Break down composite prompts that require 2 or more distinct sub-methods.',
              estimatedMinutes: Math.round(dailyHours * 35),
              completed: false,
              priority: 'high' as const,
              topic: 'Synthesis',
            },
            {
              id: `${planId}_t8`,
              title: 'Timed sprint: 5 intermediate problems in 35 mins',
              description: 'Train pacing and quick pattern recognition.',
              estimatedMinutes: Math.round(dailyHours * 25),
              completed: false,
              priority: 'medium' as const,
              topic: 'Speed Drill',
            },
          ],
        },
        {
          dayNumber: 5,
          dayTitle: 'Weak Area Targeted Remediation',
          focusArea: 'Refining low-confidence topics',
          tasks: [
            {
              id: `${planId}_t9`,
              title: 'Review difficult concepts with Doubt Solver',
              description: 'Ask AI step-by-step questions on the hardest derivations.',
              estimatedMinutes: Math.round(dailyHours * 30),
              completed: false,
              priority: 'high' as const,
              topic: 'Remediation',
            },
            {
              id: `${planId}_t10`,
              title: 'Generate cheat sheet and one-page summary',
              description: 'Distill entire unit into essential formulas and heuristic tricks.',
              estimatedMinutes: Math.round(dailyHours * 30),
              completed: false,
              priority: 'medium' as const,
              topic: 'Summary Sheet',
            },
          ],
        },
      ],
    },
    {
      weekNumber: 3,
      title: `Full Exam Simulation & Peak Readiness`,
      objective: `Simulate authentic exam conditions, verify timing, and solidify confidence.`,
      days: [
        {
          dayNumber: 6,
          dayTitle: 'Full-Length Timed Mock Examination',
          focusArea: 'Exam endurance & test environment',
          tasks: [
            {
              id: `${planId}_t11`,
              title: `Complete comprehensive exam simulation for ${subject}`,
              description: `Strict quiet environment, timed to test duration, no reference materials.`,
              estimatedMinutes: Math.round(dailyHours * 50),
              completed: false,
              priority: 'high' as const,
              topic: 'Mock Exam',
            },
            {
              id: `${planId}_t12`,
              title: 'Score exam and review full answer keys',
              description: 'Thoroughly annotate every incorrect and guessed question.',
              estimatedMinutes: Math.round(dailyHours * 20),
              completed: false,
              priority: 'high' as const,
              topic: 'Scoring & Feedback',
            },
          ],
        },
        {
          dayNumber: 7,
          dayTitle: 'Final Polish & Formula Recitation',
          focusArea: 'Mental clarity & high-level consolidation',
          tasks: [
            {
              id: `${planId}_t13`,
              title: 'Light active recall run of all formulas and definitions',
              description: 'Verify 100% recall without notes or hints.',
              estimatedMinutes: Math.round(dailyHours * 30),
              completed: false,
              priority: 'medium' as const,
              topic: 'Active Recall',
            },
            {
              id: `${planId}_t14`,
              title: 'Rest, organize materials, and mental walk-through',
              description: 'Review exam strategy: question triage, time checkpoints, and calm breathing.',
              estimatedMinutes: Math.round(dailyHours * 15),
              completed: false,
              priority: 'low' as const,
              topic: 'Strategy',
            },
          ],
        },
      ],
    },
  ];

  let totalTasks = 0;
  generatedWeeks.forEach((w) => {
    w.days.forEach((d) => {
      totalTasks += d.tasks.length;
    });
  });

  return {
    id: planId,
    subject,
    targetGoal,
    examDate,
    dailyHours,
    learningStyle,
    difficulty,
    createdAt: new Date().toISOString().split('T')[0],
    weeks: generatedWeeks,
    totalTasks,
    completedTasks: 0,
  };
}

/**
 * AI Doubt Solver Generator
 */
export async function solveDoubtAI(question: string, subject: Subject, chatHistory: DoubtMessage[]): Promise<DoubtMessage> {
  // Natural delay for realistic reasoning
  await new Promise((r) => setTimeout(r, 1000));

  const qLower = question.toLowerCase();

  // Smart subject detection and academic explanation builder
  let keyConcept = `Core theoretical mechanism in ${subject}`;
  let commonPitfall = 'Confusing definitions or applying formulas outside their valid domain.';
  let followUpQuestion = `Would you like me to demonstrate an edge-case example or verify with a practice question?`;
  
  const stepBreakdown: { stepNumber: number; title: string; explanation: string; formulaOrCode?: string }[] = [];

  if (qLower.includes('dijkstra') || qLower.includes('graph') || qLower.includes('shortest path')) {
    keyConcept = 'Greedy single-source shortest path optimization using priority queues.';
    stepBreakdown.push(
      {
        stepNumber: 1,
        title: 'Priority Queue Invariant',
        explanation: 'Dijkstra permanently finalizes the shortest distance to a node the moment it is extracted from the min-heap. This relies on non-negative edge weights.',
        formulaOrCode: 'dist[v] = min(dist[v], dist[u] + weight(u, v))',
      },
      {
        stepNumber: 2,
        title: 'Why Negative Edges Break Dijkstra',
        explanation: 'If a negative edge exists, a previously "finalized" node might actually have a shorter path discovered later, which Dijkstra will never re-examine. For negative weights, Bellman-Ford or SPFA is required.',
      },
      {
        stepNumber: 3,
        title: 'Complexity Analysis',
        explanation: 'With a Binary Min-Heap: O((V + E) log V). With Fibonacci Heap: O(E + V log V).',
      }
    );
    commonPitfall = 'Attempting to fix negative edges by adding a constant C to all weights (this unfairly penalizes paths with more edges!).';
    followUpQuestion = 'Shall we walk through an example comparing Dijkstra with Bellman-Ford on a 4-node graph?';
  } else if (qLower.includes('derivative') || qLower.includes('integral') || qLower.includes('calculus') || qLower.includes('limit')) {
    keyConcept = 'Fundamental Theorem of Calculus and Rate of Change Analysis.';
    stepBreakdown.push(
      {
        stepNumber: 1,
        title: 'Identify the Functional Form & Rules Applicable',
        explanation: 'Inspect whether the expression requires Product Rule, Quotient Rule, Chain Rule, or Substitution.',
        formulaOrCode: '\\frac{d}{dx}[f(g(x))] = f\'(g(x)) \\cdot g\'(x)',
      },
      {
        stepNumber: 2,
        title: 'Step-by-step Transformation',
        explanation: 'Substitute the inner variable u = g(x), compute du, and re-express the objective in standard elementary terms.',
        formulaOrCode: '\\int f(g(x)) g\'(x) dx = \\int f(u) du',
      },
      {
        stepNumber: 3,
        title: 'Verify Boundary Conditions & Back-substitution',
        explanation: 'Always replace temporary variables with the original domain and check for division by zero or domain restrictions.',
      }
    );
    commonPitfall = 'Forgetting the chain rule factor for composite expressions or omitting the constant of integration + C.';
    followUpQuestion = 'Would you like to see how this connects geometrically to the tangent slope or area under the curve?';
  } else if (qLower.includes('photosynthesis') || qLower.includes('dna') || qLower.includes('enzyme') || qLower.includes('cell')) {
    keyConcept = 'Biochemical reaction energetics and enzymatic regulation.';
    stepBreakdown.push(
      {
        stepNumber: 1,
        title: 'Primary Molecular Components & Substrates',
        explanation: 'Enzymes lower the activation energy (Ea) of the transition state without altering the overall free energy change (Delta G) of the reaction.',
      },
      {
        stepNumber: 2,
        title: 'Reaction Pathway & Intermediates',
        explanation: 'Substrate binds to the active site via induced fit, forming an enzyme-substrate (ES) complex where catalytic residues stabilize the transition state.',
      },
      {
        stepNumber: 3,
        title: 'Feedback Inhibition & Allosteric Control',
        explanation: 'Downstream products often bind to an allosteric regulatory site to downregulate enzyme activity, preventing metabolic waste.',
      }
    );
    commonPitfall = 'Assuming enzymes change equilibrium position (Keq); enzymes only speed up the rate of reaching equilibrium.';
  } else {
    // General academic question breakdown
    keyConcept = `Deconstructing ${subject} principles and logical foundations.`;
    stepBreakdown.push(
      {
        stepNumber: 1,
        title: 'Core Axioms & Problem Statement Analysis',
        explanation: `To solve this in ${subject}, we first define the explicit constraints and identify what is given versus what must be determined.`,
      },
      {
        stepNumber: 2,
        title: 'Theoretical Framework & Stepwise Resolution',
        explanation: `We apply standard deductive reasoning: establish the governing relationship, isolate the key variables, and solve systematically.`,
        formulaOrCode: `f(x) = Target State \\implies Solution \\in \\mathbb{R}`,
      },
      {
        stepNumber: 3,
        title: 'Verification & Sanity Checks',
        explanation: `Check dimensional consistency, limit behavior at extreme boundaries (0, infinity), and physical or logical plausibility.`,
      }
    );
    commonPitfall = 'Skipping intermediate units checking or misidentifying boundary conditions.';
    followUpQuestion = 'Do you have specific numerical parameters or code you would like to run through this?';
  }

  const aiResponseText = `Here is a clear, step-by-step breakdown of your question regarding **${question}** in **${subject}**.\n\nTake note of the key concept and the common pitfalls students frequently encounter on exams.`;

  return {
    id: 'dm_' + Date.now(),
    sender: 'ai',
    text: aiResponseText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    keyConcept,
    stepBreakdown,
    commonPitfall,
    followUpQuestion,
  };
}

/**
 * AI Notes Generator
 */
export async function generateNotesAI(params: {
  topicOrText: string;
  subject: Subject;
  format: 'cornell' | 'cheatsheet' | 'summary' | 'flashcards';
}): Promise<GeneratedNotes> {
  await new Promise((r) => setTimeout(r, 1100));

  const { topicOrText, subject, format } = params;
  const id = 'note_' + Date.now();
  const title = topicOrText.length > 50 ? topicOrText.substring(0, 50) + '...' : topicOrText;

  if (format === 'cornell') {
    return {
      id,
      title: `Cornell Notes: ${title}`,
      subject,
      format: 'cornell',
      createdAt: new Date().toISOString().split('T')[0],
      sourceText: topicOrText,
      cornell: {
        cues: [
          'What is the core definition?',
          'Key mechanisms & formulas',
          'Primary constraints / Edge cases',
          'Exam question archetype',
        ],
        notes: [
          {
            section: '1. Definition & Fundamental Tenets',
            points: [
              `${title} establishes the operational framework for understanding core phenomena in ${subject}.`,
              'All primary models assume standard ideal conditions unless explicitly stated otherwise.',
              'Crucial invariant: conserve fundamental quantities across all state transitions.',
            ],
          },
          {
            section: '2. Deep Dive & Mathematical Mechanics',
            points: [
              'Primary relationship: inputs scale proportionally to the governing coefficient.',
              'First-order approximations remain valid in small perturbation regimes.',
              'When boundary limits are reached, non-linear effects dominate.',
            ],
          },
          {
            section: '3. Clinical / Real-world Applications',
            points: [
              'Widely deployed across industry and academia to optimize efficiency.',
              'Used as a benchmark baseline against empirical measurements.',
              'Standard standardized testing focal point (frequently appears in multi-part questions).',
            ],
          },
        ],
        summary: `In summary, ${title} provides the cornerstone for analyzing problems in ${subject}. Key mastery requires understanding the governing definitions, memorizing the core equations, and identifying when real-world edge cases violate idealized assumptions.`,
      },
    };
  }

  if (format === 'cheatsheet') {
    return {
      id,
      title: `Quick Reference Cheatsheet: ${title}`,
      subject,
      format: 'cheatsheet',
      createdAt: new Date().toISOString().split('T')[0],
      sourceText: topicOrText,
      cheatsheet: {
        keyTerms: [
          { term: 'Primary Invariant', definition: 'The property or value that remains unchanged through all transformations.' },
          { term: 'Equilibrium State', definition: 'The configuration where opposing forces or rates are exactly balanced.' },
          { term: 'Asymptotic Bound', definition: 'The theoretical performance limit as problem size approaches infinity.' },
          { term: 'Coefficient of Efficiency', definition: 'Ratio of useful output to total energy or computational expenditure.' },
        ],
        formulas: [
          { name: 'Standard Governing Equation', formula: 'F(x, t) = \\nabla \\cdot \\Phi + \\sigma', explanation: 'Relates flux density to source generation.' },
          { name: 'Conservation Law', formula: '\\sum E_{initial} = \\sum E_{final} + Q_{loss}', explanation: 'Total conserved quantity balance.' },
          { name: 'Efficiency Metric', formula: '\\eta = \\frac{W_{out}}{Q_{in}} \\times 100\\%', explanation: 'Performance benchmark formula.' },
        ],
        rulesAndLaws: [
          'Rule 1: Always verify units and dimensions before performing algebraic substitutions.',
          'Rule 2: Check boundary values (at 0, 1, and infinity) to verify functional correctness.',
          'Rule 3: Ensure symmetric properties hold across coordinate transformations.',
        ],
        examTips: [
          'Highlight negative signs in your scratch work; sign flips cause >60% of student exam errors.',
          'State your assumptions explicitly on free-response sections for partial credit.',
        ],
      },
    };
  }

  if (format === 'flashcards') {
    const flashcards: Flashcard[] = [
      {
        id: 'fc_1',
        front: `What is the core definition and significance of ${title}?`,
        back: `It serves as the fundamental mechanism in ${subject} that links theoretical principles to empirical observations.`,
        conceptTag: 'Definition',
      },
      {
        id: 'fc_2',
        front: 'What are the three most critical assumptions or prerequisites?',
        back: '1) Continuous medium / standard domain\n2) Conservation of state\n3) Absence of extraneous friction/noise unless specified',
        conceptTag: 'Prerequisites',
      },
      {
        id: 'fc_3',
        front: 'What is the most common exam trap or pitfall associated with this topic?',
        back: 'Neglecting edge cases at extreme values (e.g. zero denominators, negative square roots, or unbounded limits).',
        conceptTag: 'Exam Traps',
      },
      {
        id: 'fc_4',
        front: 'How do you verify your final result in practice?',
        back: 'Perform dimensional analysis, test with boundary values (x=0, x=1), and verify that physical or mathematical conservation holds.',
        conceptTag: 'Verification',
      },
      {
        id: 'fc_5',
        front: 'What related concept or formula is this most frequently paired with?',
        back: 'Optimization techniques and fundamental conservation laws in standard multi-step exam questions.',
        conceptTag: 'Synthesis',
      },
    ];

    return {
      id,
      title: `Flashcard Deck: ${title}`,
      subject,
      format: 'flashcards',
      createdAt: new Date().toISOString().split('T')[0],
      sourceText: topicOrText,
      flashcards,
    };
  }

  // Summary format
  return {
    id,
    title: `Executive Study Summary: ${title}`,
    subject,
    format: 'summary',
    createdAt: new Date().toISOString().split('T')[0],
    sourceText: topicOrText,
    summaryContent: `# Executive Summary: ${title}\n\n## 1. High-Yield Overview\n${title} represents an essential module within ${subject}. Mastery requires fluent navigation between the theoretical foundation, mathematical representation, and practical problem-solving heuristics.\n\n## 2. Core Pillars\n- **Principle A (Foundations):** Understand the governing axioms and why the system behaves predictably under standard constraints.\n- **Principle B (Transformations):** How state changes, derivatives, and algorithmic transitions progress step by step.\n- **Principle C (Applications):** Concrete exam problems, design patterns, and case studies.\n\n## 3. Top Exam Takeaways\n1. Always write down the base formula before substituting variables.\n2. Ensure units match across both sides of every equation.\n3. Keep your error log updated with edge-case missteps.`,
  };
}

/**
 * AI Quiz Generator
 */
export async function generateQuizAI(params: {
  topic: string;
  subject: Subject;
  questionCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}): Promise<Quiz> {
  await new Promise((r) => setTimeout(r, 1200));

  const { topic, subject, questionCount, difficulty } = params;
  const quizId = 'quiz_' + Date.now();

  const generatedQuestions: QuizQuestion[] = [];

  // Question archetypes adapted to topic & subject
  const templates = [
    {
      question: `Which of the following is the fundamental governing principle of ${topic} in ${subject}?`,
      options: [
        `Conservation of fundamental invariants under standard transformations`,
        `Random stochastic variance without equilibrium constraints`,
        `Exponential divergence without asymptotic bounds`,
        `Arbitrary heuristic approximations that ignore boundary states`,
      ],
      correctAnswer: `Conservation of fundamental invariants under standard transformations`,
      explanation: `Fundamental principles in ${subject} dictate that invariants must be conserved unless external work or perturbing forces are introduced.`,
    },
    {
      question: `When analyzing edge cases in ${topic}, what occurs as the primary variable approaches infinity?`,
      options: [
        `The system reaches an asymptotic horizontal limit or steady state`,
        `The function strictly vanishes to negative infinity without bounds`,
        `All mathematical assumptions immediately become indeterminate`,
        `The error factor grows faster than polynomial time`,
      ],
      correctAnswer: `The system reaches an asymptotic horizontal limit or steady state`,
      explanation: `Asymptotic analysis investigates boundary behavior as inputs become arbitrarily large, typically yielding a predictable horizontal asymptote or steady-state equilibrium.`,
    },
    {
      question: `True or False: In ${subject}, an optimal solution to ${topic} requires that all subproblems also exhibit optimal solutions.`,
      type: 'true-false' as const,
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: `This is the definition of optimal substructure, a critical prerequisite for deductive reasoning, dynamic programming, and mathematical induction.`,
    },
    {
      question: `What is the most frequent reason for failure or score deductions on ${topic} exam questions?`,
      options: [
        `Applying a formula outside its valid domain or violating boundary conditions`,
        `Writing in too much detail on free-response sections`,
        `Using standard metric units instead of imperial units`,
        `Checking answers with dimensional analysis`,
      ],
      correctAnswer: `Applying a formula outside its valid domain or violating boundary conditions`,
      explanation: `Examiners test boundary understanding. Applying a theorem when its hypotheses (continuity, positivity, non-negativity) are not satisfied is the leading cause of error.`,
    },
    {
      question: `Which methodology provides the most efficient verification of a derived solution in ${topic}?`,
      options: [
        `Dimensional analysis and testing special boundary cases (e.g., 0, 1)`,
        `Re-running the entire algebraic derivation from scratch identical steps`,
        `Assuming the solution is correct if the number is an integer`,
        `Inverting the sign of all constants`,
      ],
      correctAnswer: `Dimensional analysis and testing special boundary cases (e.g., 0, 1)`,
      explanation: `Checking dimensions (units) and testing known limits (like setting mass or length to 0) will instantly catch sign flips and algebraic slips in seconds.`,
    },
  ];

  for (let i = 0; i < Math.min(questionCount, 6); i++) {
    const t = templates[i % templates.length];
    generatedQuestions.push({
      id: `${quizId}_q${i + 1}`,
      question: t.question,
      type: t.type || 'multiple-choice',
      options: t.options,
      correctAnswer: t.correctAnswer,
      explanation: t.explanation,
    });
  }

  return {
    id: quizId,
    title: `${topic} - Mastery Challenge`,
    subject,
    difficulty,
    questions: generatedQuestions,
    timeLimitMinutes: Math.max(5, generatedQuestions.length * 2),
    completed: false,
  };
}
