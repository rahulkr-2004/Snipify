// About Page

export default function About() {
  const developers = [
    {
      name: "Rahul Kumar",
      role: "UI/UX Designer | Team Lead",
      email: "rahulamp2003@gmail.com",
      avatar: "/avatars/rahul.png"
    },
    {
      name: "Raghuvansh Koushal",
      role: "Full Stack Engineer",
      email: "raghuvanshkoushal54787@gmail.com",
      avatar: "/avatars/raghuvansh.png"
    },
    {
      name: "Rohit Singh Baghel",
      role: "Backend Architecture",
      email: "rohitbaghel0802@gmail.com",
      avatar: "/avatars/rohit.png"
    },
    {
      name: "Sagar Kumar",
      role: "Frontend Engineer",
      email: "sagar223346@gmail.com",
      avatar: "/avatars/sagar.png"
    }
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] relative overflow-hidden flex flex-col items-center pt-24 px-6 pb-24">

      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:32px_32px]"
        style={{
          maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 100%)'
        }}
      ></div>

      <div className="z-10 w-full max-w-5xl flex flex-col items-center text-center mb-24">
        <div className="absolute top-[20%] w-[400px] h-[100px] bg-gradient-to-r from-[#7c3aed] to-[#2563eb] blur-[100px] opacity-40 mix-blend-screen pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-purple-500/30 mb-8 mt-10">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
          <span className="text-sm font-medium text-purple-200">Snipify</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8">
          Code Organization <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
            at the speed of thought.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-3xl leading-relaxed">
          The Online Code Snippet Manager is a full-stack web application designed to help developers and students store, organize, and manage reusable code efficiently. It eliminates scattered logic across fragmented platforms by offering a centralized, searchable, beautifully-designed codebase toolkit.
        </p>
      </div>

      <div className="z-10 w-full max-w-6xl mt-auto">
        <div className="flex items-center gap-4 mb-10 w-full">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent flex-1"></div>
          <h3 className="text-sm font-bold tracking-widest text-gray-400 uppercase">Meet the Building Team</h3>
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent flex-1"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {developers.map((dev, index) => (
            <div
              key={index}
              className="glass-panel p-6 rounded-2xl flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 border border-white/5 hover:border-purple-500/30 group"
            >
              <div className="w-20 h-20 rounded-full mb-4 p-1 bg-gradient-to-tr from-gray-800 to-gray-700 group-hover:from-purple-500 group-hover:to-blue-500 transition-colors duration-300">
                <img src={dev.avatar} alt={dev.name} className="w-full h-full rounded-full object-cover" />
              </div>
              <h4 className="text-lg font-bold text-white mb-1 whitespace-nowrap">{dev.name}</h4>
              <span className="text-sm font-medium text-purple-400 mb-3">{dev.role}</span>
              <a href={`mailto:${dev.email}`} title={dev.email} className="text-xs font-medium text-gray-400 hover:text-white transition-colors bg-white/5 py-1.5 px-4 rounded-full w-full text-center truncate block">
                {dev.email}
              </a>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
