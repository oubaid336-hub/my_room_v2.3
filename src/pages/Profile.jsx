import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Camera, Edit2, Save, ArrowLeft, Building2, Heart, Eye } from 'lucide-react'
import SEO from '../components/SEO'
import { supabase } from '../lib/supabase'

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [avatar, setAvatar] = useState('')
  const [myListings, setMyListings] = useState([])
  const [myFavorites, setMyFavorites] = useState([])
  const [activeTab, setActiveTab] = useState('listings')
  const [saveMsg, setSaveMsg] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      navigate('/login')
      return
    }

    setUser(session.user)
    const meta = session.user.user_metadata || {}
    setFullName(meta.full_name || '')
    setPhone(meta.phone || '')
    setAvatar(meta.avatar || '')

    const { data: listings } = await supabase
      .from('listings')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
    setMyListings(listings || [])

    const { data: favs } = await supabase
      .from('favorites')
      .select('listing_id, listings(*)')
      .eq('user_id', session.user.id)
    setMyFavorites(favs?.map(f => f.listings) || [])

    setLoading(false)
  }

  async function saveProfile() {
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName, phone: phone }
    })
    if (!error) {
      setEditing(false)
      setSaveMsg('Profil mis à jour !')
      setTimeout(() => setSaveMsg(''), 3000)
    }
  }

  async function uploadAvatar(e) {
    const file = e.target.files[0]
    if (!file) return

    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(`${user.id}/${file.name}`, file, { upsert: true })

    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(data.path)
      await supabase.auth.updateUser({ data: { avatar: publicUrl } })
      setAvatar(publicUrl)
    }
  }

  if (loading) return <div className="pt-24 text-center text-gray-400">Chargement...</div>

  return (
    <>
      <SEO title="Mon profil" description="Gérez votre profil MyRoom.tn" />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
            <ArrowLeft size={18} /> Retour
          </Link>

          {saveMsg && (
            <div className="bg-green-500/20 border border-green-500/50 text-green-400 p-3 rounded-lg mb-4 text-sm">{saveMsg}</div>
          )}

          <div className="glass p-6 mb-6">
            <div className="flex items-start gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center overflow-hidden">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={40} className="text-white" />
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-surface border border-white/20 rounded-lg flex items-center justify-center cursor-pointer hover:bg-primary transition">
                  <Camera size={14} />
                  <input type="file" accept="image/*" onChange={uploadAvatar} className="hidden" />
                </label>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-2xl font-bold">{fullName || 'Utilisateur'}</h1>
                  <button onClick={() => editing ? saveProfile() : setEditing(true)} className="btn-secondary text-sm py-2 px-3 flex items-center gap-2">
                    {editing ? <><Save size={14} /> Sauvegarder</> : <><Edit2 size={14} /> Modifier</>}
                  </button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Mail size={14} /> {user.email}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Phone size={14} />
                    {editing ? (
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field text-sm py-1 px-2 w-48" placeholder="+216 50 123 456" />
                    ) : (
                      phone || 'Non renseigné'
                    )}
                  </div>
                  {editing && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <User size={14} />
                      <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-field text-sm py-1 px-2 w-48" placeholder="Nom complet" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <button onClick={() => setActiveTab('listings')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'listings' ? 'bg-primary text-white' : 'bg-surface text-gray-400 hover:text-white'}`}>
              <Building2 size={14} className="inline mr-2" /> Mes annonces ({myListings.length})
            </button>
            <button onClick={() => setActiveTab('favorites')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'favorites' ? 'bg-primary text-white' : 'bg-surface text-gray-400 hover:text-white'}`}>
              <Heart size={14} className="inline mr-2" /> Favoris ({myFavorites.length})
            </button>
          </div>

          {activeTab === 'listings' && (
            <div className="space-y-4">
              {myListings.length > 0 ? myListings.map(listing => (
                <div key={listing.id} className="glass p-4 flex items-center gap-4">
                  <div className="w-20 h-20 bg-surface-light rounded-xl flex items-center justify-center flex-shrink-0">
                    {listing.photos?.[0] ? (
                      <img src={listing.photos[0]} alt="" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <Building2 size={24} className="text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{listing.title}</h3>
                    <p className="text-sm text-gray-400">{listing.city} • {listing.price} TND/mois</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Eye size={12} /> {listing.view_count || 0} vues</span>
                      <span>{listing.is_active ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                  <Link to={`/listing/${listing.id}`} className="text-primary-light hover:underline text-sm">Voir →</Link>
                </div>
              )) : (
                <div className="text-center py-12 text-gray-400">
                  <Building2 size={48} className="mx-auto mb-4 text-gray-600" />
                  <p>Vous n'avez pas encore d'annonces.</p>
                  <Link to="/post-listing" className="text-primary-light hover:underline mt-2 inline-block">Publier une annonce</Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="space-y-4">
              {myFavorites.length > 0 ? myFavorites.map(listing => (
                <div key={listing.id} className="glass p-4 flex items-center gap-4">
                  <div className="w-20 h-20 bg-surface-light rounded-xl flex items-center justify-center flex-shrink-0">
                    {listing.photos?.[0] ? (
                      <img src={listing.photos[0]} alt="" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <Heart size={24} className="text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{listing.title}</h3>
                    <p className="text-sm text-gray-400">{listing.city} • {listing.price} TND/mois</p>
                  </div>
                  <Link to={`/listing/${listing.id}`} className="text-primary-light hover:underline text-sm">Voir →</Link>
                </div>
              )) : (
                <div className="text-center py-12 text-gray-400">
                  <Heart size={48} className="mx-auto mb-4 text-gray-600" />
                  <p>Vous n'avez pas encore de favoris.</p>
                  <Link to="/listings" className="text-primary-light hover:underline mt-2 inline-block">Parcourir les annonces</Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
