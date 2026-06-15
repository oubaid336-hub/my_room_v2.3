import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ArrowLeft, Building2 } from 'lucide-react'
import SEO from '../components/SEO'
import ListingCard from '../components/ListingCard'
import { supabase } from '../lib/supabase'

export default function Favorites() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFavorites()
  }, [])

  async function loadFavorites() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      window.location.href = '/login'
      return
    }

    const { data } = await supabase
      .from('favorites')
      .select('listing_id, listings(*)')
      .eq('user_id', session.user.id)

    setFavorites(data?.map(f => f.listings) || [])
    setLoading(false)
  }

  if (loading) return <div className="pt-24 text-center text-gray-400">Chargement...</div>

  return (
    <>
      <SEO title="Mes favoris" description="Vos annonces favorites sur MyRoom.tn" />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
            <ArrowLeft size={18} /> Retour
          </Link>

          <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Heart className="text-red-400" /> Mes favoris
          </h1>

          {favorites.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart size={48} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">Vous n'avez pas encore de favoris.</p>
              <Link to="/listings" className="text-primary-light hover:underline mt-2 inline-block">Parcourir les annonces</Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
