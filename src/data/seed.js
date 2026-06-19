export const MUSCLE_GROUPS = [
  { id: 'fessiers', name: 'Fessiers', icon: '🍑' },
  { id: 'cuisses', name: 'Cuisses', icon: '🦵' },
  { id: 'ventre', name: 'Ventre', icon: '💫' },
  { id: 'abdos_profond', name: 'Abdos profonds', icon: '🎯' },
  { id: 'bras', name: 'Bras', icon: '💪' },
  { id: 'dos', name: 'Dos', icon: '🔙' },
  { id: 'hanches', name: 'Hanches', icon: '⭕' },
  { id: 'ischios', name: 'Ischios', icon: '🦵' },
  { id: 'quadriceps', name: 'Quadriceps', icon: '🦵' },
  { id: 'corps_global', name: 'Corps global', icon: '✨' },
  { id: 'mobilite', name: 'Mobilité', icon: '🌀' },
  { id: 'etirements', name: 'Étirements', icon: '🧘' },
]

export const EXERCISES = [
  // FESSIERS
  { id: 'pont_de_hanches', name: 'Pont de hanches', muscle_group_id: 'fessiers', type: 'renforcement', duration_min: 5, instructions: 'Allongée sur le dos, pieds à plat, soulever les hanches en contractant les fessiers. Tenir 2 secondes en haut.', media_url: '', is_active: true },
  { id: 'hip_thrust', name: 'Hip thrust', muscle_group_id: 'fessiers', type: 'renforcement', duration_min: 5, instructions: 'Dos appuyé sur un canapé/lit, pieds au sol. Soulever les hanches vers le haut. Mouvement ample et contrôlé.', media_url: '', is_active: true },
  { id: 'squat', name: 'Squat', muscle_group_id: 'fessiers', type: 'renforcement', duration_min: 5, instructions: 'Pieds écartés largeur hanches, descendre comme si vous vous asseyez, dos droit, genoux dans l\'axe des pieds.', media_url: '', is_active: true },
  { id: 'squat_sumo', name: 'Squat sumo', muscle_group_id: 'fessiers', type: 'renforcement', duration_min: 5, instructions: 'Pieds très écartés, pointes vers l\'extérieur. Descendre lentement, genoux vers l\'extérieur.', media_url: '', is_active: true },
  { id: 'fentes_avant', name: 'Fentes avant', muscle_group_id: 'fessiers', type: 'renforcement', duration_min: 5, instructions: 'Faire un grand pas en avant, genou arrière vers le sol, dos droit. Alterner les jambes.', media_url: '', is_active: true },
  { id: 'fentes_arriere', name: 'Fentes arrière', muscle_group_id: 'fessiers', type: 'renforcement', duration_min: 5, instructions: 'Faire un grand pas en arrière, genou arrière vers le sol. Plus doux pour les genoux que les fentes avant.', media_url: '', is_active: true },
  { id: 'fentes_laterales', name: 'Fentes latérales', muscle_group_id: 'fessiers', type: 'renforcement', duration_min: 5, instructions: 'Faire un grand pas sur le côté, fléchir la jambe qui s\'écarte, l\'autre reste tendue.', media_url: '', is_active: true },
  { id: 'donkey_kicks', name: 'Donkey kicks', muscle_group_id: 'fessiers', type: 'renforcement', duration_min: 5, instructions: 'À 4 pattes, envoyer une jambe vers le haut en gardant le genou fléchi. Contracter le fessier en haut.', media_url: '', is_active: true },
  { id: 'fire_hydrant', name: 'Fire hydrant', muscle_group_id: 'fessiers', type: 'renforcement', duration_min: 5, instructions: 'À 4 pattes, ouvrir une jambe sur le côté à 90°, comme un chien qui fait pipi. Tenir 2 secondes.', media_url: '', is_active: true },
  { id: 'kickback_debout', name: 'Kickback debout', muscle_group_id: 'fessiers', type: 'renforcement', duration_min: 5, instructions: 'Debout, main sur un mur, envoyer une jambe en arrière en contractant le fessier. Dos droit.', media_url: '', is_active: true },
  { id: 'step_up', name: 'Step up', muscle_group_id: 'fessiers', type: 'renforcement', duration_min: 5, instructions: 'Monter sur une chaise ou marche solide, une jambe à la fois. Appuyer sur le talon.', media_url: '', is_active: true },
  { id: 'glute_bridge_une_jambe', name: 'Glute bridge une jambe', muscle_group_id: 'fessiers', type: 'renforcement', duration_min: 5, instructions: 'Pont de hanches sur une seule jambe, l\'autre tendue ou pliée en l\'air. Plus intensif.', media_url: '', is_active: true },

  // CUISSES
  { id: 'squat_classique', name: 'Squat classique', muscle_group_id: 'cuisses', type: 'renforcement', duration_min: 5, instructions: 'Pieds écartés largeur hanches, descendre lentement, tenir 1 seconde en bas.', media_url: '', is_active: true },
  { id: 'squat_pulse', name: 'Squat pulse', muscle_group_id: 'cuisses', type: 'renforcement', duration_min: 4, instructions: 'Rester en position squat et faire des petits mouvements de haut en bas. Brûle les cuisses !', media_url: '', is_active: true },
  { id: 'chaise_mur', name: 'Chaise au mur', muscle_group_id: 'cuisses', type: 'renforcement', duration_min: 3, instructions: 'Dos au mur, descendre jusqu\'à 90°, maintenir la position. Commencer par 20-30 secondes.', media_url: '', is_active: true },
  { id: 'fentes_marchees', name: 'Fentes marchées', muscle_group_id: 'cuisses', type: 'renforcement', duration_min: 5, instructions: 'Avancer en fentes alternées, comme marcher mais en fléchissant profondément les genoux.', media_url: '', is_active: true },
  { id: 'fentes_bulgares', name: 'Fentes bulgares', muscle_group_id: 'cuisses', type: 'renforcement', duration_min: 5, instructions: 'Pied arrière posé sur une chaise, descendre sur la jambe avant. Très efficace.', media_url: '', is_active: true },
  { id: 'leg_lift_debout', name: 'Leg lift debout', muscle_group_id: 'cuisses', type: 'renforcement', duration_min: 4, instructions: 'Debout, lever une jambe tendue sur le côté ou devant. Contrôlé et lent.', media_url: '', is_active: true },
  { id: 'squat_serre', name: 'Squat serré', muscle_group_id: 'cuisses', type: 'renforcement', duration_min: 4, instructions: 'Pieds proches l\'un de l\'autre, faire des squats. Cible l\'intérieur des cuisses.', media_url: '', is_active: true },
  { id: 'squat_large', name: 'Squat large', muscle_group_id: 'cuisses', type: 'renforcement', duration_min: 4, instructions: 'Pieds très écartés, pointes vers l\'extérieur. Cible l\'intérieur des cuisses et fessiers.', media_url: '', is_active: true },
  { id: 'extension_jambe_debout', name: 'Extension jambe debout', muscle_group_id: 'cuisses', type: 'renforcement', duration_min: 4, instructions: 'Assis sur une chaise, tendre une jambe et maintenir 2 secondes. Quadriceps.', media_url: '', is_active: true },

  // VENTRE / ABDOS
  { id: 'gainage_planche', name: 'Gainage planche', muscle_group_id: 'abdos_profond', type: 'renforcement', duration_min: 4, instructions: 'Sur les coudes ou mains tendues, corps droit comme une planche. Rentrer légèrement le ventre.', media_url: '', is_active: true },
  { id: 'gainage_genoux', name: 'Gainage sur les genoux', muscle_group_id: 'abdos_profond', type: 'renforcement', duration_min: 4, instructions: 'Version plus douce du gainage, genoux posés. Parfait pour débuter.', media_url: '', is_active: true },
  { id: 'gainage_lateral', name: 'Gainage latéral', muscle_group_id: 'abdos_profond', type: 'renforcement', duration_min: 3, instructions: 'Sur le côté, appui sur un coude, corps aligné. Soulever les hanches du sol.', media_url: '', is_active: true },
  { id: 'crunch', name: 'Crunch', muscle_group_id: 'ventre', type: 'renforcement', duration_min: 4, instructions: 'Allongée, genoux fléchis, mains derrière la tête. Soulever les épaules sans tirer sur le cou.', media_url: '', is_active: true },
  { id: 'crunch_lent', name: 'Crunch lent', muscle_group_id: 'ventre', type: 'renforcement', duration_min: 4, instructions: 'Crunch très lent, 4 secondes montée, 4 secondes descente. Plus efficace que rapide.', media_url: '', is_active: true },
  { id: 'releves_jambes', name: 'Relevés de jambes', muscle_group_id: 'abdos_profond', type: 'renforcement', duration_min: 4, instructions: 'Allongée, lever les jambes tendues jusqu\'à 90°, descendre lentement sans toucher le sol.', media_url: '', is_active: true },
  { id: 'dead_bug', name: 'Dead bug', muscle_group_id: 'abdos_profond', type: 'renforcement', duration_min: 5, instructions: 'Allongée, bras vers le plafond, genoux à 90°. Étendre un bras et la jambe opposée, en gardant le dos au sol.', media_url: '', is_active: true },
  { id: 'hollow_hold', name: 'Hollow hold', muscle_group_id: 'abdos_profond', type: 'renforcement', duration_min: 3, instructions: 'Allongée, soulever épaules et jambes du sol, corps en forme de banane. Tenir.', media_url: '', is_active: true },
  { id: 'mountain_climber', name: 'Mountain climber', muscle_group_id: 'ventre', type: 'renforcement', duration_min: 4, instructions: 'En position de pompe, ramener alternativement les genoux vers la poitrine rapidement.', media_url: '', is_active: true },
  { id: 'vacuum', name: 'Vacuum abdominal', muscle_group_id: 'abdos_profond', type: 'renforcement', duration_min: 3, instructions: 'Rentrer profondément le ventre en expirant, maintenir 10-15 secondes. Excellent pour la ceinture.', media_url: '', is_active: true },

  // BRAS
  { id: 'pompes_murales', name: 'Pompes murales', muscle_group_id: 'bras', type: 'renforcement', duration_min: 4, instructions: 'Mains contre le mur, faire des pompes. Version douce pour débuter.', media_url: '', is_active: true },
  { id: 'pompes_inclinees', name: 'Pompes inclinées', muscle_group_id: 'bras', type: 'renforcement', duration_min: 4, instructions: 'Mains sur une table ou canapé, corps en diagonale. Intermédiaire entre mural et sol.', media_url: '', is_active: true },
  { id: 'dips_chaise', name: 'Dips sur chaise', muscle_group_id: 'bras', type: 'renforcement', duration_min: 4, instructions: 'Assis au bord d\'une chaise, mains sur le bord, descendre le corps en fléchissant les coudes.', media_url: '', is_active: true },
  { id: 'curl_sans_poids', name: 'Curl sans poids', muscle_group_id: 'bras', type: 'renforcement', duration_min: 3, instructions: 'Simuler un curl biceps avec tension musculaire maximale. Lent et contrôlé.', media_url: '', is_active: true },
  { id: 'extension_triceps', name: 'Extension triceps', muscle_group_id: 'bras', type: 'renforcement', duration_min: 3, instructions: 'Bras derrière la tête, plier et tendre. Peut se faire avec une bouteille d\'eau.', media_url: '', is_active: true },
  { id: 'cercles_bras', name: 'Cercles de bras', muscle_group_id: 'bras', type: 'mobilité', duration_min: 3, instructions: 'Bras tendus sur le côté, faire des petits puis grands cercles. Chauffe les épaules.', media_url: '', is_active: true },
  { id: 'planche_bras_tendus', name: 'Planche bras tendus', muscle_group_id: 'bras', type: 'renforcement', duration_min: 3, instructions: 'Position de pompe haute, maintenir. Tout le corps travaille, bras en particulier.', media_url: '', is_active: true },

  // DOS
  { id: 'superman', name: 'Superman', muscle_group_id: 'dos', type: 'renforcement', duration_min: 4, instructions: 'À plat ventre, soulever simultanément les bras et les jambes. Tenir 2 secondes.', media_url: '', is_active: true },
  { id: 'extension_dos_sol', name: 'Extension dos au sol', muscle_group_id: 'dos', type: 'renforcement', duration_min: 4, instructions: 'À plat ventre, mains sous le front, soulever légèrement le buste. Doux et efficace.', media_url: '', is_active: true },
  { id: 'gainage_dos', name: 'Gainage dos', muscle_group_id: 'dos', type: 'renforcement', duration_min: 3, instructions: 'Sur le dos, soulever les hanches (pont) et maintenir. Renforce dos et fessiers.', media_url: '', is_active: true },
  { id: 'rowing_sans_charge', name: 'Rowing sans charge', muscle_group_id: 'dos', type: 'renforcement', duration_min: 4, instructions: 'Penché en avant légèrement, simuler un mouvement de rame en tirant les coudes en arrière.', media_url: '', is_active: true },

  // MOBILITÉ / ÉTIREMENTS
  { id: 'etirement_ischios', name: 'Étirement ischios', muscle_group_id: 'etirements', type: 'étirement', duration_min: 3, instructions: 'Debout ou assis, pencher vers l\'avant en gardant le dos droit. Sentir l\'arrière des jambes.', media_url: '', is_active: true },
  { id: 'etirement_quadriceps', name: 'Étirement quadriceps', muscle_group_id: 'etirements', type: 'étirement', duration_min: 3, instructions: 'Debout, ramener un pied vers les fesses, maintenir l\'équilibre. 30 secondes par côté.', media_url: '', is_active: true },
  { id: 'etirement_fessiers', name: 'Étirement fessiers', muscle_group_id: 'etirements', type: 'étirement', duration_min: 3, instructions: 'Allongée, ramener un genou vers l\'épaule opposée. Sentir les fessiers s\'étirer.', media_url: '', is_active: true },
  { id: 'etirement_dos', name: 'Étirement dos', muscle_group_id: 'etirements', type: 'étirement', duration_min: 3, instructions: 'En boule, dos arrondi, bras tendus devant. Respirer profondément.', media_url: '', is_active: true },
  { id: 'rotation_buste', name: 'Rotation de buste', muscle_group_id: 'mobilite', type: 'mobilité', duration_min: 3, instructions: 'Assis ou debout, tourner le buste de gauche à droite lentement. Libère les tensions.', media_url: '', is_active: true },
  { id: 'ouverture_hanches', name: 'Ouverture des hanches', muscle_group_id: 'hanches', type: 'mobilité', duration_min: 4, instructions: 'Assis en tailleur ou en pigeon yoga. Laisser les genoux descendre. Respirer.', media_url: '', is_active: true },
  { id: 'etirement_bras', name: 'Étirement bras', muscle_group_id: 'etirements', type: 'étirement', duration_min: 3, instructions: 'Ramener un bras devant la poitrine, maintenir avec l\'autre bras. 30 secondes par côté.', media_url: '', is_active: true },
  { id: 'etirement_global_debout', name: 'Étirement global debout', muscle_group_id: 'etirements', type: 'étirement', duration_min: 4, instructions: 'Bras levés, pencher sur les côtés, tour de hanches. Flow doux de haut en bas.', media_url: '', is_active: true },

  // CORPS GLOBAL
  { id: 'full_body_simple', name: 'Full body simple', muscle_group_id: 'corps_global', type: 'renforcement', duration_min: 10, instructions: 'Enchaîner : 10 squats + 10 pompes murales + 30s gainage + 10 donkey kicks chaque côté. 2 séries.', media_url: '', is_active: true },
  { id: 'flow_lent', name: 'Flow lent', muscle_group_id: 'corps_global', type: 'mobilité', duration_min: 10, instructions: 'Enchaîner les mouvements doucement : rotation buste, ouverture hanches, extension dos, étirements globaux.', media_url: '', is_active: true },
  { id: 'mobilite_fluide', name: 'Mobilité fluide', muscle_group_id: 'mobilite', type: 'mobilité', duration_min: 8, instructions: 'Séquence de mobilité articulaire : chevilles, genoux, hanches, épaules, nuque. Doux et fluide.', media_url: '', is_active: true },
  { id: 'etirements_dynamiques', name: 'Étirements dynamiques', muscle_group_id: 'corps_global', type: 'mobilité', duration_min: 7, instructions: 'Étirements avec léger balancement (pas statiques). Réveille le corps en douceur.', media_url: '', is_active: true },
]

export const BONUS_TYPES = [
  { id: 'visualisation', name: 'Visualisation', icon: '🌟', description: 'Images inspirantes, projection positive' },
  { id: 'eft', name: 'EFT', icon: '✨', description: 'Phrases de libération émotionnelle' },
  { id: 'connaissances', name: 'Connaissances', icon: '📚', description: 'Vidéos et ressources pour comprendre' },
  { id: 'mindset', name: 'Mindset', icon: '🧠', description: 'Motivation, discipline, transformation' },
  { id: 'soins', name: 'Soins', icon: '🌿', description: 'Massage, respiration, récupération' },
]

export const BONUS_ITEMS = [
  // VISUALISATION
  { id: 'galerie_images_corps', bonus_type_id: 'visualisation', title: 'Corps en mouvement', content_type: 'image', url: '', description: 'Images de corps toniques et en mouvement', is_active: true },
  { id: 'galerie_plage', bonus_type_id: 'visualisation', title: 'Plage et liberté', content_type: 'image', url: '', description: 'Visuels plage, été, liberté de mouvement', is_active: true },
  { id: 'projection_corps', bonus_type_id: 'visualisation', title: 'Projection positive', content_type: 'image', url: '', description: 'Te visualiser dans ton corps objectif', is_active: true },
  // EFT
  { id: 'eft_confiance', bonus_type_id: 'eft', title: 'Confiance dans mon corps', content_type: 'text', url: '', description: 'Même si je ne suis pas encore satisfaite de mon corps, je m\'accepte et je me fais confiance.', is_active: true },
  { id: 'eft_motivation', bonus_type_id: 'eft', title: 'Motivation et persévérance', content_type: 'text', url: '', description: 'Même si c\'est difficile aujourd\'hui, je suis capable de continuer. Chaque pas compte.', is_active: true },
  { id: 'eft_acceptation', bonus_type_id: 'eft', title: 'Acceptation du processus', content_type: 'text', url: '', description: 'Mon corps change à son rythme. Je lui fais confiance. La transformation est en marche.', is_active: true },
  // CONNAISSANCES
  { id: 'video_renforcement', bonus_type_id: 'connaissances', title: 'Comprendre le renforcement musculaire', content_type: 'video', url: '', description: 'Comment les muscles se reconstruisent après 50 ans', is_active: true },
  { id: 'video_nutrition', bonus_type_id: 'connaissances', title: 'Nutrition et muscle', content_type: 'video', url: '', description: 'Les protéines, hydratation, et récupération', is_active: true },
  { id: 'video_mobilite', bonus_type_id: 'connaissances', title: 'L\'importance de la mobilité', content_type: 'video', url: '', description: 'Pourquoi la mobilité change tout', is_active: true },
  // MINDSET
  { id: 'video_motivation', bonus_type_id: 'mindset', title: 'Rester motivée', content_type: 'video', url: '', description: 'Comment créer une discipline durable', is_active: true },
  { id: 'video_discipline', bonus_type_id: 'mindset', title: 'La discipline comme liberté', content_type: 'video', url: '', description: 'Transformer les efforts en habitudes', is_active: true },
  { id: 'video_transformation', bonus_type_id: 'mindset', title: 'Histoires de transformation', content_type: 'video', url: '', description: 'Femmes qui ont transformé leur corps après 50 ans', is_active: true },
  // SOINS
  { id: 'massage_auto', bonus_type_id: 'soins', title: 'Auto-massage', content_type: 'text', url: '', description: 'Techniques de massage des jambes et fessiers pour accélérer la récupération.', is_active: true },
  { id: 'etirements_doux', bonus_type_id: 'soins', title: 'Étirements doux du soir', content_type: 'text', url: '', description: 'Séquence de 5 minutes à faire le soir pour récupérer.', is_active: true },
  { id: 'respiration', bonus_type_id: 'soins', title: 'Respiration 4-7-8', content_type: 'text', url: '', description: 'Inspirer 4s, tenir 7s, expirer 8s. Calme et récupération.', is_active: true },
]

export const PROGRESS_PHOTO_ZONES = [
  { id: 'global_face', name: 'Corps entier (face)', icon: '🧍' },
  { id: 'global_dos', name: 'Corps entier (dos)', icon: '🧍' },
  { id: 'profil', name: 'Profil', icon: '🧍' },
  { id: 'jambes_face', name: 'Jambes (face)', icon: '🦵' },
  { id: 'jambes_dos', name: 'Jambes (dos)', icon: '🦵' },
  { id: 'fessiers', name: 'Fessiers', icon: '🍑' },
  { id: 'ventre', name: 'Ventre', icon: '💫' },
  { id: 'bras', name: 'Bras', icon: '💪' },
  { id: 'dos', name: 'Dos', icon: '🔙' },
]

export const VISUALS = [
  { id: 'corps_global', name: 'Corps global', url: '', category: 'inspiration' },
  { id: 'jambes_toniques', name: 'Jambes toniques', url: '', category: 'inspiration' },
  { id: 'fessiers_fermes', name: 'Fessiers fermes', url: '', category: 'inspiration' },
  { id: 'ventre_tenu', name: 'Ventre tenu', url: '', category: 'inspiration' },
  { id: 'silhouette_mouvement', name: 'Silhouette en mouvement', url: '', category: 'inspiration' },
  { id: 'plage', name: 'Plage', url: '', category: 'objectif' },
  { id: 'maillot', name: 'Maillot', url: '', category: 'objectif' },
  { id: 'sport', name: 'Sport', url: '', category: 'energie' },
  { id: 'energie', name: 'Énergie', url: '', category: 'energie' },
]

export const DEFAULT_GOAL = {
  title: 'Plage à Rome',
  description: 'Se sentir libre, confiante et solide dans son corps. Bouger avec énergie.',
  target_date: '',
  background_url: '',
  is_active: true,
}

export const DEFAULT_REMINDER_RULES = {
  start_time: '08:00',
  end_time: '21:00',
  min_delay_min: 90,
  max_per_day: 6,
  required_per_day: 3,
  excluded_ranges: ['12:30-14:30'],
}

export const DEFAULT_TRAINING_PROFILE = {
  level_estimate: 1,
  energy_level: 3,
  recovery_mode: false,
  preferred_position: '',
  equipment_list: [],
  dumbbell_weights: [],
  max_intensity_allowed: 3,
  max_cardio_allowed: 2,
  work_sec_base: 40,
  rest_sec_base: 20,
}

export const DEFAULT_ADAPTIVE_CONFIG = {
  target_muscle_min: 3,
  target_muscle_max: 4,
  max_cardio_allowed: 3,
  adjust_step_percent: 0.10,
  rest_adjust_percent: 0.15,
  min_work_sec: 20,
  max_work_sec: 60,
  min_rest_sec: 10,
  max_rest_sec: 60,
  target_session_sec: 300,
}
