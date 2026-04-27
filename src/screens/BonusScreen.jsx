import { useState } from 'react'
import { useStore } from '../store/useStore.jsx'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { nanoid } from '../hooks/nanoid'

export default function BonusScreen() {
  const { bonusTypes, bonusItems, addBonusLog } = useStore()
  const [activeType, setActiveType] = useState(null)

  function logBonus(itemId) {
    addBonusLog({
      id: nanoid(),
      bonus_item_id: itemId,
      date: new Date().toISOString().slice(0, 10),
      duration_min: 5,
    })
  }

  if (activeType) {
    const type = bonusTypes.find(t => t.id === activeType)
    const items = bonusItems.filter(b => b.bonus_type_id === activeType && b.is_active)

    return (
      <div className="min-h-[100dvh] pb-28">
        <div className="px-4 pt-12 pb-4 flex items-center gap-3">
          <button onClick={() => setActiveType(null)} className="text-white/60">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">{type?.icon} {type?.name}</h1>
            <p className="text-white/40 text-xs">{type?.description}</p>
          </div>
        </div>

        <div className="px-4 space-y-3">
          {items.length === 0 && (
            <p className="text-white/30 text-sm text-center py-12">
              Aucun contenu pour l'instant.<br />
              Ajoute des éléments depuis l'admin.
            </p>
          )}
          {items.map(item => (
            <div key={item.id} className="bg-[#1a1a1a] rounded-2xl overflow-hidden">
              {item.content_type === 'image' && item.url && (
                <img src={item.url} alt={item.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <p className="text-white font-semibold">{item.title}</p>
                {item.description && (
                  <p className="text-white/50 text-sm mt-1 leading-relaxed">{item.description}</p>
                )}
                <div className="mt-3 flex gap-2">
                  {item.url && item.content_type !== 'text' && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-orange-400 text-sm"
                      onClick={() => logBonus(item.id)}
                    >
                      Voir <ExternalLink size={12} />
                    </a>
                  )}
                  {item.content_type === 'text' && (
                    <button
                      onClick={() => logBonus(item.id)}
                      className="text-orange-400/60 text-xs"
                    >
                      ✓ Fait
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] pb-28">
      <div className="px-4 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-white">Bonus</h1>
        <p className="text-white/40 text-sm mt-1">Visualisation, EFT, apprentissage, soins</p>
      </div>

      <div className="px-4 grid grid-cols-2 gap-3">
        {bonusTypes.map(type => {
          const count = bonusItems.filter(b => b.bonus_type_id === type.id && b.is_active).length
          return (
            <button
              key={type.id}
              onClick={() => setActiveType(type.id)}
              className="bg-[#1a1a1a] hover:bg-[#222] rounded-2xl p-5 text-left transition-colors aspect-square flex flex-col justify-between"
            >
              <span className="text-4xl">{type.icon}</span>
              <div>
                <p className="text-white font-semibold text-base">{type.name}</p>
                <p className="text-white/30 text-xs mt-0.5">{count} élément{count !== 1 ? 's' : ''}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
