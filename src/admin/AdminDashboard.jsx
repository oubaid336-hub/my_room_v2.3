import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Users, Building2, AlertTriangle, Eye, ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import SEO from '../components/SEO'
import { supabase, isAdmin } from '../lib/supabase'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({ users: 0, listings: 0, reports: 0, views: 0 })
  const [recentListings, setRecentListings] = useState([])
  const [recentReports, setRecentReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAdmin()
  }, [])

  async function checkAdmin() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session || !isAdmin(session.user.email)) {
      navigate('/')
      return
    }
    setUser(session.user)
    loadStats()
  }

  async function loadStats() {
    // Vrai compte d'utilisateurs uniques via leurs listings
    const { data: usersData } = await supabase
      .from('listings')
      .select('user_id')
    const uniqueUsers = new Set(usersData?.map(l => l.user_id) || []).size

    // Compte total des annonces
    const { count: listingCount } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })

    // Compte des signalements
    const { count: reportCount } = await supabase
      .from('scam_reports')
      .select('*', { count: 'exact', head: true })

    // Total des vues
    const { data: viewsData } = await supabase
      .from('listings')
      .select('view_count')
    const totalViews = viewsData?.reduce((sum, l) => sum + (l.view_count || 0), 0) || 0

    setStats({
      users: uniqueUsers,
      listings: listingCount || 0,
      reports: reportCount || 0,
      views: totalViews
    })

    // Dernières annonces
    const { data: listings } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
    setRecentListings(listings || [])

    // Derniers signalements
    const { data: reports } = await supabase
      .from('scam_reports')
      .select('*, listings(title)')
      .order('created_at', { ascending: false })
      .limit(5)
    setRecentReports(reports || [])

    setLoading(false)
  }

  async function verifyListing(id) {
    await supabase.from('listings').update({ is_verified: true }).eq('id', id)
    loadStats()
  }

  async function deleteListing(id) {
    if (!confirm('Supprimer cette annonce ?')) return
    await supabase.from('listings').update({ is_active: false }).eq('id', id)
    loadStats()
  }

  async function handleReport(reportId, status) {
    await supabase.from('scam_reports').update({ status }).eq('id', reportId)
    loadStats()
  }

  if (loading) return <div className="pt-24 text-center text-gray-400">Chargement...</div>

  return (
    <>
      <SEO title="Admin Dashboard" description="Tableau de bord administrateur MyRoom.tn" />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
            <ArrowLeft size={18} /> Retour au site
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="glass p-4 text-center">
              <Users className="mx-auto mb-2 text-primary-light" size={24} />
              <div className="text-2xl font-bold">{stats.users}</div>
              <div className="text-xs text-gray-400">Propriétaires actifs</div>
            </div>
            <div className="glass p-4 text-center">
              <Building2 className="mx-auto mb-2 text-blue-400" size={24} />
              <div className="text-2xl font-bold">{stats.listings}</div>
              <div className="text-xs text-gray-400">Annonces</div>
            </div>
            <div className="glass p-4 text-center">
              <AlertTriangle className="mx-auto mb-2 text-red-400" size={24} />
              <div className="text-2xl font-bold">{stats.reports}</div>
              <div className="text-xs text-gray-400">Signalements</div>
            </div>
            <div className="glass p-4 text-center">
              <Eye className="mx-auto mb-2 text-green-400" size={24} />
              <div className="text-2xl font-bold">{stats.views}</div>
              <div className="text-xs text-gray-400">Vues totales</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Recent Listings */}
            <div className="glass p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Building2 size={18} /> Dernières annonces
              </h2>
              <div className="space-y-3">
                {recentListings.length === 0 && (
                  <p className="text-gray-400 text-sm">Aucune annonce.</p>
                )}
                {recentListings.map(listing => (
                  <div key={listing.id} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{listing.title}</div>
                      <div className="text-xs text-gray-400">{listing.city} • {listing.price} TND</div>
                    </div>
                    <div className="flex gap-2">
                      {!listing.is_verified && (
                        <button onClick={() => verifyListing(listing.id)} className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition" title="Vérifier">
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button onClick={() => deleteListing(listing.id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition" title="Supprimer">
                        <XCircle size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Reports */}
            <div className="glass p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <AlertTriangle size={18} /> Signalements récents
              </h2>
              <div className="space-y-3">
                {recentReports.length === 0 && (
                  <p className="text-gray-400 text-sm">Aucun signalement.</p>
                )}
                {recentReports.map(report => (
                  <div key={report.id} className="p-3 bg-surface rounded-lg">
                    <div className="font-medium text-sm">{report.listings?.title || 'Annonce supprimée'}</div>
                    <div className="text-xs text-gray-400 mb-2">{report.reason}</div>
                    <div className="flex gap-2">
                      <button onClick={() => handleReport(report.id, 'confirmed_true')} className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30 transition">Confirmer arnaque</button>
                      <button onClick={() => handleReport(report.id, 'confirmed_false')} className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-xs hover:bg-green-500/30 transition">Faux signalement</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
