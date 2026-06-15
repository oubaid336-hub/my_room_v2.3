import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, Send } from 'lucide-react'
import SEO from '../components/SEO'
import { supabase } from '../lib/supabase'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleReset(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!email.trim()) {
      setError('Veuillez entrer votre email.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess('Email envoyé ! Vérifiez votre boîte mail pour réinitialiser votre mot de passe.')
      setLoading(false)
    }
  }

  return (
    <>
      <SEO title="Mot de passe oublié" description="Réinitialisez votre mot de passe MyRoom.tn" />

      <div className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          <Link to="/login" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
            <ArrowLeft size={18} /> Retour
          </Link>

          <div className="glass p-8">
            <h1 className="text-2xl font-bold text-center mb-2">Mot de passe oublié ?</h1>
            <p className="text-gray-400 text-center mb-6">Entrez votre email pour recevoir un lien de réinitialisation.</p>

            {error && <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4 text-sm">{error}</div>}
            {success && <div className="bg-green-500/20 border border-green-500/50 text-green-400 p-3 rounded-lg mb-4 text-sm">{success}</div>}

            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Adresse email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-10" placeholder="ton@email.com" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                <Send size={18} /> {loading ? 'Envoi...' : 'Envoyer le lien'}
              </button>
            </form>

            <p className="text-center text-gray-400 text-sm mt-6">
              <Link to="/login" className="text-primary-light hover:underline">Retour à la connexion</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
