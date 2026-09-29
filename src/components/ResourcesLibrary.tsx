import React, { useState } from 'react';
import { 
  Library, 
  Search, 
  Bookmark, 
  Download, 
  ExternalLink, 
  Plus, 
  FileText, 
  Tag, 
  Check, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { AcademicResource, Subject } from '../types';

interface ResourcesLibraryProps {
  resources: AcademicResource[];
  bookmarkedIds: string[];
  onToggleBookmark: (resourceId: string) => void;
  onAddResource: (resource: AcademicResource) => void;
}

export const ResourcesLibrary: React.FC<ResourcesLibraryProps> = ({
  resources,
  bookmarkedIds,
  onToggleBookmark,
  onAddResource,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlySaved, setShowOnlySaved] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [previewResource, setPreviewResource] = useState<AcademicResource | null>(null);

  // New Resource Form
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState<Subject>('Computer Science');
  const [newCategory, setNewCategory] = useState<'Cheat Sheet' | 'Textbook Guide' | 'Interactive Tool' | 'Video Playlist' | 'Formula Sheet'>('Cheat Sheet');
  const [newDescription, setNewDescription] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newTags, setNewTags] = useState('');

  const subjects = ['All', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Literature & Writing'];
  const categories = ['All', 'Formula Sheet', 'Cheat Sheet', 'Interactive Tool', 'Textbook Guide'];

  const filteredResources = resources.filter((res) => {
    const matchesSubject = selectedSubject === 'All' || res.subject === selectedSubject;
    const matchesCategory = selectedCategory === 'All' || res.category === selectedCategory;
    const matchesSaved = showOnlySaved ? bookmarkedIds.includes(res.id) : true;
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSubject && matchesCategory && matchesSaved && matchesSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const resource: AcademicResource = {
      id: 'res_' + Date.now(),
      title: newTitle.trim(),
      subject: newSubject,
      category: newCategory,
      description: newDescription.trim() || 'Curated academic resource for university coursework.',
      authorOrSource: newAuthor.trim() || 'Student Contribution',
      url: '#',
      downloadsCount: 1,
      tags: newTags ? newTags.split(',').map((t) => t.trim()) : [newSubject, newCategory],
    };

    onAddResource(resource);
    setNewTitle('');
    setNewDescription('');
    setNewAuthor('');
    setNewTags('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 rounded-xl">
              <Library className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Academic Resources & Formula Sheets
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Curated high-yield cheat sheets, interactive visualizers, formula indices & textbook references
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Resource</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          
          {/* Search box */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by topic, formula, author, or tag (e.g., 'Integrals', 'Derivations', 'LeetCode')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Bookmarked Filter Toggle */}
          <button
            onClick={() => setShowOnlySaved(!showOnlySaved)}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              showOnlySaved
                ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400 shadow-2xs'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${showOnlySaved ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span>Bookmarked Only ({bookmarkedIds.length})</span>
          </button>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {subjects.map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedSubject === subj
                  ? 'bg-cyan-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResources.length > 0 ? (
          filteredResources.map((res) => {
            const isBookmarked = bookmarkedIds.includes(res.id);

            return (
              <div
                key={res.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-400 dark:hover:border-cyan-600 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                      {res.subject} · {res.category}
                    </span>
                    <button
                      onClick={() => onToggleBookmark(res.id)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isBookmarked
                          ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 text-amber-500'
                          : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-500'
                      }`}
                      title="Bookmark resource"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                    </button>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                    {res.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {res.description}
                  </p>

                  <div className="text-[11px] text-slate-400 pt-1">
                    Source: <span className="font-medium text-slate-700 dark:text-slate-300">{res.authorOrSource}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {res.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {res.downloadsCount} students accessed
                  </span>

                  <button
                    onClick={() => setPreviewResource(res)}
                    className="flex items-center gap-1 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
                  >
                    <span>View Study Guide</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">No Resources Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search terms or filters to locate formula sheets and guides.
            </p>
          </div>
        )}
      </div>

      {/* Resource Preview Modal */}
      {previewResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-800 dark:text-slate-100 max-h-[85vh] overflow-y-auto space-y-4">
            
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                  {previewResource.subject} · {previewResource.category}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {previewResource.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Source: {previewResource.authorOrSource}</p>
              </div>

              <button
                onClick={() => setPreviewResource(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {previewResource.description}
            </p>

            {/* Academic Content Quick Preview Box */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                High-Yield Review Excerpt
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                This academic reference module is indexed into your local offline StudyMate AI cache. You can reference key theorems, formula sheets, and reaction coordinate diagrams while solving practice questions.
              </p>
              <div className="pt-2 text-[11px] font-mono text-cyan-600 dark:text-cyan-400">
                Verified: Academic Integrity & Syllabus Standards Compliant
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setPreviewResource(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onToggleBookmark(previewResource.id);
                  setPreviewResource(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 text-white hover:bg-cyan-700 cursor-pointer"
              >
                {bookmarkedIds.includes(previewResource.id) ? 'Saved in Bookmarks' : 'Bookmark to My Library'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Add Custom Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-5 text-slate-800 dark:text-slate-100">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">Add Custom Study Resource</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">Resource Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Multivariable Calculus MIT Formula Sheet"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">Subject</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value as Subject)}
                    className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
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

                <div>
                  <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Cheat Sheet">Cheat Sheet</option>
                    <option value="Formula Sheet">Formula Sheet</option>
                    <option value="Textbook Guide">Textbook Guide</option>
                    <option value="Interactive Tool">Interactive Tool</option>
                    <option value="Video Playlist">Video Playlist</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">Author or Source</label>
                <input
                  type="text"
                  placeholder="e.g. MIT OpenCourseWare, Stanford, Professor Lecture"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  placeholder="Briefly describe what key theorems or problems this covers..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Calculus, Stokes Theorem, Finals"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 cursor-pointer"
                >
                  Add Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
