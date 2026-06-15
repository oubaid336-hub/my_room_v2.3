import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff } from 'lucide-react'
import SEO from '../components/SEO'
import { supabase } from '../lib/supabase'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleReset(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess('Mot de passe mis à jour ! Redirection...')
      setTimeout(() => navigate('/'), 2000)
    }
  }

  return (
    <>
      <SEO title="Nouveau mot de passe" description="Réinitialisez votre mot de passe MyRoom.tn" />

      <div className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="glass p-8">
            <h1 className="text-2xl font-bold text-center mb-2">Nouveau mot de passe</h1>
            <p className="text-gray-400 text-center mb-6">Choisissez un nouveau mot de passe pour votre compte.</p>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4 text-sm">{error}</div>
            )}
            {success && (
              <div className="bg-green-500/20 border border-green-500/50 text-green-400 p-3 rounded-lg mb-4 text-sm">{success}</div>
            )}

            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Nouveau mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10 pr-12"
                    placeholder="Minimum 6 caractères"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Mise à jour...' : 'Confirmer'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
