import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from 'firebase/auth';
import { dbService } from '../services/db';
import { FiUser, FiSave, FiUpload, FiX } from 'react-icons/fi';

export default function ProfileModal({ isOpen, onClose }) {
  const { currentUser } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [syntaxTheme, setSyntaxTheme] = useState('vscDarkPlus');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen && currentUser) {
      setDisplayName(currentUser.displayName || '');
      setPhotoURL(currentUser.photoURL || '');
      dbService.getUser(currentUser.uid).then(d => {
        if (d?.syntaxTheme) setSyntaxTheme(d.syntaxTheme);
      });
    }
  }, [isOpen, currentUser]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 250;
          const MAX_HEIGHT = 250;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
               height *= MAX_WIDTH / width;
               width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
               width *= MAX_HEIGHT / height;
               height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8)); 
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSaving(true);
    setMessage('');
    try {
      let updatedPhotoURL = photoURL;
      
      if (imageFile) {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!allowedTypes.includes(imageFile.type)) {
           setMessage("Only PNG, JPG, or JPEG images are allowed.");
           setIsSaving(false);
           return;
        }
        updatedPhotoURL = await compressImage(imageFile);
      }

      await dbService.updateUser(currentUser.uid, {
        displayName,
        photoURL: updatedPhotoURL,
        syntaxTheme
      });

      if (updatedPhotoURL === "") {
        await updateProfile(currentUser, { displayName, photoURL: "" });
      } else if (updatedPhotoURL && !updatedPhotoURL.startsWith('data:')) {
        await updateProfile(currentUser, { displayName, photoURL: updatedPhotoURL });
      } else {
        await updateProfile(currentUser, { displayName });
      }

      setMessage('Profile updated successfully!');
      setTimeout(() => {
        onClose();
        window.location.reload(); 
      }, 1000);
    } catch (err) {
      console.error("Profile Update Error:", err);
      setMessage(`Error: ${err.message || 'Failed to update profile.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md" onClick={onClose}>
      <div className="w-full max-w-lg glass-panel p-8 rounded-3xl shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl">
           <FiX size={20} />
        </button>
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-6 flex items-center gap-3">
          <FiUser className="text-purple-400" /> Profile Settings
        </h2>

        {message && (
          <div className={`p-4 rounded-xl mb-6 text-sm ${message.includes('success') ? 'bg-green-500/10 text-green-400 border border-green-500/50' : 'bg-red-500/10 text-red-400 border border-red-500/50'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Display Name</label>
            <input
              type="text"
              required
              className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Avatar</label>
            <div className="space-y-4">
              <input
                type="url"
                className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
                placeholder="Or paste an image URL (https://...)"
                value={photoURL}
                onChange={(e) => { setPhotoURL(e.target.value); setImageFile(null); }}
                disabled={!!imageFile}
              />
              <div className="flex items-center gap-4">
                <div className="text-gray-500 text-sm font-medium border-t border-white/10 flex-1"></div>
                <span className="text-gray-500 text-xs font-bold uppercase">or upload</span>
                <div className="text-gray-500 text-sm font-medium border-t border-white/10 flex-1"></div>
              </div>
              <label className="cursor-pointer w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all text-sm font-medium border-dashed">
                <FiUpload />
                {imageFile ? imageFile.name : "Choose a file from device"}
                <input
                  type="file"
                  accept=".png, .jpg, .jpeg, image/png, image/jpeg"
                  className="hidden"
                  onChange={(e) => { handleFileChange(e); setPhotoURL(''); }}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Syntax Highlighter Theme</label>
            <div className="relative">
              <select
                value={syntaxTheme}
                onChange={(e) => setSyntaxTheme(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium appearance-none cursor-pointer [&>option]:bg-gray-900"
              >
                <option className="bg-gray-900 text-white" value="vscDarkPlus">VS Code Dark+ (Default)</option>
                <option className="bg-gray-900 text-white" value="dracula">Dracula</option>
                <option className="bg-gray-900 text-white" value="materialDark">Material Dark</option>
                <option className="bg-gray-900 text-white" value="atomDark">Atom Dark</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isSaving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <FiSave size={18} />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
