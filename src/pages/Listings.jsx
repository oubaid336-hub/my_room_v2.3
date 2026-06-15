import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, Building2 } from 'lucide-react'
import SEO from '../components/SEO'
import ListingCard from '../components/ListingCard'
import { supabase } from '../lib/supabase'

export default function Listings() {
  const [searchParams] = useSearchParams()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    type: '',
    minPrice: '',
    maxPrice: '',
    furnished: false,
  })

  useEffect(() => {
    fetchListings()
  }, [])

  async function fetchListings() {
    setLoading(true)
    let query = supabase
      .from('listings')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (filters.city) query = query.ilike('city', `%${filters.city}%`)
    if (filters.type) query = query.eq('type', filters.type)
    if (filters.minPrice) query = query.gte('price', filters.minPrice)
    if (filters.maxPrice) query = query.lte('price', filters.maxPrice)
    if (filters.furnished) query = query.eq('furnished', true)

    const { data, error } = await query
    if (!error) setListings(data || [])
    setLoading(false)
  }

  const types = ['studio', 'chambre', 'colocation', 'appartement']

  return (
    <>
      <SEO title={`Annonces ${filters.city ? `à ${filters.city}` : ''}`} description={`Trouve un logement étudiant ${filters.city ? `à ${filters.city}` : 'en Tunisie'}.`} />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Annonces {filters.city && `à ${filters.city}`}</h1>

          <div className="glass p-4 rounded-xl mb-8 space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm text-gray-400 mb-1 block">Ville</label>
                <input
                  type="text"
                  placeholder="Ex: Tunis"
                  value={filters.city}
                  onChange={(e) => setFilters({...filters, city: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Type</label>
                <select value={filters.type} onChange={(e) => setFilters({...filters, type: e.target.value})} className="input-field">
                  <option value="">Tous</option>
                  {types.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Prix min</label>
                <input type="number" placeholder="TND" value={filters.minPrice} onChange={(e) => setFilters({...filters, minPrice: e.target.value})} className="input-field w-28" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Prix max</label>
                <input type="number" placeholder="TND" value={filters.maxPrice} onChange={(e) => setFilters({...filters, maxPrice: e.target.value})} className="input-field w-28" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="furnished" checked={filters.furnished} onChange={(e) => setFilters({...filters, furnished: e.target.checked})} className="w-4 h-4 rounded accent-primary" />
              <label htmlFor="furnished" className="text-sm">Meublé uniquement</label>
            </div>
            <button onClick={fetchListings} className="btn-primary flex items-center gap-2">
              <Search size={18} /> Filtrer
            </button>
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
              <SlidersHorizontal className="mx-auto mb-4 text-gray-500" size={48} />
              <p className="text-gray-400">Aucune annonce ne correspond à vos critères.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
