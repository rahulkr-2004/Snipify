import { useState } from 'react';
import { FiBookOpen, FiCommand, FiLock, FiLayout, FiSearch, FiCode, FiFolder, FiStar, FiGlobe } from 'react-icons/fi';

const DOC_SECTIONS = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: <FiBookOpen />,
    content: (
       <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
         <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 mb-6">Welcome to Snipify</h2>
         <p className="text-gray-300 mb-8 leading-relaxed text-lg">
           Snipify is your personal, secure code snippet manager. Designed for speed, aesthetics, and organization, it helps you store and share pieces of code you use every day without cluttering your main workspace.
         </p>
         
         <div className="bg-[#0a0a0f] border border-white/5 rounded-2xl p-6 mb-8 hover:border-purple-500/20 transition-colors">
           <h3 className="text-xl font-bold text-white mb-6">Core Concepts</h3>
           <ul className="space-y-6">
             <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                   <FiCode size={20} />
                </div>
                <div>
                   <span className="text-gray-100 font-bold block mb-1 text-lg">Snippets</span>
                   <p className="text-md text-gray-400 leading-relaxed">Standalone blocks of code. You can assign languages, tags, and organize them into folders for rapid retrieval.</p>
                </div>
             </li>
             <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
                   <FiFolder size={20} />
                </div>
                <div>
                   <span className="text-gray-100 font-bold block mb-1 text-lg">Folders & Tags</span>
                   <p className="text-md text-gray-400 leading-relaxed">Group related snippets together globally via Folders, or add granular context with comma-separated Tags.</p>
                </div>
             </li>
             <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 text-yellow-400 flex items-center justify-center shrink-0 border border-yellow-500/20">
                   <FiStar size={20} />
                </div>
                <div>
                   <span className="text-gray-100 font-bold block mb-1 text-lg">Favorites</span>
                   <p className="text-md text-gray-400 leading-relaxed">Click the star icon on any snippet you use frequently to pin it to your Favorites filter.</p>
                </div>
             </li>
           </ul>
         </div>
       </div>
    )
  },
  {
    id: 'shortcuts',
    title: 'Keyboard Shortcuts',
    icon: <FiCommand />,
    content: (
       <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
         <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Mastering Speed</h2>
         <p className="text-gray-300 mb-10 text-lg">Snipify is built to be fast. Navigate the app entirely through your keyboard to maximize your coding efficiency.</p>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-black/20">
              <div className="flex justify-between items-center mb-4">
                 <span className="text-gray-100 font-bold text-lg">Global Search</span>
                 <kbd className="bg-black/60 border border-white/10 rounded-md px-4 py-1.5 font-mono text-pink-400 font-bold shadow-inner">/</kbd>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">Instantly focus the search bar from anywhere on the Dashboard or Explore page to find snippets or tags rapidly.</p>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-black/20">
              <div className="flex justify-between items-center mb-4">
                 <span className="text-gray-100 font-bold text-lg">New Snippet</span>
                 <kbd className="bg-black/60 border border-white/10 rounded-md px-4 py-1.5 font-mono text-purple-400 font-bold shadow-inner">N</kbd>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">Create a new snippet instantly without reaching for your mouse. (Only triggers when you aren't typing in an input field).</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-black/20 md:col-span-2 max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                 <span className="text-gray-100 font-bold text-lg">Go Back / Close</span>
                 <kbd className="bg-black/60 border border-white/10 rounded-md px-4 py-1.5 font-mono text-blue-400 font-bold shadow-inner">Esc</kbd>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">Press the Escape key to instantly close any open window, modal, or editor and return to your previously opened tab.</p>
            </div>
         </div>
       </div>
    )
  },
  {
    id: 'sharing',
    title: 'Privacy & Sharing',
    icon: <FiLock />,
    content: (
       <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
         <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Visibility Modes</h2>
         <p className="text-gray-300 mb-10 text-lg">Every snippet you create defaults to Private, meaning only you can view it. However, you can opt to share snippets with the world.</p>
         
         <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start gap-6 p-6 rounded-2xl border border-red-500/20 bg-gradient-to-r from-red-500/5 to-transparent relative overflow-hidden">
               <div className="absolute right-0 top-0 w-32 h-32 bg-red-500/10 blur-3xl rounded-full"></div>
               <div className="p-3 bg-red-500/10 rounded-xl text-red-400 shrink-0">
                 <FiLock size={24}/>
               </div>
               <div>
                 <h4 className="text-white font-bold text-xl mb-2">Private (Default)</h4>
                 <p className="text-md text-gray-400 leading-relaxed">Encrypted and securely stored in the database. Will not appear in the Explore feed. Only accessible when you are logged into your account.</p>
               </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-start gap-6 p-6 rounded-2xl border border-green-500/20 bg-gradient-to-r from-green-500/5 to-transparent relative overflow-hidden">
               <div className="absolute right-0 top-0 w-32 h-32 bg-green-500/10 blur-3xl rounded-full"></div>
               <div className="p-3 bg-green-500/10 rounded-xl text-green-400 shrink-0">
                 <FiGlobe size={24}/>
               </div>
               <div>
                 <h4 className="text-white font-bold text-xl mb-2">Public Snippets</h4>
                 <p className="text-md text-gray-400 leading-relaxed">Visible to all users globally in the Explore tab. Other developers can view, copy, and download your snippet. Great for contributing to the community!</p>
               </div>
            </div>
         </div>
       </div>
    )
  },
  {
    id: 'customization',
    title: 'Customization',
    icon: <FiLayout />,
    content: (
       <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
         <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Make It Yours</h2>
         <p className="text-gray-300 mb-10 text-lg">Snipify automatically syncs your editor settings across your account so your workspace is always familiar.</p>
         
         <div className="bg-black/40 border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full mix-blend-screen"></div>
           
           <h3 className="text-xl text-white font-bold mb-4 relative z-10">Syntax Themes</h3>
           <p className="text-md text-gray-400 mb-8 leading-relaxed relative z-10">
             Click your <strong className="text-gray-200">Profile Icon</strong> (bottom left) to open your Profile Settings, where you can select between Dracula, Atom Dark, Material Dark, or the default VS Code Dark+ theme. This changes how code blocks look across your Dashboard and the Explore feed natively.
           </p>
           
           <h3 className="text-xl text-white font-bold mb-4 relative z-10">Profile Picture</h3>
           <p className="text-md text-gray-400 leading-relaxed relative z-10">
             Upload a custom image directly in your Profile Settings to represent yourself on the Public Explore feed when you share snippets. Your avatar and display name identify your contributions.
           </p>
         </div>
       </div>
    )
  }
];

export default function Documentation() {
  const [activeSection, setActiveSection] = useState(DOC_SECTIONS[0].id);

  return (
    <div className="min-h-[calc(100vh-80px)] relative overflow-hidden flex flex-col pt-12 px-4 md:px-12 pb-24 max-w-7xl mx-auto w-full">
      <div className="absolute top-[10%] left-[20%] w-[500px] h-[200px] bg-gradient-to-r from-[#fb437c] to-[#6f55ff] blur-[150px] opacity-20 mix-blend-screen pointer-events-none"></div>

      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 flex items-center gap-4">
          Documentation
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Live</span>
          </div>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl">
          Everything you need to know about setting up, securing, and navigating your snippet vault.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 relative z-10">
        
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col gap-2 sticky top-24">
            {DOC_SECTIONS.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-300 text-left ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white shadow-lg border border-purple-500/30' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'
                  }`}
                >
                  <span className={`${isActive ? 'text-purple-400' : 'text-gray-500'}`}>
                    {section.icon}
                  </span>
                  {section.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 bg-black/40 min-h-[600px] shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-noise opacity-[0.02] mix-blend-overlay pointer-events-none"></div>
            
            {DOC_SECTIONS.find(s => s.id === activeSection)?.content}
          </div>
        </div>

      </div>
    </div>
  );
}
