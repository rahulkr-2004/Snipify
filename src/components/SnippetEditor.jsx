import { useState, useEffect } from 'react';
import { FiX, FiSave, FiTag, FiFolder, FiLock, FiGlobe, FiCode } from 'react-icons/fi';
import Editor from '@monaco-editor/react';

export default function SnippetEditor({ isOpen, onClose, onSave, folders, initialSnippet = null }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [tagsInput, setTagsInput] = useState('');
  const [folderId, setFolderId] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialSnippet) {
        setTitle(initialSnippet.title || '');
        setDescription(initialSnippet.description || '');
        setCode(initialSnippet.code || '');
        setLanguage(initialSnippet.language || 'javascript');
        setTagsInput((initialSnippet.tags || []).join(', '));
        setFolderId(initialSnippet.folderId || '');
        setVisibility(initialSnippet.visibility || 'private');
      } else {
        setTitle('');
        setDescription('');
        setCode('');
        setLanguage('javascript');
        setTagsInput('');
        setFolderId('');
        setVisibility('private');
      }
    }
  }, [isOpen, initialSnippet]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (isOpen && !isSaving && title && code) {
          handleSubmit();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSaving, title, code, language, tagsInput, folderId, visibility]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    
    // Process Tags
    const tagsArray = tagsInput.split(',').map(t => t.trim()).filter(t => t !== '');

    const snippetData = {
      title,
      description,
      code,
      language,
      tags: tagsArray,
      folderId: folderId || null,
      visibility,
      isFavorite: initialSnippet ? (initialSnippet.isFavorite || false) : false
    };

    await onSave(snippetData, initialSnippet?.id);
    setIsSaving(false);
    onClose();
  };

  const handleShare = () => {
    if (initialSnippet?.id) {
       const url = `${window.location.origin}/snippet/${initialSnippet.id}`;
       navigator.clipboard.writeText(url);
       alert("Public Share Link copied to clipboard!\n" + url);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Slide-over Panel */}
      <div className="absolute inset-y-0 right-0 max-w-2xl w-full flex">
        <div className="w-full h-full bg-[#0a0a0f] border-l border-white/10 shadow-2xl flex flex-col transform transition-transform duration-500 ease-in-out">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/5">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <FiCode className="text-purple-400" />
              {initialSnippet ? 'Edit Snippet' : 'New Snippet'}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col gap-6">
            
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Snippet Title</label>
              <input
                required
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Authentication Hook"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium placeholder-gray-600"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description (Optional)</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Write a short description or markdown notes for this snippet..."
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm h-20 custom-scrollbar resize-none placeholder-gray-600"
              />
            </div>

            {/* Language & Folder Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-1.5"><FiCode size={14}/> Language</label>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all appearance-none [&>option]:bg-gray-900"
                >
                  <option className="bg-gray-900 text-white" value="javascript">JavaScript</option>
                  <option className="bg-gray-900 text-white" value="typescript">TypeScript</option>
                  <option className="bg-gray-900 text-white" value="python">Python</option>
                  <option className="bg-gray-900 text-white" value="html">HTML</option>
                  <option className="bg-gray-900 text-white" value="css">CSS</option>
                  <option className="bg-gray-900 text-white" value="java">Java</option>
                  <option className="bg-gray-900 text-white" value="c">C</option>
                  <option className="bg-gray-900 text-white" value="cpp">C++</option>
                  <option className="bg-gray-900 text-white" value="csharp">C#</option>
                  <option className="bg-gray-900 text-white" value="php">PHP</option>
                  <option className="bg-gray-900 text-white" value="ruby">Ruby</option>
                  <option className="bg-gray-900 text-white" value="swift">Swift</option>
                  <option className="bg-gray-900 text-white" value="kotlin">Kotlin</option>
                  <option className="bg-gray-900 text-white" value="bash">Bash scripting</option>
                  <option className="bg-gray-900 text-white" value="go">Go</option>
                  <option className="bg-gray-900 text-white" value="rust">Rust</option>
                  <option className="bg-gray-900 text-white" value="json">JSON</option>
                  <option className="bg-gray-900 text-white" value="sql">SQL</option>
                  <option className="bg-gray-900 text-white" value="plaintext">Plain Text</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-1.5"><FiFolder size={14}/> Folder</label>
                <select
                  value={folderId}
                  onChange={e => setFolderId(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all appearance-none [&>option]:bg-gray-900"
                >
                  <option className="bg-gray-900 text-white" value="">No Folder (Uncategorized)</option>
                  {folders.map(f => (
                    <option className="bg-gray-900 text-white" key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Code Editor Area */}
            <div className="flex-1 flex flex-col min-h-[300px]">
              <label className="block text-sm font-medium text-gray-300 mb-2">Code</label>
              <div className="flex-1 w-full bg-[#0d0d14] border border-white/10 rounded-xl overflow-hidden shadow-inner focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all">
                <Editor
                  height="100%"
                  language={language === 'bash' ? 'shell' : language}
                  theme="vs-dark"
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: 'monospace',
                    padding: { top: 16, bottom: 16 },
                    scrollBeyondLastLine: false,
                    smoothScrolling: true,
                    cursorBlinking: "smooth",
                    renderLineHighlight: "all",
                    formatOnPaste: true,
                    wordWrap: "on"
                  }}
                  loading={<div className="flex items-center justify-center h-full text-gray-500 text-sm">Loading Editor...</div>}
                />
              </div>
            </div>

            {/* Tags & Visibility Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-1.5"><FiTag size={14}/> Tags (comma separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  placeholder="react, hooks, api"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Visibility</label>
                <div className="flex bg-black/50 border border-white/10 rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => setVisibility('private')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${visibility === 'private' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    <FiLock size={14} /> Private
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisibility('public')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${visibility === 'public' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    <FiGlobe size={14} /> Public
                  </button>
                </div>
              </div>
            </div>

          </form>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex items-center justify-between">
            {initialSnippet?.id && visibility === 'public' ? (
              <button 
                type="button"
                onClick={handleShare}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-4 py-2 rounded-xl transition-colors font-medium text-sm"
              >
                <FiGlobe /> Copy Public Link
              </button>
            ) : (
              <div></div>
            )}

            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>

              <button 
                onClick={handleSubmit}
                disabled={isSaving}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <FiSave />
                )}
                <span>{isSaving ? 'Saving...' : 'Save Snippet'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
