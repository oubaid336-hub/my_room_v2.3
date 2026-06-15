import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import SEO from '../components/SEO'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!email.trim()) {
      setError('Veuillez entrer votre email.')
      setLoading(false)
      return
    }
    if (!password.trim()) {
      setError('Veuillez entrer votre mot de passe.')
      setLoading(false)
      return
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        setError('Email ou mot de passe incorrect. Vérifiez vos informations.')
      } else if (error.message.includes('Email not confirmed')) {
        setError('Email non confirmé. Vérifiez votre boîte mail.')
      } else if (error.message.includes('rate limit')) {
        setError('Trop de tentatives. Attendez quelques minutes.')
      } else {
        setError('Erreur : ' + error.message)
      }
      setLoading(false)
    } else if (data.user) {
      setSuccess('Connexion réussie ! Redirection...')
      setTimeout(() => {
        window.location.href = '/'
      }, 1500)
    }
  }

  return (
    <>
      <SEO title="Connexion" description="Connecte-toi à ton compte MyRoom.tn" />

      <div className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
            <ArrowLeft size={18} /> Retour
          </Link>

          <div className="glass p-8">
            <h1 className="text-2xl font-bold text-center mb-2">Content de vous revoir !</h1>
            <p className="text-gray-400 text-center mb-6">Entrez vos informations</p>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4 text-sm">{error}</div>
            )}
            {success && (
              <div className="bg-green-500/20 border border-green-500/50 text-green-400 p-3 rounded-lg mb-4 text-sm">{success}</div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Adresse email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-10" placeholder="ton@email.com" />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pl-10 pr-12" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Connexion...' : 'Connexion'}
              </button>
            </form>

            <div className="text-center mt-6 space-y-2">
              <Link to="/forgot-password" className="text-gray-400 hover:text-primary-light text-sm block">Mot de passe oublié ?</Link>
              <p className="text-gray-400 text-sm">
                Pas encore de compte ? <Link to="/register" className="text-primary-light hover:underline">S'inscrire</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
