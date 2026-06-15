import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, BedDouble, BadgeCheck, Heart } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function ListingCard({ listing, showFavorite = true }) {
  const [isFav, setIsFav] = useState(false)

  // Charge l'état favori depuis la DB au mount
  useEffect(() => {
    checkFavorite()
  }, [listing.id])

  async function checkFavorite() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('listing_id', listing.id)
      .eq('user_id', session.user.id)
      .single()

    setIsFav(!!data)
  }

  async function toggleFavorite(e) {
    e.preventDefault()
    e.stopPropagation()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    if (isFav) {
      await supabase
        .from('favorites')
        .delete()
        .eq('listing_id', listing.id)
        .eq('user_id', session.user.id)
      setIsFav(false)
    } else {
      await supabase
        .from('favorites')
        .insert({ listing_id: listing.id, user_id: session.user.id })
      setIsFav(true)
    }
  }

  return (
    <Link to={`/listing/${listing.id}`} className="block group">
      <div className="glass overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
        <div className="aspect-video bg-surface-light relative overflow-hidden">
          {listing.photos?.[0] ? (
            <img
              src={listing.photos[0]}
              alt={listing.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <BedDouble size={48} />
            </div>
          )}
          {listing.is_verified && (
            <div className="absolute top-3 left-3 bg-primary/90 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
              <BadgeCheck size={14} /> Vérifié
            </div>
          )}
          <div className="absolute bottom-3 right-3 bg-dark/90 text-white font-bold px-3 py-1 rounded-lg text-sm">
            {listing.price} TND/mois
          </div>
          {showFavorite && (
            <button
              onClick={toggleFavorite}
              className={`absolute top-3 right-3 p-2 rounded-full transition ${isFav ? 'bg-red-500 text-white' : 'bg-dark/50 text-white hover:bg-red-500/50'}`}
            >
              <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1 group-hover:text-primary-light transition">{listing.title}</h3>
          <div className="flex items-center gap-1 text-gray-400 text-sm mb-2">
            <MapPin size={14} />
            {listing.city} {listing.university && `• ${listing.university}`}
          </div>
          <div className="flex gap-2 text-xs">
            <span className="bg-primary/20 text-primary-light px-2 py-1 rounded-md">{listing.type}</span>
            {listing.furnished && <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-md">Meublé</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}
