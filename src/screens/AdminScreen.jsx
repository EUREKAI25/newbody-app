import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, Edit2, Save, X, Bell, BellOff, Upload, Play } from 'lucide-react'
import { useStore } from '../store/useStore.jsx'
import { useReminders } from '../hooks/useReminders'
import { useAudio } from '../hooks/useAudio'
import { api } from '../api/client'
import { nanoid } from '../hooks/nanoid'

const VPS = 'https://newbody.nathaliebrigitte.com'
const ADMIN_PASSWORD = 'newbody2026'

function FileUpload({ onUploaded, accept = 'image/*', label = 'Uploader une image' }) {
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState('')
  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true); setErr('')
    try {
      const { url } = await api.upload(file)
      onUploaded(VPS + url)
    } catch {
      setErr('Clé API manquante ou upload échoué')
    } finally {
      setUploading(false)
    }
  }
  return (
    <label className="flex items-center gap-2 cursor-pointer text-orange-400 text-sm">
      <Upload size={14}/>
      {uploading ? 'Envoi…' : label}
      <input type="file" accept={accept} className="hidden" onChange={handleFile}/>
      {err && <span className="text-red-400 text-xs ml-2">{err}</span>}
    </label>
  )
}

function SliderField({ label, value, onChange, min = 1, max = 5 }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-white/50 mb-1">
        <span>{label}</span><span className="text-orange-400">{value}</span>
      </div>
      <input type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-orange-500"/>
    </div>
  )
}

// ── Exercise form ────────────────────────────────────────────────────────────
function ExerciseForm({ exercise, muscleGroups, availableVideos, onSave, onCancel }) {
  const [form, setForm] = useState(exercise || {
    id: nanoid(), name: '', muscle_group_id: muscleGroups[0]?.id || '',
    type: 'renforcement', duration_min: 5, instructions: '',
    media_url: '', video_url: '', thumbnail_url: '',
    specific_muscles: '', position: '', equipment_needed: '[]',
    default_intensity: 3, default_cardio: 2, beginner_friendly: true,
    duration_default_sec: 30, is_active: true,
  })
  const f = k => e => setForm(s => ({ ...s, [k]: e.target.value }))
  const n = k => e => setForm(s => ({ ...s, [k]: Number(e.target.value) }))
  return (
    <div className="bg-[#222] rounded-2xl p-4 space-y-3">
      <input placeholder="Nom de l'exercice" value={form.name} onChange={f('name')} className="input-field"/>
      <select value={form.muscle_group_id} onChange={f('muscle_group_id')} className="input-field">
        {muscleGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
      </select>
      <div className="grid grid-cols-2 gap-2">
        <select value={form.type} onChange={f('type')} className="input-field">
          {['renforcement','mobilité','étirement'].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={form.position} onChange={f('position')} className="input-field">
          <option value="">Position</option>
          {['debout','sol','chaise','mur','mix'].map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <input placeholder="Muscles spécifiques (ex: grand fessier, ischio…)" value={form.specific_muscles} onChange={f('specific_muscles')} className="input-field"/>
      <input placeholder="Équipement (JSON, ex: []) ou vide" value={form.equipment_needed} onChange={f('equipment_needed')} className="input-field"/>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-white/30 text-xs">Durée (sec)</label>
          <input type="number" value={form.duration_default_sec} onChange={n('duration_default_sec')} className="input-field w-full"/>
        </div>
        <div>
          <label className="text-white/30 text-xs">Intensité</label>
          <input type="number" min="1" max="5" value={form.default_intensity} onChange={n('default_intensity')} className="input-field w-full"/>
        </div>
        <div>
          <label className="text-white/30 text-xs">Cardio</label>
          <input type="number" min="1" max="5" value={form.default_cardio} onChange={n('default_cardio')} className="input-field w-full"/>
        </div>
      </div>
      <label className="flex items-center gap-2 text-white/60 text-sm">
        <input type="checkbox" checked={Boolean(form.beginner_friendly)}
          onChange={e => setForm(s => ({ ...s, beginner_friendly: e.target.checked }))}
          className="accent-orange-500"/>
        Débutant friendly
      </label>
      <label className="flex items-center gap-2 text-white/60 text-sm">
        <input type="checkbox" checked={Boolean(form.is_active)}
          onChange={e => setForm(s => ({ ...s, is_active: e.target.checked }))}
          className="accent-orange-500"/>
        Actif
      </label>

      <div>
        <label className="text-white/30 text-xs">Vidéo exercice</label>
        <select value={form.video_url} onChange={f('video_url')} className="input-field w-full mt-1">
          <option value="">— aucune —</option>
          {availableVideos.map(v => (
            <option key={v.filename} value={VPS + v.url}>{v.filename}</option>
          ))}
        </select>
        <input placeholder="ou URL manuelle" value={form.video_url} onChange={f('video_url')} className="input-field w-full mt-1"/>
      </div>
      <div>
        <label className="text-white/30 text-xs">Miniature / image</label>
        <input placeholder="URL miniature" value={form.thumbnail_url || form.media_url} onChange={e => setForm(s => ({ ...s, thumbnail_url: e.target.value, media_url: e.target.value }))} className="input-field w-full mt-1"/>
        <FileUpload onUploaded={url => setForm(s => ({ ...s, media_url: url, thumbnail_url: url }))}/>
      </div>
      {(form.media_url || form.thumbnail_url) && (
        <img src={form.media_url || form.thumbnail_url} alt="" className="w-full h-24 object-cover rounded-xl"/>
      )}
      <textarea placeholder="Instructions…" value={form.instructions} onChange={f('instructions')} rows={3} className="input-field resize-none"/>
      <div className="flex gap-2">
        <button onClick={() => onSave(form)} className="btn-primary flex-1 flex items-center justify-center gap-1"><Save size={14}/> Enregistrer</button>
        <button onClick={onCancel} className="btn-ghost flex items-center justify-center gap-1"><X size={14}/> Annuler</button>
      </div>
    </div>
  )
}

// ── Bonus form ───────────────────────────────────────────────────────────────
function BonusItemForm({ item, bonusTypes, onSave, onCancel }) {
  const [form, setForm] = useState(item || { id: nanoid(), bonus_type_id: bonusTypes[0]?.id || '', title: '', content_type: 'text', url: '', description: '', is_active: true })
  const f = k => e => setForm(s => ({ ...s, [k]: e.target.value }))
  return (
    <div className="bg-[#222] rounded-2xl p-4 space-y-3">
      <select value={form.bonus_type_id} onChange={f('bonus_type_id')} className="input-field">
        {bonusTypes.map(t => <option key={t.id} value={t.id}>{t.icon} {t.name}</option>)}
      </select>
      <input placeholder="Titre" value={form.title} onChange={f('title')} className="input-field"/>
      <select value={form.content_type} onChange={f('content_type')} className="input-field">
        {['text','image','video'].map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <input placeholder="URL (image/vidéo)" value={form.url} onChange={f('url')} className="input-field"/>
      <textarea placeholder="Description / texte EFT…" value={form.description} onChange={f('description')} rows={3} className="input-field resize-none"/>
      <div className="flex gap-2">
        <button onClick={() => onSave(form)} className="btn-primary flex-1 flex items-center justify-center gap-1"><Save size={14}/> Enregistrer</button>
        <button onClick={onCancel} className="btn-ghost flex items-center justify-center gap-1"><X size={14}/> Annuler</button>
      </div>
    </div>
  )
}

// ── Visual form ──────────────────────────────────────────────────────────────
function VisualForm({ visual, onSave, onCancel }) {
  const [form, setForm] = useState(visual || { id: nanoid(), name: '', url: '', category: 'inspiration' })
  const f = k => e => setForm(s => ({ ...s, [k]: e.target.value }))
  return (
    <div className="bg-[#222] rounded-2xl p-4 space-y-3">
      <input placeholder="Nom" value={form.name} onChange={f('name')} className="input-field"/>
      <input placeholder="URL image" value={form.url} onChange={f('url')} className="input-field"/>
      <FileUpload onUploaded={url => setForm(s => ({ ...s, url }))}/>
      {form.url && <img src={form.url} alt="" className="w-full h-24 object-cover rounded-xl"/>}
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

// ── Reminder rules form ──────────────────────────────────────────────────────
function ReminderRulesForm({ rules, onSave }) {
  const [form, setForm] = useState(rules)
  const f = k => e => setForm(s => ({ ...s, [k]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }))
  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-4 space-y-3">
      <p className="text-white font-semibold">Règles des rappels</p>
      <div className="grid grid-cols-2 gap-2">
        <div><label className="text-white/40 text-xs">Début</label><input type="time" value={form.start_time} onChange={f('start_time')} className="input-field w-full"/></div>
        <div><label className="text-white/40 text-xs">Fin</label><input type="time" value={form.end_time} onChange={f('end_time')} className="input-field w-full"/></div>
        <div><label className="text-white/40 text-xs">Délai min (min)</label><input type="number" value={form.min_delay_min} onChange={f('min_delay_min')} className="input-field w-full"/></div>
        <div><label className="text-white/40 text-xs">Max / jour</label><input type="number" value={form.max_per_day} onChange={f('max_per_day')} className="input-field w-full"/></div>
      </div>
      <button onClick={() => onSave(form)} className="btn-primary w-full flex items-center justify-center gap-1"><Save size={14}/> Enregistrer</button>
    </div>
  )
}

// ── Admin principal ──────────────────────────────────────────────────────────
export default function AdminScreen() {
  const navigate = useNavigate()
  const store = useStore()
  const { requestAndEnable, disable } = useReminders()
  const { playShortBeep, playStartBeep, playEndSession } = useAudio()

  const [auth, setAuth] = useState(false)
  const [pwInput, setPwInput] = useState('')
  const [section, setSection] = useState('exercises')
  const [editingEx, setEditingEx] = useState(null)
  const [editingBonus, setEditingBonus] = useState(null)
  const [editingVisual, setEditingVisual] = useState(null)
  const [notifStatus, setNotifStatus] = useState('')
  const [availableVideos, setAvailableVideos] = useState([])

  useEffect(() => {
    if (auth) {
      api.getVideos().then(setAvailableVideos).catch(() => {})
    }
  }, [auth])

  if (!auth) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6">
        <h1 className="text-2xl font-bold text-white mb-2">Admin</h1>
        <p className="text-white/40 text-sm mb-8">Accès protégé</p>
        <input type="password" value={pwInput}
          onChange={e => setPwInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (pwInput === ADMIN_PASSWORD ? setAuth(true) : alert('Mot de passe incorrect'))}
          placeholder="Mot de passe…" className="input-field w-full mb-3 text-center" autoFocus/>
        <button onClick={() => pwInput === ADMIN_PASSWORD ? setAuth(true) : alert('Mot de passe incorrect')} className="btn-primary w-full">Entrer</button>
        <button onClick={() => navigate(-1)} className="mt-4 text-white/30 text-sm">Retour</button>
      </div>
    )
  }

  const sections = [
    { id: 'exercises', label: 'Exercices' },
    { id: 'bonus', label: 'Bonus' },
    { id: 'visuals', label: 'Visuels' },
    { id: 'equipment', label: 'Équipement' },
    { id: 'profile', label: 'Profil' },
    { id: 'adaptive', label: 'Adaptatif' },
    { id: 'programs', label: 'Programmes' },
    { id: 'sounds', label: 'Sons' },
    { id: 'reminders', label: 'Rappels' },
    { id: 'settings', label: 'Config' },
  ]

  return (
    <div className="min-h-[100dvh] pb-10">
      <div className="px-4 pt-12 pb-3 flex items-center gap-3">
        <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors">
          <ArrowLeft size={18}/> <span className="text-sm">Retour</span>
        </button>
        <h1 className="text-xl font-bold text-white ml-2">Admin</h1>
      </div>

      <div className="px-4 overflow-x-auto mb-4">
        <div className="flex gap-2 pb-1" style={{ width: 'max-content' }}>
          {sections.map(s => (
            <button key={s.id} onClick={() => setSection(s.id)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${section === s.id ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/50'}`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-3">

        {/* ===== EXERCISES ===== */}
        {section === 'exercises' && (
          <>
            <button onClick={() => setEditingEx('new')} className="btn-primary w-full flex items-center justify-center gap-2"><Plus size={16}/> Nouvel exercice</button>
            {editingEx === 'new' && (
              <ExerciseForm muscleGroups={store.muscleGroups} availableVideos={availableVideos}
                onSave={ex => { store.saveExercise(ex); setEditingEx(null) }}
                onCancel={() => setEditingEx(null)}/>
            )}
            {store.exercises.map(ex => {
              const group = store.muscleGroups.find(g => g.id === ex.muscle_group_id)
              return (
                <div key={ex.id}>
                  {editingEx === ex.id ? (
                    <ExerciseForm exercise={ex} muscleGroups={store.muscleGroups} availableVideos={availableVideos}
                      onSave={updated => { store.saveExercise(updated); setEditingEx(null) }}
                      onCancel={() => setEditingEx(null)}/>
                  ) : (
                    <div className={`bg-[#1a1a1a] rounded-xl px-4 py-3 flex items-center gap-3 ${!ex.is_active ? 'opacity-40' : ''}`}>
                      <div className="w-10 h-10 rounded-lg bg-orange-900/30 flex items-center justify-center text-lg flex-shrink-0 overflow-hidden">
                        {ex.video_url
                          ? <video src={ex.video_url.startsWith('http') ? ex.video_url : VPS + ex.video_url} className="w-full h-full object-cover" muted playsInline/>
                          : ex.media_url
                            ? <img src={ex.media_url} alt="" className="w-full h-full object-cover"/>
                            : group?.icon
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{ex.name}</p>
                        <p className="text-white/30 text-xs">{group?.name} · {ex.type} · cardio {ex.default_cardio ?? 2}/5</p>
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
            <button onClick={() => setEditingBonus('new')} className="btn-primary w-full flex items-center justify-center gap-2"><Plus size={16}/> Nouvel élément bonus</button>
            {editingBonus === 'new' && (
              <BonusItemForm bonusTypes={store.bonusTypes}
                onSave={item => { store.saveBonusItem(item); setEditingBonus(null) }}
                onCancel={() => setEditingBonus(null)}/>
            )}
            {store.bonusItems.map(item => {
              const type = store.bonusTypes.find(t => t.id === item.bonus_type_id)
              return (
                <div key={item.id}>
                  {editingBonus === item.id ? (
                    <BonusItemForm item={item} bonusTypes={store.bonusTypes}
                      onSave={updated => { store.saveBonusItem(updated); setEditingBonus(null) }}
                      onCancel={() => setEditingBonus(null)}/>
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
            <button onClick={() => setEditingVisual('new')} className="btn-primary w-full flex items-center justify-center gap-2"><Plus size={16}/> Nouveau visuel</button>
            {editingVisual === 'new' && (
              <VisualForm onSave={v => { store.saveVisual(v); setEditingVisual(null) }} onCancel={() => setEditingVisual(null)}/>
            )}
            <div className="grid grid-cols-3 gap-2">
              {store.visuals.map(v => (
                <div key={v.id} className="relative rounded-xl overflow-hidden aspect-square bg-[#1a1a1a]">
                  {v.url ? <img src={v.url} alt={v.name} className="w-full h-full object-cover"/> : (
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

        {/* ===== EQUIPMENT ===== */}
        {section === 'equipment' && <EquipmentSection store={store}/>}

        {/* ===== PROFIL ===== */}
        {section === 'profile' && <ProfileSection store={store}/>}

        {/* ===== ADAPTATIF ===== */}
        {section === 'adaptive' && <AdaptiveSection store={store}/>}

        {/* ===== PROGRAMMES ===== */}
        {section === 'programs' && <ProgramsSection store={store}/>}

        {/* ===== SONS ===== */}
        {section === 'sounds' && <SoundsSection playShortBeep={playShortBeep} playStartBeep={playStartBeep} playEndSession={playEndSession}/>}

        {/* ===== RAPPELS ===== */}
        {section === 'reminders' && (
          <div className="space-y-4">
            <div className="bg-[#1a1a1a] rounded-2xl p-4 space-y-3">
              <p className="text-white font-semibold">Notifications</p>
              <p className="text-white/40 text-sm">{store.notificationsEnabled ? '✅ Activées' : '❌ Désactivées'}</p>
              {!store.notificationsEnabled ? (
                <button onClick={async () => {
                  const result = await requestAndEnable()
                  setNotifStatus(result.ok ? '✅ Activées !' : result.reason === 'denied' ? 'blocked' : '❌ Permission non accordée.')
                }} className="btn-primary w-full flex items-center justify-center gap-2">
                  <Bell size={16}/> Activer les rappels
                </button>
              ) : (
                <button onClick={() => { disable(); setNotifStatus('Désactivées.') }} className="bg-white/10 text-white/60 py-3 rounded-xl w-full flex items-center justify-center gap-2">
                  <BellOff size={16}/> Désactiver
                </button>
              )}
              {notifStatus === 'blocked' ? (
                <div className="bg-amber-900/30 border border-amber-500/30 rounded-xl p-3">
                  <p className="text-amber-300 text-xs font-semibold mb-1">Notifications bloquées par le navigateur</p>
                  <p className="text-amber-200/60 text-xs leading-relaxed">
                    iPhone : Réglages → [NewBody] → Notifications<br/>
                    Safari : Réglages → Safari → Notifications<br/>
                    Chrome : cliquer sur 🔒 dans la barre d'adresse
                  </p>
                </div>
              ) : notifStatus ? <p className="text-orange-400 text-sm">{notifStatus}</p> : null}
            </div>
            <ReminderRulesForm rules={store.reminderRules} onSave={store.setReminderRules}/>
          </div>
        )}

        {/* ===== SETTINGS ===== */}
        {section === 'settings' && (
          <div className="space-y-4">
            <div className="bg-[#1a1a1a] rounded-2xl p-4">
              <p className="text-white font-semibold mb-3">Objectif</p>
              <input defaultValue={store.goal.title} onBlur={e => store.setGoal({ title: e.target.value })} placeholder="Titre objectif" className="input-field w-full mb-2"/>
              <input type="date" defaultValue={store.goal.target_date} onChange={e => store.setGoal({ target_date: e.target.value })} className="input-field w-full mb-2"/>
              <input defaultValue={store.goal.background_url} onBlur={e => store.setGoal({ background_url: e.target.value })} placeholder="URL image de fond (accueil)" className="input-field w-full"/>
            </div>
            <div className="bg-red-900/20 border border-red-500/20 rounded-2xl p-4">
              <p className="text-red-400 font-semibold text-sm mb-1">Zone dangereuse</p>
              <p className="text-white/40 text-xs mb-3">Réinitialiser toutes les données.</p>
              <button onClick={() => { if (confirm('Supprimer TOUTES les données ?')) store.resetAllData() }}
                className="bg-red-600/50 hover:bg-red-600 text-white text-sm py-2 px-4 rounded-xl transition-colors">
                Tout réinitialiser
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Section Équipement ───────────────────────────────────────────────────────
function EquipmentSection({ store }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('autre')

  return (
    <div className="space-y-3">
      <div className="bg-[#1a1a1a] rounded-2xl p-4 space-y-3">
        <p className="text-white font-semibold">Ajouter équipement</p>
        <div className="flex gap-2">
          <input placeholder="Nom" value={name} onChange={e => setName(e.target.value)} className="input-field flex-1"/>
          <select value={type} onChange={e => setType(e.target.value)} className="input-field w-32">
            {['none','chaise','elastique','haltere','step','corde','tapis','autre'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <button onClick={() => { if (name) { store.saveEquipment({ id: nanoid(), name, type }); setName('') } }} className="btn-primary w-full">
          <Plus size={14} className="inline mr-1"/> Ajouter
        </button>
      </div>
      {store.equipment.map(eq => (
        <div key={eq.id} className="bg-[#1a1a1a] rounded-xl px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-white text-sm">{eq.name}</p>
            <p className="text-white/30 text-xs">{eq.type}</p>
          </div>
          <button onClick={() => store.deleteEquipment(eq.id)} className="text-red-400/50 hover:text-red-400 p-1"><Trash2 size={14}/></button>
        </div>
      ))}
    </div>
  )
}

// ── Section Profil ───────────────────────────────────────────────────────────
function ProfileSection({ store }) {
  const [form, setForm] = useState(store.trainingProfile)
  const n = k => v => setForm(s => ({ ...s, [k]: v }))

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-4 space-y-4">
      <p className="text-white font-semibold">Profil d'entraînement</p>
      <SliderField label="Niveau estimé (1=débutante, 5=sportive)" value={form.level_estimate || 1} onChange={n('level_estimate')} min={1} max={5}/>
      <SliderField label="Intensité max autorisée" value={form.max_intensity_allowed || 3} onChange={n('max_intensity_allowed')} min={1} max={5}/>
      <SliderField label="Cardio max autorisé" value={form.max_cardio_allowed || 2} onChange={n('max_cardio_allowed')} min={1} max={5}/>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-white/40 text-xs">Durée travail (sec)</label>
          <input type="number" value={form.work_sec_base || 25} onChange={e => setForm(s => ({ ...s, work_sec_base: Number(e.target.value) }))} className="input-field w-full"/>
        </div>
        <div>
          <label className="text-white/40 text-xs">Durée repos (sec)</label>
          <input type="number" value={form.rest_sec_base || 35} onChange={e => setForm(s => ({ ...s, rest_sec_base: Number(e.target.value) }))} className="input-field w-full"/>
        </div>
      </div>
      <label className="flex items-center gap-2 text-white/60 text-sm">
        <input type="checkbox" checked={Boolean(form.recovery_mode)}
          onChange={e => setForm(s => ({ ...s, recovery_mode: e.target.checked }))}
          className="accent-orange-500"/>
        Mode récupération (séances très douces)
      </label>
      <button onClick={() => store.saveTrainingProfile(form)} className="btn-primary w-full flex items-center justify-center gap-1">
        <Save size={14}/> Enregistrer profil
      </button>
    </div>
  )
}

// ── Section Adaptatif ────────────────────────────────────────────────────────
function AdaptiveSection({ store }) {
  const [form, setForm] = useState(store.adaptiveConfig)
  const n = k => e => setForm(s => ({ ...s, [k]: Number(e.target.value) }))

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-4 space-y-3">
      <p className="text-white font-semibold">Moteur adaptatif</p>
      <p className="text-white/30 text-xs">Ces valeurs pilotent l'ajustement automatique des séances.</p>
      <div className="grid grid-cols-2 gap-2">
        {[
          { k: 'min_work_sec', label: 'Travail min (sec)' },
          { k: 'max_work_sec', label: 'Travail max (sec)' },
          { k: 'min_rest_sec', label: 'Repos min (sec)' },
          { k: 'max_rest_sec', label: 'Repos max (sec)' },
          { k: 'max_cardio_allowed', label: 'Cardio max global' },
        ].map(({ k, label }) => (
          <div key={k}>
            <label className="text-white/40 text-xs">{label}</label>
            <input type="number" value={form[k] || 0} onChange={n(k)} className="input-field w-full"/>
          </div>
        ))}
        <div>
          <label className="text-white/40 text-xs">Ajust. travail (%)</label>
          <input type="number" step="0.01" value={form.adjust_step_percent || 0.1} onChange={e => setForm(s => ({ ...s, adjust_step_percent: Number(e.target.value) }))} className="input-field w-full"/>
        </div>
        <div>
          <label className="text-white/40 text-xs">Ajust. repos (%)</label>
          <input type="number" step="0.01" value={form.rest_adjust_percent || 0.15} onChange={e => setForm(s => ({ ...s, rest_adjust_percent: Number(e.target.value) }))} className="input-field w-full"/>
        </div>
      </div>
      <button onClick={() => store.saveAdaptiveConfig(form)} className="btn-primary w-full flex items-center justify-center gap-1">
        <Save size={14}/> Enregistrer
      </button>
    </div>
  )
}

// ── Section Programmes ───────────────────────────────────────────────────────
function ProgramsSection({ store }) {
  const [editing, setEditing] = useState(null)

  const PROGRAMS_DEFAULT = [
    { id: nanoid(), name: '1 semaine souplesse', duration_min: 7, focus: 'mobilité', level: 1, weights: '{"mobilite":50,"etirements":50}', is_active: false },
    { id: nanoid(), name: '1 semaine reprise douce', duration_min: 7, focus: 'global', level: 1, weights: '{"fessiers":25,"ventre":25,"mobilite":25,"etirements":25}', is_active: false },
    { id: nanoid(), name: '1 mois plage à Rome', duration_min: 30, focus: 'bas du corps + ventre', level: 2, weights: '{"fessiers":30,"cuisses":25,"ventre":25,"bras":10,"mobilite":10}', is_active: false },
    { id: nanoid(), name: '1 mois bas du corps', duration_min: 30, focus: 'fessiers + cuisses', level: 2, weights: '{"fessiers":40,"cuisses":35,"ischios":15,"hanches":10}', is_active: false },
    { id: nanoid(), name: '1 mois tonicité globale', duration_min: 30, focus: 'corps entier', level: 3, weights: '{"fessiers":20,"cuisses":20,"ventre":20,"bras":20,"dos":20}', is_active: false },
  ]

  return (
    <div className="space-y-3">
      {store.workoutPrograms.length === 0 && (
        <div className="bg-[#1a1a1a] rounded-2xl p-4">
          <p className="text-white/40 text-sm mb-3">Aucun programme. Initialiser avec les programmes par défaut :</p>
          <button onClick={() => PROGRAMS_DEFAULT.forEach(p => store.saveWorkoutProgram(p))}
            className="btn-primary w-full">Initialiser programmes par défaut</button>
        </div>
      )}
      {store.workoutPrograms.map(p => (
        <div key={p.id} className="bg-[#1a1a1a] rounded-xl p-4">
          {editing === p.id ? (
            <ProgramForm program={p} onSave={updated => { store.saveWorkoutProgram(updated); setEditing(null) }} onCancel={() => setEditing(null)}/>
          ) : (
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{p.name}</p>
                <p className="text-white/30 text-xs">{p.focus} · {p.duration_min}j · niveau {p.level}</p>
                <label className="flex items-center gap-2 text-white/50 text-xs mt-2">
                  <input type="checkbox" checked={Boolean(p.is_active)}
                    onChange={e => store.saveWorkoutProgram({ ...p, is_active: e.target.checked })}
                    className="accent-orange-500"/>
                  Actif
                </label>
              </div>
              <button onClick={() => setEditing(p.id)} className="text-white/30 hover:text-white p-1"><Edit2 size={14}/></button>
              <button onClick={() => store.deleteWorkoutProgram(p.id)} className="text-red-400/50 hover:text-red-400 p-1"><Trash2 size={14}/></button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function ProgramForm({ program, onSave, onCancel }) {
  const [form, setForm] = useState(program)
  const f = k => e => setForm(s => ({ ...s, [k]: e.target.value }))
  return (
    <div className="space-y-2">
      <input placeholder="Nom" value={form.name} onChange={f('name')} className="input-field w-full"/>
      <div className="grid grid-cols-2 gap-2">
        <input placeholder="Focus" value={form.focus} onChange={f('focus')} className="input-field"/>
        <input type="number" placeholder="Durée (jours)" value={form.duration_min} onChange={e => setForm(s => ({ ...s, duration_min: Number(e.target.value) }))} className="input-field"/>
      </div>
      <textarea placeholder='Pondérations JSON ex: {"fessiers":30,"cuisses":20}' value={form.weights} onChange={f('weights')} rows={2} className="input-field resize-none w-full text-xs"/>
      <div className="flex gap-2">
        <button onClick={() => onSave(form)} className="btn-primary flex-1 flex items-center justify-center gap-1"><Save size={14}/> Enregistrer</button>
        <button onClick={onCancel} className="btn-ghost flex items-center justify-center gap-1"><X size={14}/> Annuler</button>
      </div>
    </div>
  )
}

// ── Section Sons ─────────────────────────────────────────────────────────────
function SoundsSection({ playShortBeep, playStartBeep, playEndSession }) {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-4 space-y-4">
      <p className="text-white font-semibold">Sons de séance</p>
      <p className="text-white/30 text-xs">Les sons sont inclus dans l'application (public/sounds/).</p>
      {[
        { label: 'Bip court (décompte 5-4-3-2-1)', fn: playShortBeep, file: 'short_beep.mp3' },
        { label: 'Bip départ exercice', fn: playStartBeep, file: 'start_beep.mp3' },
        { label: 'Son fin de séance', fn: playEndSession, file: 'end_session.mp3' },
      ].map(({ label, fn, file }) => (
        <div key={file} className="flex items-center justify-between gap-3">
          <div>
            <p className="text-white text-sm">{label}</p>
            <p className="text-white/30 text-xs">{file}</p>
          </div>
          <button onClick={fn} className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white/70 px-3 py-2 rounded-xl text-sm transition-colors">
            <Play size={14}/> Tester
          </button>
        </div>
      ))}
    </div>
  )
}
