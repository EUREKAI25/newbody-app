import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, Edit2, Save, X, Bell, BellOff } from 'lucide-react'
import { useStore } from '../store/useStore.jsx'
import { useReminders } from '../hooks/useReminders'
import { nanoid } from '../hooks/nanoid'

const ADMIN_PASSWORD = 'newbody2026'

function ExerciseForm({ exercise, muscleGroups, onSave, onCancel }) {
  const [form, setForm] = useState(exercise || {
    id: nanoid(), name: '', muscle_group_id: muscleGroups[0]?.id || '',
    type: 'renforcement', duration_min: 5, instructions: '', media_url: '', is_active: true
  })
  const f = (k) => (e) => setForm(s => ({ ...s, [k]: e.target.value }))
  return (
    <div className="bg-[#222] rounded-2xl p-4 space-y-3">
      <input placeholder="Nom de l'exercice" value={form.name} onChange={f('name')} className="input-field" />
      <select value={form.muscle_group_id} onChange={f('muscle_group_id')} className="input-field">
        {muscleGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
      </select>
      <select value={form.type} onChange={f('type')} className="input-field">
        {['renforcement','mobilité','étirement'].map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <div className="flex gap-2">
        <input type="number" placeholder="Durée (min)" value={form.duration_min} onChange={f('duration_min')} className="input-field w-1/3" />
        <input placeholder="URL visuel" value={form.media_url} onChange={f('media_url')} className="input-field flex-1" />
      </div>
      <textarea placeholder="Instructions..." value={form.instructions} onChange={f('instructions')} rows={3} className="input-field resize-none" />
      <div className="flex gap-2">
        <button onClick={() => onSave(form)} className="btn-primary flex-1 flex items-center justify-center gap-1"><Save size={14}/> Enregistrer</button>
        <button onClick={onCancel} className="btn-ghost flex items-center justify-center gap-1"><X size={14}/> Annuler</button>
      </div>
    </div>
  )
}

function BonusItemForm({ item, bonusTypes, onSave, onCancel }) {
  const [form, setForm] = useState(item || {
    id: nanoid(), bonus_type_id: bonusTypes[0]?.id || '',
    title: '', content_type: 'text', url: '', description: '', is_active: true
  })
  const f = (k) => (e) => setForm(s => ({ ...s, [k]: e.target.value }))
  return (
    <div className="bg-[#222] rounded-2xl p-4 space-y-3">
      <select value={form.bonus_type_id} onChange={f('bonus_type_id')} className="input-field">
        {bonusTypes.map(t => <option key={t.id} value={t.id}>{t.icon} {t.name}</option>)}
      </select>
      <input placeholder="Titre" value={form.title} onChange={f('title')} className="input-field" />
      <select value={form.content_type} onChange={f('content_type')} className="input-field">
        {['text','image','video'].map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <input placeholder="URL (image/vidéo)" value={form.url} onChange={f('url')} className="input-field" />
      <textarea placeholder="Description / texte EFT..." value={form.description} onChange={f('description')} rows={3} className="input-field resize-none" />
      <div className="flex gap-2">
        <button onClick={() => onSave(form)} className="btn-primary flex-1 flex items-center justify-center gap-1"><Save size={14}/> Enregistrer</button>
        <button onClick={onCancel} className="btn-ghost flex items-center justify-center gap-1"><X size={14}/> Annuler</button>
      </div>
    </div>
  )
}

export default function AdminScreen() {
  const navigate = useNavigate()
  const store = useStore()
  const { requestAndEnable, disable } = useReminders()
  const [auth, setAuth] = useState(false)
  const [pwInput, setPwInput] = useState('')
  const [section, setSection] = useState('exercises') // exercises | bonus | visuals | settings | reminders
  const [editingEx, setEditingEx] = useState(null)
  const [editingBonus, setEditingBonus] = useState(null)
  const [editingVisual, setEditingVisual] = useState(null)
  const [notifStatus, setNotifStatus] = useState('')

  if (!auth) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6">
        <h1 className="text-2xl font-bold text-white mb-2">Admin</h1>
        <p className="text-white/40 text-sm mb-8">Accès protégé</p>
        <input
          type="password"
          value={pwInput}
          onChange={e => setPwInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (pwInput === ADMIN_PASSWORD ? setAuth(true) : alert('Mot de passe incorrect'))}
          placeholder="Mot de passe..."
          className="input-field w-full mb-3 text-center"
          autoFocus
        />
        <button
          onClick={() => pwInput === ADMIN_PASSWORD ? setAuth(true) : alert('Mot de passe incorrect')}
          className="btn-primary w-full"
        >
          Entrer
        </button>
        <button onClick={() => navigate(-1)} className="mt-4 text-white/30 text-sm">Retour</button>
      </div>
    )
  }

  const sections = [
    { id: 'exercises', label: 'Exercices' },
    { id: 'bonus', label: 'Bonus' },
    { id: 'visuals', label: 'Visuels' },
    { id: 'reminders', label: 'Rappels' },
    { id: 'settings', label: 'Config' },
  ]

  return (
    <div className="min-h-[100dvh] pb-10">
      <div className="px-4 pt-12 pb-3 flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft size={18}/> <span className="text-sm">Retour</span>
        </button>
        <h1 className="text-xl font-bold text-white ml-2">Admin</h1>
      </div>

      {/* Section tabs */}
      <div className="px-4 overflow-x-auto mb-4">
        <div className="flex gap-2 pb-1" style={{ width: 'max-content' }}>
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${section === s.id ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/50'}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-3">

        {/* ===== EXERCISES ===== */}
        {section === 'exercises' && (
          <>
            <button onClick={() => setEditingEx('new')} className="btn-primary w-full flex items-center justify-center gap-2">
              <Plus size={16}/> Nouvel exercice
            </button>
            {editingEx === 'new' && (
              <ExerciseForm
                muscleGroups={store.muscleGroups}
                onSave={ex => { store.saveExercise(ex); setEditingEx(null) }}
                onCancel={() => setEditingEx(null)}
              />
            )}
            {store.exercises.map(ex => {
              const group = store.muscleGroups.find(g => g.id === ex.muscle_group_id)
              return (
                <div key={ex.id}>
                  {editingEx === ex.id ? (
                    <ExerciseForm
                      exercise={ex}
                      muscleGroups={store.muscleGroups}
                      onSave={updated => { store.saveExercise(updated); setEditingEx(null) }}
                      onCancel={() => setEditingEx(null)}
                    />
                  ) : (
                    <div className="bg-[#1a1a1a] rounded-xl px-4 py-3 flex items-center gap-3">
                      {ex.media_url
                        ? <img src={ex.media_url} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        : <div className="w-10 h-10 rounded-lg bg-orange-900/30 flex items-center justify-center text-lg flex-shrink-0">{group?.icon}</div>
                      }
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{ex.name}</p>
                        <p className="text-white/30 text-xs">{group?.name} · {ex.type} · {ex.duration_min}min</p>
                      </div>
                      <button onClick={() => setEditingEx(ex.id)} className="text-white/30 hover:text-white p-1"><Edit2 size={14}/></button>
                      <button onClick={() => store.deleteExercise(ex.id)} className="text-red-400/50 hover:text-red-400 p-1"><Trash2 size={14}/></button>
                    </div>
                  )}
                </div>
              )
            })}
          </>
        )}

        {/* ===== BONUS ===== */}
        {section === 'bonus' && (
          <>
            <button onClick={() => setEditingBonus('new')} className="btn-primary w-full flex items-center justify-center gap-2">
              <Plus size={16}/> Nouvel élément bonus
            </button>
            {editingBonus === 'new' && (
              <BonusItemForm
                bonusTypes={store.bonusTypes}
                onSave={item => { store.saveBonusItem(item); setEditingBonus(null) }}
                onCancel={() => setEditingBonus(null)}
              />
            )}
            {store.bonusItems.map(item => {
              const type = store.bonusTypes.find(t => t.id === item.bonus_type_id)
              return (
                <div key={item.id}>
                  {editingBonus === item.id ? (
                    <BonusItemForm
                      item={item}
                      bonusTypes={store.bonusTypes}
                      onSave={updated => { store.saveBonusItem(updated); setEditingBonus(null) }}
                      onCancel={() => setEditingBonus(null)}
                    />
                  ) : (
                    <div className="bg-[#1a1a1a] rounded-xl px-4 py-3 flex items-center gap-3">
                      <span className="text-xl flex-shrink-0">{type?.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{item.title}</p>
                        <p className="text-white/30 text-xs">{type?.name} · {item.content_type}</p>
                      </div>
                      <button onClick={() => setEditingBonus(item.id)} className="text-white/30 hover:text-white p-1"><Edit2 size={14}/></button>
                      <button onClick={() => store.deleteBonusItem(item.id)} className="text-red-400/50 hover:text-red-400 p-1"><Trash2 size={14}/></button>
                    </div>
                  )}
                </div>
              )
            })}
          </>
        )}

        {/* ===== VISUALS ===== */}
        {section === 'visuals' && (
          <>
            <button onClick={() => setEditingVisual('new')} className="btn-primary w-full flex items-center justify-center gap-2">
              <Plus size={16}/> Nouveau visuel
            </button>
            {editingVisual === 'new' && (
              <VisualForm
                onSave={v => { store.saveVisual(v); setEditingVisual(null) }}
                onCancel={() => setEditingVisual(null)}
              />
            )}
            <div className="grid grid-cols-3 gap-2">
              {store.visuals.map(v => (
                <div key={v.id} className="relative rounded-xl overflow-hidden aspect-square bg-[#1a1a1a]">
                  {v.url ? (
                    <img src={v.url} alt={v.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20 text-xs text-center p-2">{v.name}</div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-1.5 py-1 flex items-center justify-between">
                    <span className="text-white text-[10px] truncate">{v.name}</span>
                    <button onClick={() => store.deleteVisual(v.id)} className="text-red-400/50 hover:text-red-400 ml-1 flex-shrink-0"><Trash2 size={10}/></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ===== REMINDERS ===== */}
        {section === 'reminders' && (
          <div className="space-y-4">
            <div className="bg-[#1a1a1a] rounded-2xl p-4 space-y-3">
              <p className="text-white font-semibold">Notifications</p>
              <p className="text-white/40 text-sm">
                {store.notificationsEnabled ? '✅ Activées' : '❌ Désactivées'}
              </p>
              {!store.notificationsEnabled ? (
                <button
                  onClick={async () => {
                    const result = await requestAndEnable()
                    if (result.ok) {
                      setNotifStatus('✅ Notifications activées !')
                    } else if (result.reason === 'denied') {
                      setNotifStatus('blocked')
                    } else {
                      setNotifStatus('❌ Permission non accordée.')
                    }
                  }}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Bell size={16}/> Activer les rappels
                </button>
              ) : (
                <button onClick={() => { disable(); setNotifStatus('Désactivées.') }}
                  className="bg-white/10 text-white/60 py-3 rounded-xl w-full flex items-center justify-center gap-2">
                  <BellOff size={16}/> Désactiver
                </button>
              )}
              {notifStatus === 'blocked' ? (
                <div className="bg-amber-900/30 border border-amber-500/30 rounded-xl p-3 mt-1">
                  <p className="text-amber-300 text-xs font-semibold mb-1">Notifications bloquées par le navigateur</p>
                  <p className="text-amber-200/60 text-xs leading-relaxed">
                    Pour débloquer :<br/>
                    • iPhone/iPad installé : <strong>Réglages → [NewBody] → Notifications</strong><br/>
                    • Safari : <strong>Réglages → Safari → Notifications</strong><br/>
                    • Chrome : cliquer sur 🔒 dans la barre d'adresse
                  </p>
                </div>
              ) : notifStatus ? (
                <p className="text-orange-400 text-sm">{notifStatus}</p>
              ) : null}
            </div>

            <ReminderRulesForm rules={store.reminderRules} onSave={store.setReminderRules} />
          </div>
        )}

        {/* ===== SETTINGS ===== */}
        {section === 'settings' && (
          <div className="space-y-4">
            <div className="bg-[#1a1a1a] rounded-2xl p-4">
              <p className="text-white font-semibold mb-1">Objectif</p>
              <input
                defaultValue={store.goal.title}
                onBlur={e => store.setGoal({ title: e.target.value })}
                placeholder="Titre objectif"
                className="input-field w-full mb-2"
              />
              <input
                type="date"
                defaultValue={store.goal.target_date}
                onChange={e => store.setGoal({ target_date: e.target.value })}
                className="input-field w-full mb-2"
              />
              <input
                defaultValue={store.goal.background_url}
                onBlur={e => store.setGoal({ background_url: e.target.value })}
                placeholder="URL image de fond (accueil)"
                className="input-field w-full"
              />
            </div>
            <div className="bg-red-900/20 border border-red-500/20 rounded-2xl p-4">
              <p className="text-red-400 font-semibold text-sm mb-1">Zone dangereuse</p>
              <p className="text-white/40 text-xs mb-3">Réinitialiser toutes les données (séances, photos, logs). Le contenu (exercices, bonus) sera remis au seed initial.</p>
              <button
                onClick={() => {
                  if (confirm('Supprimer TOUTES les données ? Cette action est irréversible.')) {
                    store.resetAllData()
                  }
                }}
                className="bg-red-600/50 hover:bg-red-600 text-white text-sm py-2 px-4 rounded-xl transition-colors"
              >
                Tout réinitialiser
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function VisualForm({ visual, onSave, onCancel }) {
  const [form, setForm] = useState(visual || { id: nanoid(), name: '', url: '', category: 'inspiration' })
  const f = k => e => setForm(s => ({ ...s, [k]: e.target.value }))
  return (
    <div className="bg-[#222] rounded-2xl p-4 space-y-3">
      <input placeholder="Nom" value={form.name} onChange={f('name')} className="input-field" />
      <input placeholder="URL image" value={form.url} onChange={f('url')} className="input-field" />
      <select value={form.category} onChange={f('category')} className="input-field">
        {['inspiration','objectif','energie'].map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <div className="flex gap-2">
        <button onClick={() => onSave(form)} className="btn-primary flex-1 flex items-center justify-center gap-1"><Save size={14}/> Enregistrer</button>
        <button onClick={onCancel} className="btn-ghost flex items-center justify-center gap-1"><X size={14}/> Annuler</button>
      </div>
    </div>
  )
}

function ReminderRulesForm({ rules, onSave }) {
  const [form, setForm] = useState(rules)
  const f = k => e => setForm(s => ({ ...s, [k]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }))
  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-4 space-y-3">
      <p className="text-white font-semibold">Règles des rappels</p>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-white/40 text-xs">Début</label>
          <input type="time" value={form.start_time} onChange={f('start_time')} className="input-field w-full" />
        </div>
        <div>
          <label className="text-white/40 text-xs">Fin</label>
          <input type="time" value={form.end_time} onChange={f('end_time')} className="input-field w-full" />
        </div>
        <div>
          <label className="text-white/40 text-xs">Délai min (min)</label>
          <input type="number" value={form.min_delay_min} onChange={f('min_delay_min')} className="input-field w-full" />
        </div>
        <div>
          <label className="text-white/40 text-xs">Max / jour</label>
          <input type="number" value={form.max_per_day} onChange={f('max_per_day')} className="input-field w-full" />
        </div>
      </div>
      <button onClick={() => onSave(form)} className="btn-primary w-full flex items-center justify-center gap-1">
        <Save size={14}/> Enregistrer
      </button>
    </div>
  )
}
