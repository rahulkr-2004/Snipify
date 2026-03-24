import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { FiCode, FiClock, FiChevronLeft, FiLock } from 'react-icons/fi';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function PublicSnippet() {
  const { id } = useParams();
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const docRef = doc(db, 'snippets', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.visibility === 'public') {
            setSnippet({ id: docSnap.id, ...data });
          } else {
            setError("This snippet is private or does not exist.");
          }
        } else {
          setError("This snippet does not exist.");
        }
      } catch (err) {
        console.error("Error fetching snippet", err);
        setError("Error loading snippet.");
      } finally {
        setLoading(false);
      }
    };

    fetchSnippet();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium">Loading snippet...</p>
        </div>
      </div>
    );
  }

  if (error || !snippet) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="glass-panel max-w-md w-full p-8 rounded-3xl flex flex-col items-center border border-white/10 shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <FiLock className="text-3xl text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-8">{error}</p>
          <Link to="/" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3 rounded-xl font-medium shadow-lg transition-transform transform hover:-translate-y-0.5">
            <FiChevronLeft /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-4xl w-full flex flex-col z-10">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <FiChevronLeft size={20} />
            <span className="font-medium">Go to Snipify</span>
          </Link>
          <div className="flex items-center gap-3">
             <button 
               onClick={() => {
                 navigator.clipboard.writeText(snippet.code);
                 alert("Code copied to clipboard!");
               }}
               className="text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg font-medium text-sm transition-all"
             >
               Copy Code
             </button>
          </div>
        </div>

        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl shadow-black/50">
          <div className="flex items-start justify-between mb-8 flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-white/5 rounded-xl text-purple-400 border border-white/10">
                 <FiCode size={24} />
               </div>
               <div>
                 <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{snippet.title}</h1>
                 <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold mt-1">Shared Snippet • {snippet.language}</p>
               </div>
            </div>
            
            <div className="flex gap-2flex-wrap mt-2 sm:mt-0">
               {snippet.tags?.map(tag => (
                 <span key={tag} className="text-xs font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-white/5 text-gray-300 border border-white/5">
                   {tag}
                 </span>
               ))}
            </div>
          </div>

          <div className="bg-black/50 rounded-xl overflow-hidden border border-white/10 shadow-inner">
             <SyntaxHighlighter 
               language={snippet.language} 
               style={vscDarkPlus}
               customStyle={{ margin: 0, padding: '24px', background: 'transparent', fontSize: '14px', borderRadius: '0.75rem' }}
               wrapLines={true}
             >
               {snippet.code}
             </SyntaxHighlighter>
          </div>

          <div className="flex justify-between items-center mt-6 text-sm text-gray-500 font-medium">
            <p>Powered by <span className="text-purple-400 font-bold tracking-tight">Snipify</span></p>
            <div className="flex items-center gap-1.5">
               <FiClock size={14} />
               <span>{snippet.createdAt?.toDate ? new Date(snippet.createdAt.toDate()).toLocaleDateString() : 'Just now'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
