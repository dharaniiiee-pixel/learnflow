import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Layers, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Lightbulb, 
  Bookmark, 
  Trash2,
  ListOrdered
} from 'lucide-react';
import { GeneratedNotes, Subject } from '../types';
import { generateNotesAI } from '../services/aiService';

interface NotesGeneratorProps {
  notes: GeneratedNotes[];
  onSaveNote: (note: GeneratedNotes) => void;
  onDeleteNote: (noteId: string) => void;
}

export const NotesGenerator: React.FC<NotesGeneratorProps> = ({
  notes,
  onSaveNote,
  onDeleteNote,
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(
    notes.length > 0 ? notes[0].id : null
  );

  // Generator form inputs
  const [inputText, setInputText] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject>('Biology');
  const [format, setFormat] = useState<'cornell' | 'cheatsheet' | 'summary' | 'flashcards'>('cornell');
  const [isGenerating, setIsGenerating] = useState(false);

  // Flashcard interaction state
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<string[]>([]);

  // Copy feedback
  const [copied, setCopied] = useState(false);

  const activeNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    setIsGenerating(true);
    try {
      const newNote = await generateNotesAI({
        topicOrText: inputText.trim(),
        subject: selectedSubject,
        format,
      });
      onSaveNote(newNote);
      setSelectedNoteId(newNote.id);
      setCurrentFlashcardIndex(0);
      setIsCardFlipped(false);
      setInputText('');
    } catch (err) {
      console.error('Failed to generate notes:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSampleClick = (sampleTopic: string, sampleSubject: Subject, sampleFormat: 'cornell' | 'cheatsheet' | 'summary' | 'flashcards') => {
    setInputText(sampleTopic);
    setSelectedSubject(sampleSubject);
    setFormat(sampleFormat);
  };

  const handleCopyMarkdown = () => {
    if (!activeNote) return;
    let md = `# ${activeNote.title}\nSubject: ${activeNote.subject} | Format: ${activeNote.format}\n\n`;

    if (activeNote.cornell) {
      md += `## Cornell Cues\n${activeNote.cornell.cues.map((c) => `- ${c}`).join('\n')}\n\n`;
      md += `## Notes\n`;
      activeNote.cornell.notes.forEach((sec) => {
        md += `### ${sec.section}\n${sec.points.map((p) => `- ${p}`).join('\n')}\n\n`;
      });
      md += `## Summary\n${activeNote.cornell.summary}\n`;
    } else if (activeNote.cheatsheet) {
      md += `## Key Terms\n${activeNote.cheatsheet.keyTerms.map((k) => `- **${k.term}**: ${k.definition}`).join('\n')}\n\n`;
      md += `## Formulas\n${activeNote.cheatsheet.formulas.map((f) => `- **${f.name}**: \`${f.formula}\` (${f.explanation})`).join('\n')}\n\n`;
      md += `## Exam Tips\n${activeNote.cheatsheet.examTips.map((t) => `- ${t}`).join('\n')}\n`;
    } else if (activeNote.summaryContent) {
      md += activeNote.summaryContent;
    } else if (activeNote.flashcards) {
      md += `## Flashcards Deck\n`;
      activeNote.flashcards.forEach((fc, idx) => {
        md += `**Q${idx + 1}:** ${fc.front}\n**A:** ${fc.back}\n\n`;
      });
    }

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadFile = () => {
    if (!activeNote) return;
    const blob = new Blob([activeNote.title + '\n\n' + JSON.stringify(activeNote, null, 2)], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeNote.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleMastered = (cardId: string) => {
    setMasteredCards((prev) =>
      prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]
    );
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              AI Notes & Flashcards Generator
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Transform textbook sections and lectures into Cornell notes, formulas cheatsheets & 3D flashcards
          </p>
        </div>
      </div>

      {/* Note Generation Form */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Create New Study Guide</h3>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Subject */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400">Subject:</span>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value as Subject)}
                  className="py-1 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
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

              {/* Format */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400">Format:</span>
                <div className="flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setFormat('cornell')}
                    className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                      format === 'cornell' ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    Cornell
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat('cheatsheet')}
                    className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                      format === 'cheatsheet' ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    Cheatsheet
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat('flashcards')}
                    className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                      format === 'flashcards' ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    Flashcards
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat('summary')}
                    className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                      format === 'summary' ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    Summary
                  </button>
                </div>
              </div>
            </div>
          </div>

          <textarea
            rows={3}
            required
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter syllabus topic or paste textbook/lecture transcript (e.g., 'Mitochondrial ATP Synthase and Chemiosmotic Coupling', 'Keynesian Aggregate Demand and IS-LM curve')..."
            className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Quick Sample Prompts */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
              <span>Quick templates:</span>
              <button
                type="button"
                onClick={() => handleSampleClick('Cellular Respiration & Krebs Cycle', 'Biology', 'cornell')}
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-600 cursor-pointer"
              >
                Cell Respiration (Cornell)
              </button>
              <button
                type="button"
                onClick={() => handleSampleClick('Dynamic Programming & Recurrences', 'Computer Science', 'cheatsheet')}
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-600 cursor-pointer"
              >
                DP Cheatsheet
              </button>
              <button
                type="button"
                onClick={() => handleSampleClick('Derivatives and Chain Rule', 'Mathematics', 'flashcards')}
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-600 cursor-pointer"
              >
                Calculus Flashcards
              </button>
            </div>

            <button
              type="submit"
              disabled={isGenerating || !inputText.trim()}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Notes...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Notes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Main Layout: Saved Library Drawer + Active Note Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (3 Cols): Saved Notes List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-500" />
              Saved Study Guides ({notes.length})
            </h3>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {notes.map((note) => {
                const isSelected = note.id === activeNote?.id;
                return (
                  <div
                    key={note.id}
                    onClick={() => {
                      setSelectedNoteId(note.id);
                      setCurrentFlashcardIndex(0);
                      setIsCardFlipped(false);
                    }}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 shadow-xs'
                        : 'bg-white dark:bg-slate-850 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        {note.subject} · {note.format}
                      </span>
                      {notes.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteNote(note.id);
                          }}
                          className="text-slate-400 hover:text-rose-500 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 line-clamp-1">
                      {note.title}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{note.createdAt}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (8 Cols): Active Note Content Display */}
        <div className="lg:col-span-8 space-y-4">
          {activeNote ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
              
              {/* Note Header & Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    {activeNote.subject} · Format: {activeNote.format}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                    {activeNote.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyMarkdown}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={handleDownloadFile}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* FORMAT 1: CORNELL NOTES LAYOUT */}
              {activeNote.format === 'cornell' && activeNote.cornell && (
                <div className="space-y-4">
                  
                  {/* Two Column Grid: Cues (Left) and Main Notes (Right) */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                    
                    {/* Left 4 Cols: Cue Column / Questions */}
                    <div className="md:col-span-4 bg-slate-50/70 dark:bg-slate-800/40 p-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Recall Cues & Questions
                      </div>
                      <div className="space-y-2.5">
                        {activeNote.cornell.cues.map((cue, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 text-xs font-semibold text-indigo-700 dark:text-indigo-300"
                          >
                            {cue}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right 8 Cols: Main Lecture Notes */}
                    <div className="md:col-span-8 p-4 space-y-4">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Main Lecture Notes & Concepts
                      </div>
                      <div className="space-y-4">
                        {activeNote.cornell.notes.map((section, idx) => (
                          <div key={idx} className="space-y-1.5">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                              {section.section}
                            </h4>
                            <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300 pl-4 list-disc marker:text-emerald-500">
                              {section.points.map((pt, pIdx) => (
                                <li key={pIdx} className="leading-relaxed">{pt}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Bottom: Cornell Summary */}
                  <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/50 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Bottom Summary Block</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                      {activeNote.cornell.summary}
                    </p>
                  </div>

                </div>
              )}

              {/* FORMAT 2: CHEATSHEET LAYOUT */}
              {activeNote.format === 'cheatsheet' && activeNote.cheatsheet && (
                <div className="space-y-5">
                  
                  {/* Formulas Section */}
                  {activeNote.cheatsheet.formulas && activeNote.cheatsheet.formulas.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Essential Formulas & Recurrences
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {activeNote.cheatsheet.formulas.map((form, idx) => (
                          <div key={idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-1">
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{form.name}</div>
                            <div className="p-2 rounded bg-slate-900 text-cyan-300 font-mono text-xs overflow-x-auto">
                              <code>{form.formula}</code>
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{form.explanation}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Terms */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Vocabulary & High-Yield Terms
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {activeNote.cheatsheet.keyTerms.map((term, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs space-y-0.5">
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">{term.term}</span>
                          <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">{term.definition}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rules and Exam Tips */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white">Governing Laws & Invariants</h4>
                      <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
                        {activeNote.cheatsheet.rulesAndLaws.map((rule, idx) => (
                          <li key={idx}>{rule}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-2">
                      <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400">Exam Traps & Score Savers</h4>
                      <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc pl-4 marker:text-amber-500">
                        {activeNote.cheatsheet.examTips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>
              )}

              {/* FORMAT 3: FLASHCARDS INTERACTIVE 3D VIEWER */}
              {activeNote.format === 'flashcards' && activeNote.flashcards && activeNote.flashcards.length > 0 && (
                <div className="space-y-4">
                  {(() => {
                    const cards = activeNote.flashcards;
                    const card = cards[currentFlashcardIndex];
                    const isMastered = masteredCards.includes(card.id);

                    return (
                      <div className="flex flex-col items-center space-y-4">
                        {/* Progress and status */}
                        <div className="w-full flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2">
                          <span>Card {currentFlashcardIndex + 1} of {cards.length}</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {masteredCards.length} Mastered
                          </span>
                        </div>

                        {/* Interactive 3D Flip Card */}
                        <div
                          onClick={() => setIsCardFlipped(!isCardFlipped)}
                          className="relative w-full max-w-lg h-64 rounded-2xl cursor-pointer perspective-1000 group select-none"
                        >
                          <div
                            className={`w-full h-full relative transition-transform duration-500 transform-style-preserve-3d rounded-2xl shadow-md border ${
                              isCardFlipped ? 'rotate-y-180 border-indigo-400 dark:border-indigo-600' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850'
                            }`}
                          >
                            {/* FRONT OF CARD (Question) */}
                            <div className="absolute inset-0 w-full h-full backface-hidden p-6 flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900">
                              <div className="flex items-center justify-between text-[11px] text-slate-400">
                                <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                  {card.conceptTag}
                                </span>
                                <span className="flex items-center gap-1 text-slate-400">
                                  <RotateCw className="w-3 h-3" /> Click to reveal answer
                                </span>
                              </div>
                              <div className="my-auto text-center">
                                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                                  {card.front}
                                </h3>
                              </div>
                              <div className="text-[10px] text-center text-slate-400">
                                Tap anywhere or press Space
                              </div>
                            </div>

                            {/* BACK OF CARD (Answer) */}
                            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 p-6 flex flex-col justify-between rounded-2xl bg-indigo-950 text-white border border-indigo-700">
                              <div className="flex items-center justify-between text-[11px] text-indigo-300">
                                <span className="font-bold uppercase tracking-wider">Solution / Answer</span>
                                <span className="flex items-center gap-1">
                                  <RotateCw className="w-3 h-3" /> Flip back
                                </span>
                              </div>
                              <div className="my-auto text-center">
                                <p className="text-sm sm:text-base font-medium text-slate-100 whitespace-pre-line leading-relaxed">
                                  {card.back}
                                </p>
                              </div>
                              <div className="text-[10px] text-center text-indigo-300">
                                Card {currentFlashcardIndex + 1}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Flashcard Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setIsCardFlipped(false);
                              setCurrentFlashcardIndex((prev) => (prev > 0 ? prev - 1 : cards.length - 1));
                            }}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            title="Previous card"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setIsCardFlipped(!isCardFlipped)}
                            className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                          >
                            Flip Card
                          </button>

                          <button
                            onClick={() => toggleMastered(card.id)}
                            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                              isMastered
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                            }`}
                          >
                            {isMastered ? '✓ Mastered' : 'Mark Mastered'}
                          </button>

                          <button
                            onClick={() => {
                              setIsCardFlipped(false);
                              setCurrentFlashcardIndex((prev) => (prev < cards.length - 1 ? prev + 1 : 0));
                            }}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            title="Next card"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* FORMAT 4: EXECUTIVE SUMMARY */}
              {activeNote.format === 'summary' && activeNote.summaryContent && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
                  {activeNote.summaryContent}
                </div>
              )}

            </div>
          ) : (
            <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">No Study Guides Yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Type a topic or paste lecture notes above to generate your customized Cornell notes or flashcards!
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
