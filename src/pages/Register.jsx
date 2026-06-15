import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, GraduationCap, Building2 } from 'lucide-react'
import SEO from '../components/SEO'
import { supabase } from '../lib/supabase'

export default function Register() {
  const navigate = useNavigate()
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
      setTimeout(() => navigate('/'), 2000)
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
                    <div className="w-12 h-12 bg-yellow-500/20
