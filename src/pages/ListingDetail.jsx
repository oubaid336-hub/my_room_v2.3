import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { MapPin, BedDouble, CheckCircle, AlertTriangle, Wifi, Wind, Car, Eye, Calendar } from 'lucide-react'
import SEO from '../components/SEO'
import WhatsAppButton from '../components/WhatsAppButton'
import { supabase } from '../lib/supabase'

export default function ListingDetail() {
  const { id } = useParams()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reportSent, setReportSent] = useState(false)

  useEffect(() => {
    fetchListing()
  }, [id])

  async function fetchListing() {
    setLoading(true)
    const { data, error } = await supabase.from('listings').select('*').eq('id', id).single()
    if (!error) {
      setListing(data)
      await supabase.rpc('increment_listing_views', { listing_uuid: id })
    }
    setLoading(false)
  }

  async function reportScam() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      alert('Connectez-vous pour signaler une arnaque')
      return
    }
    await supabase.from('scam_reports').insert({
      listing_id: id,
      reporter_id: session.user.id,
      reason: 'Annonce suspecte'
    })
    setReportSent(true)
  }

  if (loading) return <div className="pt-24 text-center text-gray-400">Chargement...</div>
  if (!listing) return <div className="pt-24 text-center text-gray-400">Annonce non trouvée</div>

  return (
    <>
      <SEO title={listing.title} description={listing.description} image={listing.photos?.[0]} />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {listing.photos?.map((photo, i) => (
              <img key={i} src={photo} alt={`${listing.title} ${i + 1}`} className="w-full aspect-video object-cover rounded-xl" />
            )) || (
              <div className="aspect-video bg-surface-light rounded-xl flex items-center justify-center">
                <BedDouble size={64} className="text-gray-600" />
              </div>
            )}
          </div>

          <div className="glass p-6 mb-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin size={18} /> {listing.city} {listing.university && `• ${listing.university}`}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary-light">{listing.price} TND</div>
                <div className="text-gray-400 text-sm">par mois</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-primary/20 text-primary-light px-3 py-1 rounded-lg text-sm">{listing.type}</span>
              {listing.furnished && <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-lg text-sm flex items-center gap-1"><CheckCircle size={14} /> Meublé</span>}
              {listing.is_verified && <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg text-sm">Vérifié</span>}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {listing.wifi && <div className="flex items-center gap-2 text-sm"><Wifi size={18} className="text-primary-light" /> WiFi</div>}
              {listing.ac && <div className="flex items-center gap-2 text-sm"><Wind size={18} className="text-primary-light" /> Climatisation</div>}
              {listing.parking && <div className="flex items-center gap-2 text-sm"><Car size={18} className="text-primary-light" /> Parking</div>}
            </div>

            <div className="mb-6">
              <h2 className="font-semibold text-lg mb-2">Description</h2>
              <p className="text-gray-400 leading-relaxed">{listing.description || 'Aucune description fournie.'}</p>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
              <span className="flex items-center gap-1"><Eye size={14} /> {listing.view_count || 0} vues</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(listing.created_at).toLocaleDateString('fr-FR')}</span>
            </div>

            <div className="border-t border-white/10 pt-6">
              <h2 className="font-semibold text-lg mb-4">Contacter le propriétaire</h2>
              <a href={`https://wa.me/${listing.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Bonjour, je suis intéressé par votre annonce : ${listing.title}`)}`} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Contacter sur WhatsApp
              </a>
            </div>
          </div>

          <div className="glass p-4 border-red-500/20">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <AlertTriangle size={18} />
              <span className="font-semibold">Signaler une arnaque</span>
            </div>
            <p className="text-gray-400 text-sm mb-3">Cette annonce vous semble suspecte ? Signalez-la pour protéger la communauté.</p>
            {reportSent ? (
              <span className="text-green-400 text-sm">✓ Signalement envoyé</span>
            ) : (
              <button onClick={reportScam} className="text-red-400 hover:text-red-300 text-sm underline">Signaler cette annonce</button>
            )}
          </div>
        </div>
      </div>

      <WhatsAppButton phone={listing.whatsapp} listingTitle={listing.title} />
    </>
  )
}
