import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { FiFolder, FiPlus, FiStar, FiSettings, FiLogOut, FiHash, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { dbService } from '../services/db';

export default function Sidebar({ 
  folders, 
  selectedFolder, 
  setSelectedFolder, 
  onCreateFolder,
  onDeleteFolder,
  filterMode,
  setFilterMode,
  openProfile
}) {
  const { logout, currentUser } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [userData, setUserData] = useState(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    if (currentUser?.uid) {
      dbService.getUser(currentUser.uid).then(data => {
        if (data) setUserData(data);
      });
    }
  }, [currentUser]);

  const displayPhoto = userData?.photoURL !== undefined ? userData.photoURL : currentUser?.photoURL;
  const displayName = userData?.displayName || currentUser?.displayName || currentUser?.email;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const submitFolder = (e) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName('');
      setIsCreating(false);
    }
  };

  return (
    <aside className="w-64 border-r border-white/10 bg-black/40 backdrop-blur-xl h-full flex flex-col pt-6 z-10 w-full md:w-64 shrink-0 transition-all absolute md:relative -translate-x-full md:translate-x-0">
      
      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        <button 
          onClick={() => { setSelectedFolder(null); setFilterMode('all'); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${!selectedFolder && filterMode === 'all' ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
           <FiFolder className={!selectedFolder && filterMode === 'all' ? "text-purple-400" : ""} />
           <span>All Snippets</span>
        </button>
        <button 
          onClick={() => { setSelectedFolder(null); setFilterMode('favorites'); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${filterMode === 'favorites' ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
           <FiStar className="text-yellow-400" />
           <span>Favorites</span>
        </button>

        <div className="pt-6 pb-2 px-3">
           <div className="flex items-center justify-between mb-2">
             <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Folders</span>
             <button 
               onClick={() => setIsCreating(true)}
               className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
             >
               <FiPlus size={14} />
             </button>
           </div>
           
           {isCreating && (
             <form onSubmit={submitFolder} className="mb-2 px-1">
               <input 
                 autoFocus
                 type="text" 
                 value={newFolderName}
                 onChange={e => setNewFolderName(e.target.value)}
                 onBlur={() => setIsCreating(false)}
                 placeholder="Folder name..."
                 className="w-full bg-black/50 border border-purple-500/50 rounded-md px-2 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500"
               />
             </form>
           )}

           {/* Dynamic Folders */}
           <div className="space-y-1">
             {folders.map(folder => (
               <div key={folder.id} className="relative group">
                 <button 
                   onClick={() => { setSelectedFolder(folder.id); setFilterMode('all'); }}
                   className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${selectedFolder === folder.id && filterMode !== 'favorites' ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                 >
                   <FiFolder size={16} className={selectedFolder === folder.id && filterMode !== 'favorites' ? "text-blue-400" : ""} />
                   <span className="truncate pr-6">{folder.name}</span>
                 </button>
                 <button 
                   onClick={(e) => { e.stopPropagation(); onDeleteFolder(folder.id); }}
                   className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                 >
                   <FiTrash2 size={12} />
                 </button>
               </div>
             ))}
             {folders.length === 0 && !isCreating && (
               <p className="text-xs text-gray-600 px-3 italic">No folders yet</p>
             )}
           </div>
        </div>
      </nav>

      {/* User Profile / Bottom Actions */}
      <div className="p-4 border-t border-white/10">
        <button onClick={openProfile} className="w-full flex items-center gap-3 px-2 py-2 mb-2 hover:bg-white/5 rounded-lg transition-colors text-left">
          {displayPhoto ? (
            <img src={displayPhoto} alt="Profile" className="w-8 h-8 rounded-full shrink-0 object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
               {displayName?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{displayName}</p>
            <p className="text-xs text-gray-400">Settings</p>
          </div>
        </button>
        
        <div className="space-y-1">
          <button 
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 text-sm transition-colors"
          >
            <FiLogOut size={16} />
            <span>Log out</span>
          </button>
        </div>
      </div>

      {isLogoutModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300" onClick={() => setIsLogoutModalOpen(false)}>
          <div className="w-full max-w-sm glass-panel p-8 rounded-3xl shadow-2xl relative transform transition-all border border-purple-500/30 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 pointer-events-none"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 mb-4 flex items-center justify-center border border-red-500/20">
                <FiLogOut className="text-red-400 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Sign Out</h2>
              <p className="text-gray-300 mb-8 text-center text-base">Are you sure want to log out?</p>
              <div className="flex justify-center gap-4 w-full">
                <button 
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10 flex-1 text-center"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setIsLogoutModalOpen(false);
                    handleLogout();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 hover:opacity-90 text-white font-bold transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] flex-1 text-center"
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

    </aside>
  );
}
