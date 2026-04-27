import { useState } from 'react'
import { useStore } from '../store/useStore.jsx'
import { Plus, Camera } from 'lucide-react'

export default function PhotosScreen() {
  const { progressPhotoZones, progressPhotos, addProgressPhoto } = useStore()
  const [activeZone, setActiveZone] = useState(null)
  const [adding, setAdding] = useState(false)
  const [newUrl, setNewUrl] = useState('')
  const [newType, setNewType] = useState('after')

  function getPhotosForZone(zoneId) {
    return progressPhotos
      .filter(p => p.body_area === zoneId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  function addPhoto() {
    if (!newUrl.trim() || !activeZone) return
    addProgressPhoto({
      id: Date.now().toString(),
      type: newType,
      body_area: activeZone,
      url: newUrl.trim(),
      date: new Date().toISOString().slice(0, 10),
    })
    setNewUrl('')
    setAdding(false)
  }

  if (activeZone) {
    const zone = progressPhotoZones.find(z => z.id === activeZone)
    const photos = getPhotosForZone(activeZone)
    const before = photos.filter(p => p.type === 'before')
    const after = photos.filter(p => p.type === 'after')

    return (
      <div className="min-h-[100dvh] pb-28">
        <div className="px-4 pt-12 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => { setActiveZone(null); setAdding(false) }} className="text-white/60">
              ←
            </button>
            <h1 className="text-xl font-bold text-white">{zone?.icon} {zone?.name}</h1>
          </div>
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 bg-orange-500 text-white text-sm px-3 py-2 rounded-xl"
          >
            <Plus size={14} /> Ajouter
          </button>
        </div>

        {adding && (
          <div className="mx-4 mb-4 bg-[#1a1a1a] rounded-2xl p-4">
            <p className="text-white/60 text-sm mb-3">Nouvelle photo</p>
            <div className="flex gap-2 mb-3">
              {['before', 'after'].map(t => (
                <button
                  key={t}
                  onClick={() => setNewType(t)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${newType === t ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/60'}`}
                >
                  {t === 'before' ? 'Avant' : 'Après'}
                </button>
              ))}
            </div>
            <input
              type="url"
              placeholder="URL de la photo..."
              value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-orange-500 mb-3"
            />
            <div className="flex gap-2">
              <button onClick={addPhoto} className="flex-1 bg-orange-500 text-white py-2 rounded-xl text-sm font-semibold">Enregistrer</button>
              <button onClick={() => setAdding(false)} className="flex-1 bg-white/10 text-white/60 py-2 rounded-xl text-sm">Annuler</button>
            </div>
          </div>
        )}

        {/* Before / After columns */}
        <div className="px-4">
          {before.length === 0 && after.length === 0 && (
            <div className="text-center py-16">
              <Camera size={40} className="text-white/20 mx-auto mb-3" />
              <p className="text-white/30 text-sm">Aucune photo encore.</p>
              <p className="text-white/20 text-xs mt-1">Ajoute ta première photo pour commencer le suivi.</p>
            </div>
          )}

          {(before.length > 0 || after.length > 0) && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-2 text-center">Avant</p>
                <div className="space-y-2">
                  {before.map(p => (
                    <div key={p.id} className="rounded-xl overflow-hidden">
                      <img src={p.url} alt="avant" className="w-full object-cover" />
                      <p className="text-white/30 text-xs text-center py-1 bg-[#1a1a1a]">{p.date}</p>
                    </div>
                  ))}
                  {before.length === 0 && <div className="h-24 bg-white/5 rounded-xl flex items-center justify-center text-white/20 text-xs">Pas encore</div>}
                </div>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-2 text-center">Après</p>
                <div className="space-y-2">
                  {after.map(p => (
                    <div key={p.id} className="rounded-xl overflow-hidden">
                      <img src={p.url} alt="après" className="w-full object-cover" />
                      <p className="text-white/30 text-xs text-center py-1 bg-[#1a1a1a]">{p.date}</p>
                    </div>
                  ))}
                  {after.length === 0 && <div className="h-24 bg-white/5 rounded-xl flex items-center justify-center text-white/20 text-xs">Pas encore</div>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] pb-28">
      <div className="px-4 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-white">Photos</h1>
        <p className="text-white/40 text-sm mt-1">Avant / après par zone</p>
      </div>

      <div className="px-4 grid grid-cols-3 gap-3">
        {progressPhotoZones.map(zone => {
          const photos = getPhotosForZone(zone.id)
          const latest = photos.find(p => p.type === 'after') || photos[0]
          return (
            <button
              key={zone.id}
              onClick={() => setActiveZone(zone.id)}
              className="bg-[#1a1a1a] rounded-2xl overflow-hidden aspect-square relative"
            >
              {latest ? (
                <img src={latest.url} alt={zone.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Camera size={20} className="text-white/20" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-1.5 px-2">
                <p className="text-white text-xs font-medium truncate">{zone.name}</p>
                <p className="text-white/40 text-[10px]">{photos.length} photo{photos.length !== 1 ? 's' : ''}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
