import React, { useState } from 'react';
import { 
  HelpCircle, 
  Sparkles, 
  Send, 
  Bookmark, 
  Copy, 
  Check, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle, 
  Search, 
  Trash2,
  Code2
} from 'lucide-react';
import { SolvedDoubt, Subject, DoubtMessage } from '../types';
import { solveDoubtAI } from '../services/aiService';

interface DoubtSolverProps {
  doubts: SolvedDoubt[];
  onSaveDoubt: (doubt: SolvedDoubt) => void;
  onDeleteDoubt: (doubtId: string) => void;
  onToggleBookmark: (doubtId: string) => void;
  initialQuery?: string;
}

export const DoubtSolver: React.FC<DoubtSolverProps> = ({
  doubts,
  onSaveDoubt,
  onDeleteDoubt,
  onToggleBookmark,
  initialQuery = '',
}) => {
  const [selectedDoubtId, setSelectedDoubtId] = useState<string | null>(
    doubts.length > 0 ? doubts[0].id : null
  );
  const [questionInput, setQuestionInput] = useState(initialQuery);
  const [selectedSubject, setSelectedSubject] = useState<Subject>('Computer Science');
  const [isSolving, setIsSolving] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Follow-up chat input
  const [followUpInput, setFollowUpInput] = useState('');
  const [isAnsweringFollowUp, setIsAnsweringFollowUp] = useState(false);

  // Code or formula snippet attachment toggle
  const [showSnippetInput, setShowSnippetInput] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState('');

  const activeDoubt = doubts.find((d) => d.id === selectedDoubtId) || doubts[0];

  const handleSolveQuestion = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalQuestion = questionInput.trim();
    if (!finalQuestion) return;

    setIsSolving(true);
    try {
      const fullText = codeSnippet.trim() 
        ? `${finalQuestion}\n\nContext / Code:\n\`\`\`\n${codeSnippet.trim()}\n\`\`\``
        : finalQuestion;

      const userMsg: DoubtMessage = {
        id: 'msg_u_' + Date.now(),
        sender: 'user',
        text: fullText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const aiMsg = await solveDoubtAI(fullText, selectedSubject, [userMsg]);

      const newDoubt: SolvedDoubt = {
        id: 'doubt_' + Date.now(),
        title: finalQuestion.length > 60 ? finalQuestion.substring(0, 60) + '...' : finalQuestion,
        subject: selectedSubject,
        question: fullText,
        messages: [userMsg, aiMsg],
        createdAt: new Date().toISOString().split('T')[0],
        bookmarked: false,
      };

      onSaveDoubt(newDoubt);
      setSelectedDoubtId(newDoubt.id);
      setQuestionInput('');
      setCodeSnippet('');
      setShowSnippetInput(false);
    } catch (err) {
      console.error('Failed to solve doubt:', err);
    } finally {
      setIsSolving(false);
    }
  };

  const handleFollowUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpInput.trim() || !activeDoubt) return;

    const userFollowUp: DoubtMessage = {
      id: 'msg_u_' + Date.now(),
      sender: 'user',
      text: followUpInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...activeDoubt.messages, userFollowUp];
    const updatedDoubt = { ...activeDoubt, messages: updatedMessages };
    onSaveDoubt(updatedDoubt);
    setFollowUpInput('');
    setIsAnsweringFollowUp(true);

    try {
      const aiReply = await solveDoubtAI(
        userFollowUp.text,
        activeDoubt.subject,
        updatedMessages
      );
      const withAiReply = {
        ...updatedDoubt,
        messages: [...updatedMessages, aiReply],
      };
      onSaveDoubt(withAiReply);
    } finally {
      setIsAnsweringFollowUp(false);
    }
  };

  const handleCopySolution = (doubt: SolvedDoubt) => {
    let copyText = `# ${doubt.title} (${doubt.subject})\n\n`;
    doubt.messages.forEach((m) => {
      copyText += `**${m.sender === 'user' ? 'Student' : 'StudyMate AI'}** [${m.timestamp}]:\n${m.text}\n\n`;
      if (m.stepBreakdown) {
        m.stepBreakdown.forEach((s) => {
          copyText += `### Step ${s.stepNumber}: ${s.title}\n${s.explanation}\n`;
          if (s.formulaOrCode) copyText += `\`\`\`\n${s.formulaOrCode}\n\`\`\`\n`;
        });
      }
      if (m.commonPitfall) {
        copyText += `\n⚠️ Common Exam Pitfall: ${m.commonPitfall}\n`;
      }
    });
    navigator.clipboard.writeText(copyText);
    setCopiedId(doubt.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredDoubts = doubts.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      d.question.toLowerCase().includes(searchFilter.toLowerCase()) ||
      d.subject.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesBookmark = showOnlyBookmarked ? d.bookmarked : true;
    return matchesSearch && matchesBookmark;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              AI Doubt Solver
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Step-by-step logic, formula derivations, code breakdowns & exam pitfall alerts
          </p>
        </div>
      </div>

      {/* Main Layout: Left Notebook Sidebar + Right Active Conversation / Solver */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col (4 Cols): Solved Doubts Notebook */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                Solved Doubts Notebook ({doubts.length})
              </span>
              <button
                onClick={() => setShowOnlyBookmarked(!showOnlyBookmarked)}
                className={`p-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors ${
                  showOnlyBookmarked
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title="Filter bookmarked"
              >
                <Bookmark className={`w-3.5 h-3.5 ${showOnlyBookmarked ? 'fill-amber-500' : ''}`} />
                <span className="text-[10px]">Saved</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="mt-3 relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search doubts or concepts..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Doubts List */}
            <div className="mt-3 space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {filteredDoubts.length > 0 ? (
                filteredDoubts.map((doubt) => {
                  const isSelected = doubt.id === activeDoubt?.id;
                  return (
                    <div
                      key={doubt.id}
                      onClick={() => setSelectedDoubtId(doubt.id)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 shadow-xs'
                          : 'bg-white dark:bg-slate-850 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          {doubt.subject}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleBookmark(doubt.id);
                            }}
                            className="text-slate-400 hover:text-amber-500 cursor-pointer"
                          >
                            <Bookmark className={`w-3 h-3 ${doubt.bookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteDoubt(doubt.id);
                            }}
                            className="text-slate-400 hover:text-rose-500 cursor-pointer ml-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 line-clamp-2">
                        {doubt.title}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                        <span>{doubt.createdAt}</span>
                        <span>{doubt.messages.length} exchanges</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  No doubts match your search filter.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col (8 Cols): Question Input + Solution Thread */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Ask Question Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Ask a New Doubt</h3>
              </div>

              {/* Subject Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Subject:</span>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value as Subject)}
                  className="text-xs py-1 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Literature & Writing">Literature & Writing</option>
                  <option value="Economics & Business">Economics & Business</option>
                  <option value="General Science">General Science</option>
                </select>
              </div>
            </div>

            <form onSubmit={handleSolveQuestion} className="space-y-3">
              <textarea
                rows={3}
                required
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder="Type your academic doubt here... e.g. Why does QuickSort degrade to O(N^2) in worst case and how does median-of-three fix it?"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {/* Code Snippet attachment box */}
              {showSnippetInput && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Optional Code or Math formula context:</span>
                    <button
                      type="button"
                      onClick={() => setShowSnippetInput(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      Remove
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    placeholder="// Paste relevant code, formula, or problem statement here..."
                    className="w-full text-xs font-mono p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-900 text-cyan-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setShowSnippetInput(!showSnippetInput)}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 font-medium cursor-pointer"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>{showSnippetInput ? 'Hide snippet box' : '+ Attach code / formula context'}</span>
                </button>

                <button
                  type="submit"
                  disabled={isSolving || !questionInput.trim()}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSolving ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>Deconstructing Problem...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Solve Step-by-Step</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Active Doubt Conversation Display */}
          {activeDoubt ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
              
              {/* Doubt Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {activeDoubt.subject}
                  </span>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {activeDoubt.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopySolution(activeDoubt)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    {copiedId === activeDoubt.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Markdown</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onToggleBookmark(activeDoubt.id)}
                    className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                      activeDoubt.bookmarked
                        ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-500'
                        : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-500'
                    }`}
                    title="Bookmark this solution"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${activeDoubt.bookmarked ? 'fill-amber-500' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Message Thread */}
              <div className="space-y-6">
                {activeDoubt.messages.map((msg) => (
                  <div key={msg.id} className="space-y-4">
                    
                    {/* User Question Bubble */}
                    {msg.sender === 'user' ? (
                      <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                          <span className="font-bold text-slate-600 dark:text-slate-300">Your Question</span>
                          <span>{msg.timestamp}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-medium whitespace-pre-wrap">
                          {msg.text}
                        </p>
                      </div>
                    ) : (
                      /* AI Detailed Solution */
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          <Sparkles className="w-4 h-4" />
                          <span>StudyMate AI Explanation</span>
                          <span className="text-[10px] text-slate-400 font-normal">· {msg.timestamp}</span>
                        </div>

                        {/* General Message Text */}
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                          {msg.text}
                        </p>

                        {/* Key Concept Callout */}
                        {msg.keyConcept && (
                          <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-2.5">
                            <CheckCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                            <div>
                              <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                Core Concept Invariant
                              </div>
                              <p className="text-xs text-slate-800 dark:text-slate-200 font-medium mt-0.5">
                                {msg.keyConcept}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Step-by-Step Breakdown */}
                        {msg.stepBreakdown && msg.stepBreakdown.length > 0 && (
                          <div className="space-y-3 pt-2">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                              Step-by-Step Derivation
                            </h4>

                            <div className="space-y-3">
                              {msg.stepBreakdown.map((step) => (
                                <div
                                  key={step.stepNumber}
                                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-2 shadow-2xs"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">
                                      {step.stepNumber}
                                    </span>
                                    <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                                      {step.title}
                                    </h5>
                                  </div>
                                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-7">
                                    {step.explanation}
                                  </p>
                                  {step.formulaOrCode && (
                                    <div className="ml-7 p-2.5 rounded-lg bg-slate-900 text-cyan-300 font-mono text-xs overflow-x-auto">
                                      <code>{step.formulaOrCode}</code>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Common Exam Pitfalls */}
                        {msg.commonPitfall && (
                          <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5">
                            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                            <div>
                              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                                Common Student Exam Pitfall
                              </div>
                              <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                                {msg.commonPitfall}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Follow-up Probe */}
                        {msg.followUpQuestion && (
                          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 text-xs">
                            <span className="font-bold text-indigo-600 dark:text-indigo-400">
                              Challenge Follow-up:
                            </span>{' '}
                            <span className="text-slate-700 dark:text-slate-300">
                              {msg.followUpQuestion}
                            </span>
                          </div>
                        )}

                      </div>
                    )}

                  </div>
                ))}
              </div>

              {/* Follow-up Question Input Form */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <form onSubmit={handleFollowUpSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={followUpInput}
                    onChange={(e) => setFollowUpInput(e.target.value)}
                    placeholder="Ask a clarifying follow-up question (e.g., 'Can you show step 2 with an example?')..."
                    className="flex-1 text-xs sm:text-sm py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={isAnsweringFollowUp || !followUpInput.trim()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1 cursor-pointer whitespace-nowrap"
                  >
                    {isAnsweringFollowUp ? (
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Reply</span>
                  </button>
                </form>
              </div>

            </div>
          ) : (
            <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Ask your first question</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Type any homework problem, conceptual doubt, or derivation above to receive structured academic guidance.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
