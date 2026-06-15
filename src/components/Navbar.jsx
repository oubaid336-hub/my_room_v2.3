import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Home, Search, User, Menu, X, PlusCircle, Shield, LogOut, Heart } from 'lucide-react'
import { supabase, isAdmin } from '../lib/supabase'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    checkUser()
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        setUserRole(session.user.user_metadata?.role || '')
      }
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user || null)
    if (session?.user) {
      setUserRole(session.user.user_metadata?.role || '')
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b-0">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary-light flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
            <Home size={18} className="text-white" />
          </div>
          MyRoom.tn
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <Link to="/" className="px-3 py-2 rounded-lg hover:bg-white/5 transition text-sm flex items-center gap-2">
            <Search size={16} /> Annonces
          </Link>

          {user && userRole === 'landlord' && (
            <Link to="/post-listing" className="px-3 py-2 rounded-lg hover:bg-white/5 transition text-sm flex items-center gap-2 text-primary-light">
              <PlusCircle size={16} /> Publier
            </Link>
          )}

          {user && (
            <Link to="/favorites" className="px-3 py-2 rounded-lg hover:bg-white/5 transition text-sm flex items-center gap-2">
              <Heart size={16} /> Favoris
            </Link>
          )}

          {user && isAdmin(user.email) && (
            <Link to="/admin" className="px-3 py-2 rounded-lg hover:bg-white/5 transition text-sm flex items-center gap-2 text-yellow-400">
              <Shield size={16} /> Admin
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2 ml-2">
              <Link to="/profile" className="px-3 py-2 rounded-lg hover:bg-white/5 transition text-sm flex items-center gap-2">
                <User size={16} /> Profil
              </Link>
              <button onClick={handleLogout} className="px-3 py-2 rounded-lg hover:bg-red-500/20 transition text-sm flex items-center gap-2 text-red-400">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary text-sm py-2 px-4">
              Connexion
            </Link>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-1">
          <Link to="/" className="block py-2" onClick={() => setMenuOpen(false)}>Annonces</Link>
          {user && userRole === 'landlord' && (
            <Link to="/post-listing" className="block py-2 text-primary-light" onClick={() => setMenuOpen(false)}>Publier une annonce</Link>
          )}
          {user && (
            <Link to="/favorites" className="block py-2" onClick={() => setMenuOpen(false)}>Mes favoris</Link>
          )}
          {user && (
            <Link to="/profile" className="block py-2" onClick={() => setMenuOpen(false)}>Mon profil</Link>
          )}
          {user && isAdmin(user.email) && (
            <Link to="/admin" className="block py-2 text-yellow-400" onClick={() => setMenuOpen(false)}>Admin</Link>
          )}
          {user ? (
            <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="block py-2 text-red-400">Déconnexion</button>
          ) : (
            <Link to="/login" className="block py-2 text-primary-light" onClick={() => setMenuOpen(false)}>Connexion</Link>
          )}
        </div>
      )}
    </nav>
  )
}
