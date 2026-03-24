import { FiSearch, FiCommand, FiPlus, FiCode, FiClock, FiTrash2, FiDownload, FiCopy, FiMenu } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import SnippetEditor from '../components/SnippetEditor';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, dracula, materialDark, atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/db';

export default function Dashboard({ openProfile }) {
  const { currentUser } = useAuth();
  
  const [folders, setFolders] = useState([]);
  const [snippets, setSnippets] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState(null);
  const [filterMode, setFilterMode] = useState('all'); // 'all' or 'favorites'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [syntaxThemeName, setSyntaxThemeName] = useState('vscDarkPlus');

  const searchInputRef = useRef(null);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      // '/' to focus search
      if (e.key === '/') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // 'N' to new snippet
      if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setEditingSnippet(null);
        setIsEditorOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle saving snippet
  const handleSaveSnippet = async (snippetData, id) => {
    try {
      if (id) {
        await dbService.updateSnippet(id, snippetData);
        setSnippets(prev => prev.map(s => s.id === id ? { ...s, ...snippetData, updatedAt: new Date() } : s));
      } else {
        const newSnippet = await dbService.createSnippet(currentUser.uid, snippetData);
        setSnippets(prev => [newSnippet, ...prev]);
      }
    } catch (err) {
      console.error("Failed to save snippet", err);
    }
  };

  // Handle deleting snippet
  const handleDeleteSnippet = async (id, e) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this snippet?")) {
      try {
        await dbService.deleteSnippet(id);
        setSnippets(prev => prev.filter(s => s.id !== id));
      } catch (err) {
        console.error("Failed to delete snippet", err);
      }
    }
  };

  // Handle toggling favorite
  const handleToggleFavorite = async (snippet, e) => {
    e.stopPropagation();
    try {
      const newStatus = !snippet.isFavorite;
      await dbService.updateSnippet(snippet.id, { isFavorite: newStatus });
      setSnippets(prev => prev.map(s => s.id === snippet.id ? { ...s, isFavorite: newStatus } : s));
    } catch (err) {
      console.error("Failed to update favorite status", err);
    }
  };

  // Handle downloading snippet
  const handleDownloadSnippet = (snippet, e) => {
    e.stopPropagation();
    
    const getExtension = (lang) => {
      const map = {
        javascript: 'js', typescript: 'ts', python: 'py', html: 'html', css: 'css',
        java: 'java', c: 'c', cpp: 'cpp', csharp: 'cs', php: 'php', ruby: 'rb',
        swift: 'swift', kotlin: 'kt', bash: 'sh', go: 'go', rust: 'rs',
        json: 'json', sql: 'sql', plaintext: 'txt'
      };
      return map[lang] || 'txt';
    };

    const element = document.createElement("a");
    const file = new Blob([snippet.code], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${snippet.title.replace(/\\s+/g, '_').toLowerCase()}.${getExtension(snippet.language)}`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
  };


  // Fetch Data from Firestore
  useEffect(() => {
    if (!currentUser) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [userFolders, userSnippets] = await Promise.all([
          dbService.getUserFolders(currentUser.uid),
          dbService.getUserSnippets(currentUser.uid)
        ]);
        setFolders(userFolders);
        setSnippets(userSnippets);
        if (userData?.syntaxTheme) setSyntaxThemeName(userData.syntaxTheme);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [currentUser]);

  // Folder Actions
  const handleCreateFolder = async (name) => {
    try {
      const newFolder = await dbService.createFolder(currentUser.uid, name);
      setFolders(prev => [...prev, newFolder]);
    } catch (err) {
      console.error("Failed to create folder", err);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (confirm("Are you sure you want to delete this folder? All snippets inside will be uncategorized.")) {
      try {
        await dbService.deleteFolder(folderId);
        setFolders(prev => prev.filter(f => f.id !== folderId));
        if (selectedFolder === folderId) setSelectedFolder(null);
      } catch (err) {
        console.error("Failed to delete folder", err);
      }
    }
  };

  // Filter Snippets
  const displayedSnippets = snippets.filter(snippet => {
    const matchesSearch = snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          snippet.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFolder = selectedFolder ? snippet.folderId === selectedFolder : true;
    const matchesFilterMode = filterMode === 'favorites' ? snippet.isFavorite : true;
    
    return matchesSearch && matchesFolder && matchesFilterMode;
  });

  return (
    <div className="flex w-full h-[calc(100vh-80px)] overflow-hidden">
      <Sidebar 
        folders={folders} 
        selectedFolder={selectedFolder}
        setSelectedFolder={setSelectedFolder}
        onCreateFolder={handleCreateFolder}
        onDeleteFolder={handleDeleteFolder}
        filterMode={filterMode}
        setFilterMode={setFilterMode}
        openProfile={openProfile}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10 px-4 md:px-8 pt-4 md:pt-8">
        
        {/* Top Header Area */}
        <header className="flex justify-between items-start md:items-center mb-8 flex-col md:flex-row gap-4 w-full">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-gray-400 hover:text-white bg-white/5 rounded-xl border border-white/10"
            >
              <FiMenu size={24} />
            </button>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {filterMode === 'favorites' ? 'Favorite Snippets' : 
                 selectedFolder ? folders.find(f => f.id === selectedFolder)?.name : 'All Snippets'}
              </h2>
              <p className="text-gray-400 mt-1 text-sm md:text-base">
                {loading ? "Loading library..." : `Showing ${displayedSnippets.length} snippets.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-500 group-focus-within:text-purple-400 transition-colors" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full md:w-80 pl-10 pr-12 py-2.5 border border-white/10 rounded-xl leading-5 bg-black/40 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm backdrop-blur-md transition-all"
                placeholder="Search snippets..."
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <div className="flex items-center gap-1 text-xs text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">
                  <FiCommand size={10} />
                  <span>K</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsEditorOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-purple-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <FiPlus />
              <span className="hidden sm:inline">New Snippet</span>
            </button>
          </div>
        </header>

        {/* Snippet Grid */}
        <div className="flex-1 overflow-y-auto pb-12 custom-scrollbar">
          {!loading && displayedSnippets.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl mx-2">
              <FiCode className="text-4xl text-gray-600 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No snippets found</h3>
              <p className="text-gray-400 text-sm">Create a new snippet to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {displayedSnippets.map((snippet) => (
                <div 
                  key={snippet.id} 
                  onClick={() => {
                    setEditingSnippet(snippet);
                    setIsEditorOpen(true);
                  }}
                  className="glass-panel p-6 rounded-2xl hover:border-purple-500/40 transition-all duration-300 group cursor-pointer flex flex-col h-56 relative overflow-hidden shadow-lg shadow-black/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="flex justify-between items-start mb-3 relative z-10">
                    <div className="flex items-center gap-3 w-5/6">
                       <div className="p-2 bg-white/5 rounded-lg text-gray-300 border border-white/5 group-hover:bg-purple-500/10 group-hover:border-purple-500/30 transition-all shrink-0">
                         <FiCode size={18} />
                       </div>
                       <div>
                         <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors truncate">{snippet.title}</h3>
                         <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mt-0.5">{snippet.language}</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                       <button 
                         onClick={(e) => handleToggleFavorite(snippet, e)}
                         className={`p-1.5 rounded bg-white/5 opacity-0 group-hover:opacity-100 transition-all ${snippet.isFavorite ? 'text-yellow-400 opacity-100' : 'text-gray-500 hover:text-yellow-400'}`}
                         title={snippet.isFavorite ? "Unfavorite" : "Favorite"}
                       >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={snippet.isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                       </button>
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           navigator.clipboard.writeText(snippet.code);
                           dbService.incrementCopyCount(snippet.id).catch(err => console.error("Failed to increment copy count", err));
                           setSnippets(prev => prev.map(s => s.id === snippet.id ? { ...s, copies: (s.copies || 0) + 1 } : s));
                           alert("Code copied to clipboard!");
                         }}
                         className="text-gray-500 hover:text-green-400 p-1.5 rounded bg-white/5 opacity-0 group-hover:opacity-100 transition-all"
                         title="Copy Code"
                       >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                       </button>

                       <button 
                         onClick={(e) => handleDownloadSnippet(snippet, e)}
                         className="text-gray-500 hover:text-blue-400 p-1.5 rounded bg-white/5 opacity-0 group-hover:opacity-100 transition-all"
                         title="Download Code"
                       >
                         <FiDownload size={16} />
                       </button>
                       <button 
                         onClick={(e) => handleDeleteSnippet(snippet.id, e)}
                         className="text-gray-500 hover:text-red-400 p-1.5 rounded bg-white/5 opacity-0 group-hover:opacity-100 transition-all"
                         title="Delete Snippet"
                       >
                         <FiTrash2 size={16} />
                       </button>
                     </div>
                  </div>

                  {snippet.description && (
                    <p className="text-xs text-gray-400 mb-3 line-clamp-2 relative z-10 leading-relaxed pr-2">
                       {snippet.description}
                    </p>
                  )}

                  <div className="flex-1 mb-4 relative z-10 bg-black/40 rounded-lg border border-white/5 overflow-hidden">
                     <SyntaxHighlighter 
                       language={snippet.language} 
                       style={{ vscDarkPlus, dracula, materialDark, atomDark }[syntaxThemeName] || vscDarkPlus}
                       customStyle={{ margin: 0, padding: '12px', background: 'transparent', fontSize: '13px', height: '100%', overflow: 'hidden' }}
                       wrapLines={true}
                     >
                       {snippet.code || "No code provided."}
                     </SyntaxHighlighter>
                     <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0d0d14] to-transparent pointer-events-none"></div>
                  </div>

                  <div className="flex items-center justify-between mt-auto relative z-10">
                    <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
                      {snippet.tags?.map(tag => (
                        <span key={tag} className="text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded bg-white/5 text-gray-400 border border-white/5 whitespace-nowrap">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 ml-4 shrink-0">
                      <div className="flex items-center gap-1.5 text-xs text-green-400 font-medium bg-green-400/10 px-2 py-1 rounded-md" title="Total Copies">
                        <FiCopy size={12} />
                        <span>{snippet.copies || 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium shrink-0 bg-white/5 px-2 py-1 rounded-md">
                        <FiClock size={12} />
                        <span>{snippet.updatedAt?.toDate ? new Date(snippet.updatedAt.toDate()).toLocaleDateString() : 'Just now'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Slide-over Editor */}
      <SnippetEditor 
        isOpen={isEditorOpen}
        onClose={() => { setIsEditorOpen(false); setEditingSnippet(null); }}
        onSave={handleSaveSnippet}
        folders={folders}
        initialSnippet={editingSnippet}
      />
    </div>
  );
}
