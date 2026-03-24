import { FiSearch, FiCode, FiClock, FiDownload, FiGlobe, FiCopy, FiUser } from 'react-icons/fi';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, dracula, materialDark, atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState, useEffect } from 'react';
import { dbService } from '../services/db';
import { useAuth } from '../context/AuthContext';

export default function Explore() {
  const { currentUser } = useAuth();
  const [snippets, setSnippets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [syntaxThemeName, setSyntaxThemeName] = useState('vscDarkPlus');

  // Use a map to store user profiles fetched lazily to reduce DB reads
  const [userCache, setUserCache] = useState({});

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const publicSnippets = await dbService.getPublicSnippets();
        setSnippets(publicSnippets);
        
        // Fetch users for each snippet uniquely
        const uniqueUserIds = [...new Set(publicSnippets.map(s => s.userId))];
        const newCache = { ...userCache };
        for (const uid of uniqueUserIds) {
          if (!newCache[uid]) {
             const usr = await dbService.getUser(uid);
             newCache[uid] = usr || { displayName: 'Anonymous' };
          }
        }
        setUserCache(newCache);
        
        if (currentUser?.uid) {
           const me = await dbService.getUser(currentUser.uid);
           if (me?.syntaxTheme) setSyntaxThemeName(me.syntaxTheme);
        }
      } catch (err) {
        console.error("Failed to load public snippets", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleDownloadSnippet = (snippet, e) => {
    e.stopPropagation();
    const getExtension = (lang) => {
      const map = { javascript: 'js', typescript: 'ts', python: 'py', html: 'html', css: 'css', java: 'java', go: 'go', rust: 'rs', json: 'json', plaintext: 'txt' };
      return map[lang] || 'txt';
    };
    const element = document.createElement("a");
    const file = new Blob([snippet.code], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${snippet.title.replace(/\s+/g, '_').toLowerCase()}.${getExtension(snippet.language)}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const displayedSnippets = snippets.filter(snippet => {
    return snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           (snippet.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div className="flex-1 w-full min-h-[calc(100vh-80px)] overflow-hidden relative z-10 px-4 md:px-12 pt-8 flex flex-col">
      <header className="flex justify-between items-end mb-10 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight flex items-center gap-3">
            <FiGlobe className="text-blue-400" /> Explore
          </h2>
          <p className="text-gray-400 mt-2 text-lg">
            Discover and copy public snippets from the community.
          </p>
        </div>
        <div className="relative w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-3 border border-white/10 rounded-2xl bg-black/40 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
            placeholder="Search community snippets..."
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-12 custom-scrollbar">
        {loading ? (
           <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
        ) : displayedSnippets.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl">
            <FiGlobe className="text-4xl text-gray-600 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No public snippets found!</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {displayedSnippets.map((snippet) => (
              <div 
                key={snippet.id} 
                className="glass-panel p-6 rounded-2xl hover:border-blue-500/40 transition-all duration-300 group flex flex-col h-72 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex items-center gap-3 w-3/4">
                     <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
                       <FiCode size={20} />
                     </div>
                     <div>
                       <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors truncate">{snippet.title}</h3>
                       <div className="flex items-center gap-2 mt-1">
                         <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                           {userCache[snippet.userId]?.photoURL ? (
                             <img src={userCache[snippet.userId].photoURL} alt="" className="w-full h-full object-cover" />
                           ) : <FiUser size={10} className="text-gray-400" />}
                         </div>
                         <p className="text-xs text-gray-400 truncate">{userCache[snippet.userId]?.displayName || 'Anonymous'}</p>
                       </div>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-1 bg-black/40 rounded-lg p-1 border border-white/10">
                     <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         navigator.clipboard.writeText(snippet.code);
                         dbService.incrementCopyCount(snippet.id).catch(err => console.error("Failed to increment copy count", err));
                         setSnippets(prev => prev.map(s => s.id === snippet.id ? { ...s, copies: (s.copies || 0) + 1 } : s));
                         alert("Code copied to clipboard!");
                       }}
                       className="text-gray-400 hover:text-green-400 p-2 rounded-md hover:bg-white/10 transition-all"
                       title="Copy Code"
                     >
                       <FiCopy size={16} />
                     </button>
                     <button 
                       onClick={(e) => handleDownloadSnippet(snippet, e)}
                       className="text-gray-400 hover:text-blue-400 p-2 rounded-md hover:bg-white/10 transition-all"
                       title="Download Code"
                     >
                       <FiDownload size={16} />
                     </button>

                  </div>
                </div>

                {snippet.description && (
                  <p className="text-xs text-gray-400 mb-3 line-clamp-2 relative z-10 leading-relaxed pr-2">
                     {snippet.description}
                  </p>
                )}

                <div className="flex-1 mb-4 relative z-10 bg-[#0d0d14] rounded-xl border border-white/5 overflow-hidden shadow-inner">
                   <div className="absolute top-0 right-0 px-2 py-1 bg-white/5 rounded-bl-lg text-[10px] font-bold text-gray-500 uppercase tracking-widest z-20">
                     {snippet.language}
                   </div>
                   <SyntaxHighlighter 
                     language={snippet.language} 
                     style={{ vscDarkPlus, dracula, materialDark, atomDark }[syntaxThemeName] || vscDarkPlus}
                     customStyle={{ margin: 0, padding: '16px', background: 'transparent', fontSize: '13px', height: '100%', overflow: 'hidden' }}
                     wrapLines={true}
                   >
                     {snippet.code || "No code."}
                   </SyntaxHighlighter>
                   <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0d0d14] to-transparent pointer-events-none"></div>
                </div>

                <div className="flex items-center justify-between mt-auto relative z-10">
                  <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
                    {(snippet.tags || []).map(tag => (
                      <span key={tag} className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 whitespace-nowrap">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 ml-4 shrink-0">
                      <div className="flex items-center gap-1.5 text-xs text-green-400 font-medium bg-green-400/10 px-2 py-1 rounded-md" title="Total Copies">
                        <FiCopy size={12} />
                        <span>{snippet.copies || 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium bg-white/5 px-2 py-1 rounded-md">
                        <FiClock size={12} />
                        <span>{snippet.createdAt?.toDate ? snippet.createdAt.toDate().toLocaleDateString() : 'Just now'}</span>
                      </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
