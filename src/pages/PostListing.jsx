import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, Plus, X, MapPin, BedDouble, Wifi, Wind, Car } from 'lucide-react'
import SEO from '../components/SEO'
import { supabase } from '../lib/supabase'

export default function PostListing() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [photos, setPhotos] = useState([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    city: '',
    university: '',
    price: '',
    type: 'studio',
    furnished: false,
    wifi: false,
    ac: false,
    parking: false,
    whatsapp: '',
  })

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setError('Connectez-vous pour publier une annonce.')
      setLoading(false)
      return
    }

    if (!form.title || !form.city || !form.price || !form.whatsapp) {
      setError('Veuillez remplir tous les champs obligatoires.')
      setLoading(false)
      return
    }

    // Upload photos
    const photoUrls = []
    for (const photo of photos) {
      const { data, error } = await supabase.storage
        .from('listings')
        .upload(`${session.user.id}/${Date.now()}_${photo.name}`, photo)
      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from('listings').getPublicUrl(data.path)
        photoUrls.push(publicUrl)
      }
    }

    const { error: insertError } = await supabase.from('listings').insert({
      user_id: session.user.id,
      title: form.title,
      description: form.description,
      city: form.city,
      university: form.university,
      price: parseInt(form.price),
      type: form.type,
      furnished: form.furnished,
      wifi: form.wifi,
      ac: form.ac,
      parking: form.parking,
      whatsapp: form.whatsapp,
      photos: photoUrls,
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
    } else {
      setSuccess('Annonce publiée avec succès !')
      setTimeout(() => navigate('/profile'), 1500)
    }
  }

  function handlePhotoChange(e) {
    const files = Array.from(e.target.files)
    setPhotos(prev => [...prev, ...files].slice(0, 5))
  }

  function removePhoto(index) {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <>
      <SEO title="Publier une annonce" description="Publiez votre logement étudiant sur MyRoom.tn" />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
            <ArrowLeft size={18} /> Retour
          </Link>

          <h1 className="text-3xl font-bold mb-2">Publier une annonce</h1>
          <p className="text-gray-400 mb-8">Décrivez votre logement pour trouver un locataire rapidement.</p>

          {error && <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4 text-sm">{error}</div>}
          {success && <div className="bg-green-500/20 border border-green-500/50 text-green-400 p-3 rounded-lg mb-4 text-sm">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photos */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Photos (max 5)</label>
              <div className="flex flex-wrap gap-3">
                {photos.map((photo, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden">
                    <img src={URL.createObjectURL(photo)} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removePhoto(i)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {photos.length < 5 && (
                  <label className="w-24 h-24 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition">
                    <Upload size={20} className="text-gray-400 mb-1" />
                    <span className="text-xs text-gray-400">Ajouter</span>
                    <input type="file" accept="image/*" multiple onChange={handlePhotoChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Titre *</label>
              <input type="text" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="input-field" placeholder="Studio meublé près de l'ENIT" />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="input-field min-h-[100px]" placeholder="Décrivez votre logement..." />
            </div>

            {/* City & University */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Ville *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input type="text" value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} className="input-field pl-10" placeholder="Tunis" />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Université proche</label>
                <div className="relative">
                  <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input type="text" value={form.university} onChange={(e) => setForm({...form, university: e.target.value})} className="input-field pl-10" placeholder="ENIT" />
                </div>
              </div>
            </div>

            {/* Price & Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Prix (TND/mois) *</label>
                <input type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} className="input-field" placeholder="450" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Type</label>
                <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} className="input-field">
                  <option value="studio">Studio</option>
                  <option value="chambre">Chambre</option>
                  <option value="colocation">Colocation</option>
                  <option value="appartement">Appartement</option>
                </select>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Équipements</label>
              <div className="flex flex-wrap gap-3">
                <label className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition ${form.furnished ? 'border-primary bg-primary/20' : 'border-white/10 bg-surface'}`}>
                  <input type="checkbox" checked={form.furnished} onChange={(e) => setForm({...form, furnished: e.target.checked})} className="hidden" />
                  <BedDouble size={16} /> Meublé
                </label>
                <label className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition ${form.wifi ? 'border-primary bg-primary/20' : 'border-white/10 bg-surface'}`}>
                  <input type="checkbox" checked={form.wifi} onChange={(e) => setForm({...form, wifi: e.target.checked})} className="hidden" />
                  <Wifi size={16} /> WiFi
                </label>
                <label className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition ${form.ac ? 'border-primary bg-primary/20' : 'border-white/10 bg-surface'}`}>
                  <input type="checkbox" checked={form.ac} onChange={(e) => setForm({...form, ac: e.target.checked})} className="hidden" />
                  <Wind size={16} /> Clim
                </label>
                <label className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition ${form.parking ? 'border-primary bg-primary/20' : 'border-white/10 bg-surface'}`}>
                  <input type="checkbox" checked={form.parking} onChange={(e) => setForm({...form, parking: e.target.checked})} className="hidden" />
                  <Car size={16} /> Parking
                </label>
              </div>
            </div>

            {/* WhatsApp */}
            <div>
              <label className="text-sm text-gray-400 mb-1 block">WhatsApp *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">+216</span>
                <input type="tel" value={form.whatsapp} onChange={(e) => setForm({...form, whatsapp: e.target.value})} className="input-field pl-14" placeholder="50 123 456" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              <Plus size={18} /> {loading ? 'Publication...' : 'Publier mon annonce'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
