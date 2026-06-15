import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Shield, MessageCircle, TrendingUp, GraduationCap, Building2 } from 'lucide-react'
import SEO from '../components/SEO'
import ListingCard from '../components/ListingCard'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [listings, setListings] = useState([])
  const [searchCity, setSearchCity] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchListings()
  }, [])

  async function fetchListings() {
    setLoading(true)
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(6)

    if (!error) setListings(data || [])
    setLoading(false)
  }

  const cities = ['Tunis', 'Sfax', 'Sousse', 'Monastir', 'Gabès', 'Nabeul']

  return (
    <>
      <SEO title="Accueil" description="Trouve ton logement étudiant près de ton université en Tunisie." />

      <section className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary-light px-4 py-2 rounded-full text-sm mb-6">
            <Shield size={14} /> Annonces vérifiées
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Trouve ton <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">logement étudiant</span> en Tunisie
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Studios, chambres et colocations près de ton université. 
            Contact direct par WhatsApp, 100% gratuit.
          </p>

          <div className="max-w-xl mx-auto flex gap-2">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Quelle ville ou université ?"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <Link 
              to={`/listings?city=${searchCity}`}
              className="btn-primary flex items-center gap-2"
            >
              <Search size={20} /> Rechercher
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {cities.map(city => (
              <Link
                key={city}
                to={`/listings?city=${city}`}
                className="px-4 py-2 rounded-full bg-surface border border-white/10 hover:border-primary text-sm transition hover:bg-primary/10"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-b from-dark to-surface/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">Pourquoi MyRoom.tn ?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass p-6 text-center hover:border-primary/50 transition">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="text-primary-light" size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Annonces Vérifiées</h3>
              <p className="text-gray-400 text-sm">Chaque annonce est vérifiée pour éviter les arnaques.</p>
            </div>
            <div className="glass p-6 text-center hover:border-primary/50 transition">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="text-green-400" size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Contact WhatsApp</h3>
              <p className="text-gray-400 text-sm">Parle directement avec le propriétaire.</p>
            </div>
            <div className="glass p-6 text-center hover:border-primary/50 transition">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-yellow-400" size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">100% Gratuit</h3>
              <p className="text-gray-400 text-sm">Pour les étudiants, c'est toujours gratuit.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Dernières annonces</h2>
            <Link to="/listings" className="text-primary-light hover:underline text-sm">Voir tout →</Link>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400">Chargement...</div>
          ) : listings.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="mx-auto mb-4 text-gray-500" size={48} />
              <p className="text-gray-400">Aucune annonce pour le moment.</p>
              <p className="text-gray-500 text-sm mt-2">Soyez le premier à poster !</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center glass p-8 border-primary/20">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Tu as un logement à louer ?</h2>
          <p className="text-gray-400 mb-6">Publie ton annonce gratuitement et trouve un étudiant en quelques heures.</p>
          <Link to="/register" className="btn-primary inline-block">
            Publier une annonce
          </Link>
        </div>
      </section>
    </>
  )
}
