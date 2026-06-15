import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, GraduationCap, Building2 } from 'lucide-react'
import SEO from '../components/SEO'
import { supabase } from '../lib/supabase'

export default function Register() {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleRegister(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!email.trim()) { setError('Veuillez entrer votre email.'); setLoading(false); return }
    if (!email.includes('@')) { setError('Email invalide.'); setLoading(false); return }
    if (!password.trim()) { setError('Veuillez entrer un mot de passe.'); setLoading(false); return }
    if (password.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères.'); setLoading(false); return }

    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { role, full_name: fullName, phone } }
    })

    if (error) {
      if (error.message.includes('User already registered')) {
        setError('Cet email est déjà utilisé. Essayez de vous connecter.')
      } else if (error.message.includes('rate limit')) {
        setError('Trop de tentatives. Attendez quelques minutes.')
      } else {
        setError('Erreur : ' + error.message)
      }
      setLoading(false)
    } else if (data.user) {
      setSuccess('Compte créé ! Vérifiez votre email. Redirection...')
      setTimeout(() => { window.location.href = '/' }, 2000)
    }
  }

  return (
    <>
      <SEO title="Inscription" description="Crée ton compte MyRoom.tn gratuitement" />

      <div className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
            <ArrowLeft size={18} /> Retour
          </Link>

          <div className="glass p-8">
            {step === 1 && (
              <>
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center mx-auto mb-4">
                    <User size={24} className="text-white" />
                  </div>
                  <h1 className="text-2xl font-bold mb-2">Bienvenue sur MyRoom.tn</h1>
                  <p className="text-gray-400">Choisissez votre profil pour commencer</p>
                </div>

                <div className="space-y-4">
                  <button onClick={() => { setRole('student'); setStep(2) }} className="w-full p-4 rounded-xl bg-surface border border-white/10 hover:border-primary transition text-left flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/30 transition">
                      <GraduationCap size={24} className="text-primary-light" />
                    </div>
                    <div>
                      <div className="font-semibold text-lg">Étudiant</div>
                      <div className="text-sm text-gray-400">Trouvez votre logement idéal près de votre université</div>
                    </div>
                  </button>

                  <button onClick={() => { setRole('landlord'); setStep(2) }} className="w-full p-4 rounded-xl bg-surface border border-white/10 hover:border-primary transition text-left flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center group-hover:bg-yellow-500/30 transition">
                      <Building2 size={24} className="text-yellow-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-lg">Propriétaire</div>
                      <div className="text-sm text-gray-400">Publiez vos annonces et trouvez des locataires</div>
                    </div>
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold mb-2">Créer mon compte</h1>
                  <p className="text-gray-400">Entrez vos informations</p>
                </div>

                {error && <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4 text-sm">{error}</div>}
                {success && <div className="bg-green-500/20 border border-green-500/50 text-green-400 p-3 rounded-lg mb-4 text-sm">{success}</div>}

                <form onSubmit={(e) => { e.preventDefault(); setStep(3) }} className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Nom complet</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-field pl-10" placeholder="Ahmed Ben Ali" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Téléphone</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">+216</span>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field pl-14" placeholder="50 123 456" />
                    </div>
                  </div>

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
                      <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pl-10 pr-12" placeholder="Minimum 6 caractères" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn-primary w-full">Continuer</button>
                  <button type="button" onClick={() => setStep(1)} className="w-full text-gray-400 text-sm hover:text-white transition">← Retour</button>
                </form>
              </>
            )}

            {step === 3 && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <User size={32} className="text-white" />
                  </div>
                  <h1 className="text-2xl font-bold mb-2">Confirmez votre inscription</h1>
                  <p className="text-gray-400">Vérifiez vos informations</p>
                </div>

                <div className="bg-surface p-4 rounded-xl text-sm space-y-2 mb-6">
                  <div className="flex justify-between"><span className="text-gray-400">Type:</span> <span>{role === 'student' ? 'Étudiant' : 'Propriétaire'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Nom:</span> <span>{fullName}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Téléphone:</span> <span>+216 {phone}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Email:</span> <span>{email}</span></div>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <button type="submit" disabled={loading} className="btn-primary w-full">
                    {loading ? 'Création...' : 'Créer mon compte'}
                  </button>
                  <button type="button" onClick={() => setStep(2)} className="w-full text-gray-400 text-sm hover:text-white transition">← Modifier</button>
                </form>
              </>
            )}

            {step !== 3 && (
              <p className="text-center text-gray-400 text-sm mt-6">
                Déjà un compte ? <Link to="/login" className="text-primary-light hover:underline">Se connecter</Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
