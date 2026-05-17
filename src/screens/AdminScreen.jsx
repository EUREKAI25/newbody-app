import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, Edit2, Save, X, Bell, BellOff, Upload, Play } from 'lucide-react'
import { useStore } from '../store/useStore.jsx'
import { useReminders } from '../hooks/useReminders'
import { useAudio, getAudioConfig, saveAudioConfig } from '../hooks/useAudio'
import { api } from '../api/client'
import { nanoid } from '../hooks/nanoid'

const VPS = 'https://newbody.nathaliebrigitte.com'
const ADMIN_PASSWORD = 'zorbec'

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
        <select value={form.video_url}
          onChange={e => {
            const selected = availableVideos.find(v => VPS + v.url === e.target.value)
            setForm(s => ({
              ...s,
              video_url: e.target.value,
              ...(selected?.thumbnail_url && !s.thumbnail_url
                ? { thumbnail_url: VPS + selected.thumbnail_url, media_url: VPS + selected.thumbnail_url }
                : {}),
            }))
          }}
          className="input-field w-full mt-1">
          <option value="">— aucune —</option>
          {availableVideos.map(v => (
            <option key={v.filename} value={VPS + v.url}>
              {v.name ? cleanExName(v.name) : v.filename}
            </option>
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

  const [auth, setAuth] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem('newbody_admin_session') || '{}')
      return s.expires > Date.now()
    } catch { return false }
  })
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
          onKeyDown={e => { if (e.key === 'Enter') { if (pwInput === ADMIN_PASSWORD) { localStorage.setItem('newbody_admin_session', JSON.stringify({ expires: Date.now() + 30*24*60*60*1000 })); setAuth(true) } else alert('Mot de passe incorrect') }}}
          placeholder="Mot de passe…" className="input-field w-full mb-3 text-center" autoFocus/>
        <button onClick={() => { if (pwInput === ADMIN_PASSWORD) { localStorage.setItem('newbody_admin_session', JSON.stringify({ expires: Date.now() + 30*24*60*60*1000 })); setAuth(true) } else alert('Mot de passe incorrect') }} className="btn-primary w-full">Entrer</button>
        <button onClick={() => navigate(-1)} className="mt-4 text-white/30 text-sm">Retour</button>
      </div>
    )
  }

  const sections = [
    { id: 'import', label: '⬇ Import' },
    { id: 'classify', label: '🧠 Classifier' },
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

        {/* ===== IMPORT VIDÉOS ===== */}
        {section === 'import' && <ImportSection />}

        {/* ===== CLASSIFICATION IA ===== */}
        {section === 'classify' && <ClassifySection />}

        {/* ===== EXERCISES ===== */}
        {section === 'exercises' && (
          <ExercisesSection
            store={store}
            availableVideos={availableVideos}
            editingEx={editingEx}
            setEditingEx={setEditingEx}
          />
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

// ── Section Exercices ────────────────────────────────────────────────────────
const DIFF_COLORS_EX = { 1: 'bg-green-500', 2: 'bg-teal-400', 3: 'bg-orange-400', 4: 'bg-red-500', 5: 'bg-purple-500' }
const DIFF_LABELS    = { 1: 'débutant', 2: 'facile', 3: 'intermédiaire', 4: 'avancé', 5: 'expert' }
const GROUP_COLORS   = {
  fessiers: 'bg-pink-500/20 text-pink-300', cuisses: 'bg-orange-500/20 text-orange-300',
  ventre: 'bg-yellow-500/20 text-yellow-300', abdos_profond: 'bg-yellow-500/20 text-yellow-300',
  dos: 'bg-blue-500/20 text-blue-300', bras: 'bg-purple-500/20 text-purple-300',
  hanches: 'bg-red-500/20 text-red-300', corps_global: 'bg-teal-500/20 text-teal-300',
  mobilite: 'bg-cyan-500/20 text-cyan-300', etirements: 'bg-green-500/20 text-green-300',
  ischios: 'bg-orange-500/20 text-orange-300', quadriceps: 'bg-amber-500/20 text-amber-300',
}

function cleanExName(name) {
  if (!name) return '—'
  let s = name
  // Supprimer "X.XM views · XXK reactions | " (titres Facebook)
  s = s.replace(/^[\d.,]+[KkMmBb]?\s+views?\s*[·•]\s*[\d.,]+[KkMmBb]?\s+reactions?\s*[|｜]\s*/i, '')
  // Supprimer le préfixe FDownloader.Net + hash
  s = s.replace(/^FDownloader\.Net\s+[A-Za-z0-9_\-+=]{10,}\s*/i, '')
  return s.trim() || name
}

function ExerciseCard({ ex, group, onEdit, onDelete }) {
  const score  = ex.difficulty_score || ex.default_intensity || 2
  const dotColor = DIFF_COLORS_EX[score] || 'bg-white/20'
  const classified = ex.classification_status === 'classified'
  const hasName = !ex.name?.startsWith('FDownloader')
  const displayName = cleanExName(ex.name)

  return (
    <div className={`bg-[#1a1a1a] rounded-xl overflow-hidden flex items-stretch gap-0 ${!ex.is_active ? 'opacity-40' : ''}`}>
      {/* Vignette avec dot niveau */}
      <div className="w-14 h-14 flex-shrink-0 relative bg-black/40">
        {ex.thumbnail_url
          ? <img src={ex.thumbnail_url.startsWith('http') ? ex.thumbnail_url : 'https://newbody.nathaliebrigitte.com' + ex.thumbnail_url} alt="" className="w-full h-full object-cover"/>
          : ex.video_url
            ? <video src={ex.video_url.startsWith('http') ? ex.video_url : 'https://newbody.nathaliebrigitte.com' + ex.video_url} className="w-full h-full object-cover" muted playsInline/>
            : <div className="w-full h-full flex items-center justify-center text-2xl">{group?.icon || '🏃'}</div>
        }
        {/* Point couleur niveau — coin bas-gauche */}
        <span className={`absolute bottom-1 left-1 w-2.5 h-2.5 rounded-full border border-black/30 ${dotColor}`}/>
      </div>

      {/* Contenu */}
      <div className="flex-1 min-w-0 px-3 py-2 flex flex-col justify-center">
        <p className={`text-sm font-medium truncate ${hasName ? 'text-white' : 'text-white/50 italic'}`}>
          {hasName ? displayName : '⚠ À classifier'}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          {group
            ? <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${GROUP_COLORS[ex.muscle_group_id] || 'bg-white/10 text-white/40'}`}>{group.name}</span>
            : <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/20">non classifié</span>
          }
          <span className="text-[10px] text-white/25">{DIFF_LABELS[score]}</span>
          {classified && <span className="text-[10px] text-green-400/60">✓ IA</span>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col justify-center gap-0 pr-2">
        <button onClick={onEdit} className="text-white/30 hover:text-white p-1.5"><Edit2 size={13}/></button>
        <button onClick={onDelete} className="text-red-400/40 hover:text-red-400 p-1.5"><Trash2 size={13}/></button>
      </div>
    </div>
  )
}

function ExercisesSection({ store, availableVideos, editingEx, setEditingEx }) {
  const [classifying, setClassifying] = useState(false)
  const [classifyMsg, setClassifyMsg] = useState('')

  async function handleClassifyAll() {
    setClassifying(true)
    setClassifyMsg('Extraction vignettes + analyse IA en cours…')
    try {
      // 1. Extraire vignettes ffmpeg
      await fetch('https://newbody.nathaliebrigitte.com/api/exercises/extract-thumbnails', { method: 'POST' })
      setClassifyMsg('Vignettes extraites — analyse Claude Vision…')
      // 2. Classifier tout
      await fetch('https://newbody.nathaliebrigitte.com/api/exercises/analyze-all', { method: 'POST' })
      setClassifyMsg('✓ Classification lancée en arrière-plan — recharge dans 2 min')
    } catch (e) {
      setClassifyMsg('Erreur : ' + e.message)
    } finally {
      setClassifying(false)
    }
  }

  const unclassified = store.exercises.filter(e => e.classification_status !== 'classified').length

  return (
    <div className="space-y-3">
      <button onClick={() => setEditingEx('new')} className="btn-primary w-full flex items-center justify-center gap-2">
        <Plus size={16}/> Nouvel exercice
      </button>

      {unclassified > 0 && (
        <button onClick={handleClassifyAll} disabled={classifying}
          className="w-full bg-purple-600/20 border border-purple-500/30 text-purple-300 rounded-xl px-4 py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-40">
          🧠 {classifying ? classifyMsg : `Classifier automatiquement les ${unclassified} non classifiés`}
        </button>
      )}
      {!classifying && classifyMsg && <p className="text-xs text-center text-white/40">{classifyMsg}</p>}

      {editingEx === 'new' && (
        <ExerciseForm muscleGroups={store.muscleGroups} availableVideos={availableVideos}
          onSave={ex => { store.saveExercise(ex); setEditingEx(null) }}
          onCancel={() => setEditingEx(null)}/>
      )}

      {store.exercises.map(ex => {
        const group = store.muscleGroups.find(g => g.id === ex.muscle_group_id)
        return (
          <div key={ex.id}>
            {editingEx === ex.id
              ? <ExerciseForm exercise={ex} muscleGroups={store.muscleGroups} availableVideos={availableVideos}
                  onSave={updated => { store.saveExercise(updated); setEditingEx(null) }}
                  onCancel={() => setEditingEx(null)}/>
              : <ExerciseCard ex={ex} group={group}
                  onEdit={() => setEditingEx(ex.id)}
                  onDelete={() => store.deleteExercise(ex.id)}/>
            }
          </div>
        )
      })}
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
  const [cfg, setCfg] = useState(() => getAudioConfig())
  const [saved, setSaved] = useState(false)

  function update(key, value) {
    const next = { ...cfg, [key]: value }
    setCfg(next)
    saveAudioConfig(next)
  }

  function persist() {
    saveAudioConfig(cfg)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="space-y-3">
      {/* Musique de fond */}
      <div className="bg-[#1a1a1a] rounded-2xl p-4 space-y-4">
        <p className="text-white font-semibold">Musique de fond séance</p>

        <label className="flex items-center justify-between">
          <span className="text-white/60 text-sm">Activer la musique</span>
          <input type="checkbox" checked={cfg.music_enabled}
            onChange={e => update('music_enabled', e.target.checked)}
            className="accent-orange-500 w-4 h-4"/>
        </label>

        <div>
          <label className="text-white/40 text-xs block mb-1">URL ou chemin du fichier MP3</label>
          <div className="flex gap-2">
            <input
              value={cfg.default_session_audio_url}
              onChange={e => setCfg(s => ({ ...s, default_session_audio_url: e.target.value }))}
              onBlur={() => saveAudioConfig(cfg)}
              placeholder="https://… ou /newbody-app/audio/session.mp3"
              className="input-field flex-1 text-xs"
            />
          </div>
          <FileUpload
            accept="audio/*"
            label="Uploader un MP3"
            onUploaded={url => { update('default_session_audio_url', url) }}
          />
          {cfg.default_session_audio_url && (
            <p className="text-green-400/60 text-xs mt-1">✓ Fichier configuré</p>
          )}
        </div>

        <div>
          <div className="flex justify-between text-xs text-white/40 mb-1">
            <span>Volume musique</span>
            <span>{Math.round(cfg.volume_music * 100)}%</span>
          </div>
          <input type="range" min="0" max="1" step="0.05"
            value={cfg.volume_music}
            onChange={e => update('volume_music', Number(e.target.value))}
            className="w-full accent-orange-500"/>
        </div>

        {cfg.default_session_audio_url && (
          <button
            onClick={() => {
              const a = new Audio(cfg.default_session_audio_url)
              a.volume = cfg.volume_music
              a.play().then(() => setTimeout(() => a.pause(), 3000)).catch(() => alert('Lecture impossible — vérifier l\'URL'))
            }}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white/70 px-3 py-2 rounded-xl text-sm transition-colors"
          >
            <Play size={14}/> Tester 3 sec
          </button>
        )}
      </div>

      {/* Bips timer */}
      <div className="bg-[#1a1a1a] rounded-2xl p-4 space-y-4">
        <p className="text-white font-semibold">Bips timer</p>
        <p className="text-white/30 text-xs">Inclus dans l'app — public/sounds/</p>

        <div>
          <div className="flex justify-between text-xs text-white/40 mb-1">
            <span>Volume bips</span>
            <span>{Math.round(cfg.volume_beep * 100)}%</span>
          </div>
          <input type="range" min="0" max="1" step="0.05"
            value={cfg.volume_beep}
            onChange={e => update('volume_beep', Number(e.target.value))}
            className="w-full accent-orange-500"/>
        </div>

        {[
          { label: 'Bip court (T-5 → T-1)', fn: playShortBeep, file: 'short_beep.mp3' },
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

      {saved && <p className="text-green-400 text-sm text-center">✓ Config sauvegardée</p>}
    </div>
  )
}

// ── Section Classification IA ─────────────────────────────────────────────────

const DIFF_COLORS = ['', 'text-green-400', 'text-lime-400', 'text-yellow-400', 'text-orange-400', 'text-red-400']
const STATUS_LABELS = { unclassified: 'À classifier', processing: 'En cours…', classified: 'Classifié', failed: 'Échec' }
const STATUS_COLORS = { unclassified: 'bg-white/10 text-white/40', processing: 'bg-orange-500/20 text-orange-300', classified: 'bg-green-500/20 text-green-300', failed: 'bg-red-500/20 text-red-400' }

function MuscleTag({ muscle, role }) {
  const colors = { primaire: 'bg-orange-500/20 text-orange-300', secondaire: 'bg-blue-500/15 text-blue-300', stabilisateur: 'bg-white/10 text-white/40' }
  return <span className={`px-2 py-0.5 rounded-full text-xs ${colors[role] || colors.stabilisateur}`}>{muscle} <span className="opacity-60">{role[0]}</span></span>
}

function ClassifySection() {
  const [exercises, setExercises] = useState([])
  const [filter, setFilter]       = useState('todo')  // 'todo' | 'done' | 'all'
  const [expanded, setExpanded]   = useState(null)
  const [loading, setLoading]     = useState(true)
  const [analyzing, setAnalyzing] = useState(null)   // exercise id en cours
  const [uploading, setUploading] = useState(null)
  const [batchRunning, setBatch]  = useState(false)
  const [msg, setMsg]             = useState('')

  async function load() {
    setLoading(true)
    try {
      const rows = await api.getUnclassified()
      setExercises(rows)
    } catch { setExercises([]) }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const visible = exercises.filter(ex => {
    if (filter === 'todo') return ex.classification_status !== 'classified'
    if (filter === 'done') return ex.classification_status === 'classified'
    return true
  })

  async function handleUpload(exId, files) {
    if (!files.length) return
    setUploading(exId)
    try {
      await api.uploadVisuals(exId, Array.from(files))
      await load()
    } catch (e) { setMsg('Upload échoué : ' + e.message) }
    setUploading(null)
  }

  async function handleAnalyze(exId) {
    setAnalyzing(exId)
    setMsg('')
    try {
      const r = await api.analyzeExercise(exId)
      setMsg(`✓ "${r.result?.exercise_name || ''}" classifié — ${r.result?.difficulty?.label} (${r.result?.difficulty?.score}/5)`)
      await load()
      setExpanded(exId)
    } catch (e) { setMsg('Analyse échouée : ' + e.message) }
    setAnalyzing(null)
  }

  async function handleAnalyzeAll() {
    setBatch(true)
    setMsg('Batch lancé en arrière-plan…')
    try { await api.analyzeAll() } catch { }
    setBatch(false)
    setTimeout(() => { load(); setMsg('') }, 3000)
  }

  const todoCount = exercises.filter(e => e.classification_status !== 'classified').length
  const doneCount = exercises.filter(e => e.classification_status === 'classified').length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-white font-semibold">Classification IA</p>
        <button onClick={handleAnalyzeAll} disabled={batchRunning || todoCount === 0}
          className="text-xs bg-orange-500/20 text-orange-300 px-3 py-1.5 rounded-full disabled:opacity-40">
          {batchRunning ? 'En cours…' : `Tout classifier (${todoCount})`}
        </button>
      </div>

      {/* Filtres */}
      <div className="flex gap-2">
        {[['todo', `À faire (${todoCount})`], ['done', `Classifiés (${doneCount})`], ['all', 'Tous']].map(([id, label]) => (
          <button key={id} onClick={() => setFilter(id)}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${filter === id ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/50'}`}>
            {label}
          </button>
        ))}
      </div>

      {msg && <p className={`text-sm px-1 ${msg.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>{msg}</p>}

      {loading && <p className="text-white/30 text-sm text-center py-8">Chargement…</p>}

      {!loading && visible.length === 0 && (
        <p className="text-white/30 text-sm text-center py-8">
          {filter === 'todo' ? 'Tout est classifié ✓' : 'Aucun exercice'}
        </p>
      )}

      <div className="space-y-2">
        {visible.map(ex => {
          const isOpen     = expanded === ex.id
          const isAnalyzing = analyzing === ex.id
          const isUploading = uploading === ex.id
          const muscles    = ex.muscles_json     ? JSON.parse(ex.muscles_json)     : {}
          const zones      = ex.zones_json       ? JSON.parse(ex.zones_json)       : []
          const factors    = ex.difficulty_factors_json ? JSON.parse(ex.difficulty_factors_json) : []
          const status     = ex.classification_status || 'unclassified'

          return (
            <div key={ex.id} className="bg-[#1a1a1a] rounded-2xl overflow-hidden">
              {/* Header carte */}
              <button onClick={() => setExpanded(isOpen ? null : ex.id)}
                className="w-full px-4 py-3 flex items-center gap-3 text-left">
                {/* Miniature vidéo ou placeholder */}
                <div className="w-12 h-10 rounded-lg bg-white/5 flex-shrink-0 overflow-hidden flex items-center justify-center relative">
                  {ex.thumbnail_url
                    ? <img src={ex.thumbnail_url.startsWith('http') ? ex.thumbnail_url : VPS + ex.thumbnail_url} alt="" className="w-full h-full object-cover"/>
                    : ex.visual_count > 0
                      ? <span className="text-orange-400 text-xs">{ex.visual_count} img</span>
                      : <span className="text-white/20 text-xs">?</span>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{cleanExName(ex.name)}</p>
                  <p className="text-white/30 text-xs truncate">{ex.source_id || ex.source_url?.split('/').pop()}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {ex.difficulty_score && (
                    <span className={`text-sm font-bold ${DIFF_COLORS[ex.difficulty_score]}`}>{ex.difficulty_score}/5</span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[status]}`}>
                    {STATUS_LABELS[status]}
                  </span>
                </div>
              </button>

              {/* Contenu expandé */}
              {isOpen && (
                <div className="border-t border-white/5 px-4 pb-4 pt-3 space-y-4">

                  {/* Lien vidéo */}
                  {ex.video_url && (
                    <a
                      href={ex.video_url.startsWith('http') ? ex.video_url : VPS + ex.video_url}
                      target="_blank" rel="noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white px-4 py-2.5 rounded-xl text-sm transition-colors border border-white/10">
                      <Play size={14} className="text-orange-400 flex-shrink-0"/>
                      <span className="truncate">Voir la vidéo (pour screenshots)</span>
                    </a>
                  )}

                  {/* Upload visuels */}
                  <div>
                    <p className="text-white/40 text-xs mb-2">Visuels de séquence (2–4 images dans l'ordre)</p>
                    <label className={`flex items-center gap-2 cursor-pointer bg-white/5 hover:bg-white/8 rounded-xl px-4 py-3 border border-dashed border-white/10 transition-colors ${isUploading ? 'opacity-50' : ''}`}>
                      <Upload size={16} className="text-orange-400 flex-shrink-0"/>
                      <span className="text-sm text-white/50">
                        {isUploading ? 'Upload en cours…' : ex.visual_count > 0 ? `Remplacer les ${ex.visual_count} visuel(s)` : 'Choisir 2–4 images (position 1 → fin)'}
                      </span>
                      <input type="file" accept="image/*" multiple className="hidden" disabled={isUploading}
                        onChange={e => handleUpload(ex.id, e.target.files)}/>
                    </label>
                  </div>

                  {/* Bouton analyser */}
                  <button
                    onClick={() => handleAnalyze(ex.id)}
                    disabled={isAnalyzing || ex.visual_count === 0}
                    className="w-full py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2
                      disabled:opacity-40
                      bg-orange-500 hover:bg-orange-400 text-white disabled:bg-white/10 disabled:text-white/30">
                    {isAnalyzing
                      ? <><span className="animate-spin">⋯</span> Analyse en cours (10–20 sec)…</>
                      : ex.visual_count === 0
                        ? 'Uploader des visuels d\'abord'
                        : '🧠 Analyser avec Claude'
                    }
                  </button>

                  {/* Résultats classification */}
                  {status === 'classified' && (
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-white text-sm font-medium">{ex.movement_type?.replace(/_/g,' ')}</p>
                          <p className="text-white/40 text-xs">{ex.difficulty_label}
                            {ex.low_impact ? ' · low impact' : ''}
                            {ex.suitable_for_beginner ? ' · débutant ok' : ''}
                          </p>
                        </div>
                        {ex.difficulty_score && (
                          <div className="ml-auto text-right">
                            <p className={`text-2xl font-bold ${DIFF_COLORS[ex.difficulty_score]}`}>{ex.difficulty_score}<span className="text-sm text-white/30">/5</span></p>
                          </div>
                        )}
                      </div>

                      {zones.length > 0 && (
                        <div>
                          <p className="text-white/30 text-xs mb-1.5">Zones</p>
                          <div className="flex flex-wrap gap-1.5">
                            {zones.map(z => <span key={z} className="bg-white/10 text-white/60 text-xs px-2 py-0.5 rounded-full">{z}</span>)}
                          </div>
                        </div>
                      )}

                      {Object.keys(muscles).length > 0 && (
                        <div>
                          <p className="text-white/30 text-xs mb-1.5">Muscles</p>
                          <div className="flex flex-wrap gap-1.5">
                            {Object.entries(muscles).map(([m, r]) => <MuscleTag key={m} muscle={m} role={r}/>)}
                          </div>
                        </div>
                      )}

                      {factors.length > 0 && (
                        <div>
                          <p className="text-white/30 text-xs mb-1.5">Facteurs de difficulté</p>
                          <ul className="space-y-0.5">
                            {factors.map((f, i) => <li key={i} className="text-white/50 text-xs">· {f}</li>)}
                          </ul>
                        </div>
                      )}

                      <button onClick={() => { setMsg(''); handleAnalyze(ex.id) }}
                        className="text-xs text-white/30 hover:text-white/60 transition-colors">
                        Re-analyser
                      </button>
                    </div>
                  )}

                  {status === 'failed' && (
                    <p className="text-red-400 text-xs">Analyse échouée — vérifie que MODEL_EXECUTOR est disponible et re-tente.</p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Section Import vidéos ─────────────────────────────────────────────────────
const DEFAULT_VIDEOS_DIR = '/opt/newbody/data/uploads/videos'

function ImportSection() {
  const [mode, setMode]         = useState('urls')   // 'urls' | 'file' | 'db'
  const [urlsText, setUrlsText] = useState('')
  const [outputDir, setOutputDir] = useState(DEFAULT_VIDEOS_DIR)
  const [urlsFile, setUrlsFile]  = useState(null)
  const [items, setItems]        = useState([])       // { url, status, result?, error? }
  const [running, setRunning]    = useState(false)
  const [dbMsg, setDbMsg]        = useState('')

  function parseUrls(text) {
    return text.split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  }

  function statusIcon(s) {
    return s === 'pending' ? '○' : s === 'loading' ? '⋯' : s === 'ok' ? '✓' : '✗'
  }
  function statusColor(s) {
    return s === 'ok' ? 'text-green-400' : s === 'error' ? 'text-red-400' : s === 'loading' ? 'text-orange-400' : 'text-white/30'
  }

  async function runDownloads(urls) {
    setItems(urls.map(u => ({ url: u, status: 'pending' })))
    setRunning(true)
    for (let i = 0; i < urls.length; i++) {
      setItems(prev => prev.map((it, j) => j === i ? { ...it, status: 'loading' } : it))
      try {
        const r = await api.downloadUrl(urls[i], outputDir || undefined)
        setItems(prev => prev.map((it, j) => j === i ? { ...it, status: 'ok', result: r } : it))
      } catch (e) {
        setItems(prev => prev.map((it, j) => j === i ? { ...it, status: 'error', error: e.message } : it))
      }
    }
    setRunning(false)
  }

  async function handleUrlsSubmit() {
    const urls = parseUrls(urlsText)
    if (!urls.length) return
    await runDownloads(urls)
  }

  async function handleFileSubmit() {
    if (!urlsFile) return
    setRunning(true)
    setItems([{ url: urlsFile.name, status: 'loading' }])
    try {
      await api.uploadUrlsFile(urlsFile, outputDir || undefined)
      setItems([{ url: urlsFile.name, status: 'ok', result: { title: 'Batch lancé en arrière-plan' } }])
    } catch (e) {
      setItems([{ url: urlsFile.name, status: 'error', error: e.message }])
    }
    setRunning(false)
  }

  async function handleDbImport() {
    setDbMsg('Import en cours…')
    try {
      const r = await api.importFromDb()
      setDbMsg(`✓ ${r.inserted} importée(s) en DB, ${r.skipped} ignorée(s)`)
    } catch (e) {
      setDbMsg(`✗ Erreur : ${e.message}`)
    }
  }

  const ok    = items.filter(i => i.status === 'ok').length
  const err   = items.filter(i => i.status === 'error').length
  const total = items.length

  return (
    <div className="space-y-4">
      <p className="text-white font-semibold">Import de vidéos</p>

      {/* Tabs mode */}
      <div className="flex gap-2">
        {[['urls','URLs'], ['file','Fichier .txt'], ['db','→ DB']].map(([id, label]) => (
          <button key={id} onClick={() => setMode(id)}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${mode === id ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/50'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Dossier de sortie (commun aux modes URLs et fichier) */}
      {mode !== 'db' && (
        <div>
          <label className="text-white/30 text-xs block mb-1">Dossier de sortie</label>
          <input value={outputDir} onChange={e => setOutputDir(e.target.value)}
            className="input-field w-full text-xs font-mono" placeholder="/chemin/vers/dossier"/>
        </div>
      )}

      {/* Mode URLs */}
      {mode === 'urls' && (
        <div className="space-y-3">
          <label className="text-white/30 text-xs block">URLs (1 par ligne — FB, YT ou IG)</label>
          <textarea
            value={urlsText} onChange={e => setUrlsText(e.target.value)}
            rows={6} placeholder={"https://www.youtube.com/watch?v=...\nhttps://www.instagram.com/reel/...\nhttps://www.facebook.com/..."}
            className="input-field w-full resize-none text-sm font-mono"/>
          <button onClick={handleUrlsSubmit} disabled={running || !urlsText.trim()}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40">
            {running ? 'Téléchargement…' : `Télécharger ${parseUrls(urlsText).length || ''} vidéo(s)`}
          </button>
        </div>
      )}

      {/* Mode fichier .txt */}
      {mode === 'file' && (
        <div className="space-y-3">
          <label className="text-white/30 text-xs block">Fichier texte (1 URL par ligne)</label>
          <label className="flex items-center gap-2 cursor-pointer bg-white/5 rounded-xl px-4 py-3 border border-white/10">
            <Upload size={16} className="text-orange-400"/>
            <span className="text-sm text-white/60">{urlsFile ? urlsFile.name : 'Choisir un fichier .txt…'}</span>
            <input type="file" accept=".txt,text/plain" className="hidden"
              onChange={e => setUrlsFile(e.target.files?.[0] || null)}/>
          </label>
          <button onClick={handleFileSubmit} disabled={running || !urlsFile}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40">
            {running ? 'Envoi…' : 'Lancer le batch'}
          </button>
        </div>
      )}

      {/* Mode DB */}
      {mode === 'db' && (
        <div className="space-y-3">
          <p className="text-white/50 text-sm">Scanne le dossier <span className="font-mono text-orange-300 text-xs">_VIDEOS</span> et importe les fichiers non encore en base.</p>
          <button onClick={handleDbImport} className="btn-primary w-full">Importer depuis _VIDEOS</button>
          {dbMsg && <p className={`text-sm ${dbMsg.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>{dbMsg}</p>}
        </div>
      )}

      {/* Progression */}
      {items.length > 0 && (
        <div className="bg-[#1a1a1a] rounded-2xl p-4 space-y-2">
          <div className="flex justify-between text-xs text-white/40 mb-2">
            <span>Progression</span>
            <span className="text-green-400">{ok} ✓</span>
            {err > 0 && <span className="text-red-400">{err} ✗</span>}
            <span>{total} total</span>
          </div>
          <div className="space-y-1.5 max-h-60 overflow-y-auto">
            {items.map((it, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className={`text-sm font-mono flex-shrink-0 ${statusColor(it.status)}`}>{statusIcon(it.status)}</span>
                <div className="min-w-0">
                  <p className="text-white/60 text-xs truncate">{it.url}</p>
                  {it.result?.filename && <p className="text-white/30 text-xs truncate">{it.result.filename}</p>}
                  {it.error && <p className="text-red-400 text-xs">{it.error}</p>}
                </div>
              </div>
            ))}
          </div>
          {!running && ok > 0 && mode !== 'db' && (
            <button onClick={handleDbImport} className="btn-primary w-full mt-2 flex items-center justify-center gap-1 text-sm">
              Importer {ok} vidéo(s) en DB
            </button>
          )}
        </div>
      )}
    </div>
  )
}
