import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError(err.message);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 relative overflow-hidden">

      <div className="w-full max-w-md p-6 sm:p-10 glass-panel rounded-2xl relative">
        <div className="text-center mb-10">
          <img src="/logo.png" alt="Snipify Logo" className="w-24 h-24 mx-auto mb-4 rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.3)] object-cover bg-black p-1" />
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight">
            Welcome to <span className="text-gradient" style={{ fontFamily: '"Nosifer", "Creepster", cursive', letterSpacing: '2px', textTransform: 'uppercase', textShadow: '0 0 20px rgba(168,85,247,0.4)' }}>SNIPIFY</span>
          </h1>
          <p className="text-color-text-secondary text-sm">Sign in to manage your snippets.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-300">Email Address</label>
            <input
              type="email"
              required
              className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6f55ff]/50 transition-all font-mono text-sm"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-300">Password</label>
            <input
              type="password"
              required
              className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6f55ff]/50 transition-all font-mono text-sm"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          New user?  <Link to="/register" className="text-white hover:text-[#fb437c] transition-colors font-medium">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
