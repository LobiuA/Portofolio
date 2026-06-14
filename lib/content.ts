// All copy, data and image URLs for the broadcast control-room portfolio.
// Edit content here — section components are structural shells.
// Images were extracted from the source artifact into /public/work/<key>.jpg.

export const img = (key: string) => `/work/${key}.jpg`

export const accents = [
  { name: 'Signal Teal', c: '#2fe3c4', ink: '#04201b' },
  { name: 'Stream Blue', c: '#4d8dff', ink: '#04132e' },
  { name: 'Caster Magenta', c: '#ff5bb0', ink: '#2e0421' },
  { name: 'Tally Amber', c: '#ffb13d', ink: '#2e1c04' },
  { name: 'Court Green', c: '#7be05a', ink: '#0c2604' },
] as const

export const siteData = {
  brand: { tag: 'TMJ', label: 'Broadcast' },

  nav: [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Events', href: '#work' },
    { label: 'Freelance', href: '#freelance' },
    { label: 'Contact', href: '#contact' },
  ],

  hero: {
    kicker: 'Broadcast & Livestream Operator',
    nameLines: ['Tri Muhammad', 'Jidan'],
    role: {
      pre: 'I run the technical floor of ',
      accent: 'live esports broadcasts',
      post: ' — switching, graphics, audio & encoding.',
    },
    lede: 'Five years on production crews behind Valorant, Mobile Legends, PUBG Mobile and Free Fire events — from regional qualifiers to international Masters stages.',
    cta: [
      { label: 'View event work', href: '#work', primary: true },
      { label: 'Get in touch', href: '#contact', primary: false },
    ],
    headshot: img('headshot'),
    stats: [
      { n: '5', plus: '+', label: 'Years in production' },
      { n: '30', plus: '+', label: 'Events crewed' },
      { n: '4', plus: '', label: "Int'l stages" },
    ],
    marquee: [
      'vMix', 'OBS Studio', 'CG / GT Graphics', 'Audio Operator',
      'In-Game Observer', 'Replay Operator', 'Encoder', 'League Operation',
    ],
  },

  about: {
    portrait: img('about-portrait'),
    kicker: 'Introduction',
    paras: [
      'Hi — I’m Jidan, a <span class="mark">broadcasting &amp; livestream enthusiast</span> who loves learning new things and pushing myself on every production.',
      'My background is in computer & network engineering, and I’ve turned that into a career on live esports crews: setting up the switch, building real-time graphics, mixing show audio and keeping the stream encoded and on air. Outside the control room I work out, make new friends, and shoot analog photography.',
    ],
    interestsLabel: 'Off the desk',
    chips: [
      'Analog photography', 'Working out', 'Meeting new people',
      'Learning new tools', 'Indonesian — Native', 'English — Professional',
    ],
  },

  skills: {
    kicker: 'Toolkit',
    heading: 'The software and the seats I run.',
    sub: 'Hands-on across the full live-production stack — switching, graphics, audio and encoding — plus the operating roles that keep a broadcast running.',
    tools: [
      { glyph: 'vM', name: 'vMix', desc: 'Live switching · CG & GT graphics' },
      { glyph: 'OBS', name: 'OBS Studio', desc: 'Live production & encoding' },
      { glyph: 'SL', name: 'Streamlabs', desc: 'Streaming & overlays' },
      { glyph: 'GW', name: 'Google Workspace', desc: 'Run-of-show & coordination' },
    ],
    meters: [
      { name: 'vMix & live graphics', level: 'Expert', w: '95%' },
      { name: 'OBS & encoding', level: 'Expert', w: '90%' },
      { name: 'Audio operation', level: 'Advanced', w: '86%' },
      { name: 'In-game observing & replay', level: 'Advanced', w: '90%' },
      { name: 'League operation', level: 'Advanced', w: '84%' },
    ],
    roleTags: [
      'In-game Observer', 'League Operation', 'Encoder Operator', 'Replay Operator',
      'CG / Graphics Operator', 'Audio Operator', 'Technical Support', 'vMix Consultant',
    ],
  },

  experience: {
    kicker: 'Career',
    heading: "Where I've been on the crew.",
    items: [
      {
        when: '2020 — Present',
        active: true,
        role: 'Freelance — Self-Employed',
        org: 'Broadcasting · Esports production · Upwork',
        desc: 'Crewing live broadcasts as in-game observer, league operation and encoder operator, plus remote vMix consulting for international clients through Upwork.',
      },
      {
        when: '2024 — 2025',
        active: false,
        role: 'Broadcast Assistant',
        org: 'One Up Organizer',
        desc: 'Supporting live tournament productions across replay, technical support, CG/graphics and audio — including Valorant Pacific and international Masters events.',
      },
      {
        when: '2020 — 2022',
        active: false,
        role: 'Broadcast Officer',
        org: 'Ligagame Esports TV',
        desc: 'Ran broadcast operations for talkshows, esports events and live e-commerce streams on TikTok, Shopee and Tokopedia.',
      },
      {
        when: '2017 — 2020',
        active: false,
        role: 'Computer & Network Engineering',
        org: 'SMKN 1 Tangerang',
        desc: 'Vocational diploma — the technical foundation behind my production and signal-flow work.',
      },
    ],
  },

  work: {
    kicker: 'Selected Events · 2020 — 2025',
    heading: "Productions I've been part of.",
    sub: 'Filter by title and by the seat I operated. Click any event to open the full set of broadcast shots.',
    gameFilters: [
      { val: 'all', label: 'All games' },
      { val: 'valorant', label: 'Valorant' },
      { val: 'mlbb', label: 'Mobile Legends' },
      { val: 'pubg', label: 'PUBG Mobile' },
      { val: 'freefire', label: 'Free Fire' },
      { val: 'multi', label: 'Multi-title' },
    ],
    roleFilters: [
      { val: 'all', label: 'All roles' },
      { val: 'observer', label: 'Observer' },
      { val: 'league', label: 'League Op' },
      { val: 'encoder', label: 'Encoder' },
      { val: 'replay', label: 'Replay' },
      { val: 'cg', label: 'CG / Graphics' },
      { val: 'audio', label: 'Audio' },
      { val: 'tech', label: 'Technical Support' },
    ],
    // each card opens the matching gallery set (key = event)
    events: [
      { event: 'toronto', game: 'valorant', roles: ['cg'], cover: 'toronto-1', count: 4, flags: [{ label: "★ Int'l", live: true }, { label: 'Valorant' }], year: '2025 · Canada', title: 'Valorant Masters Toronto', role: 'CG Operator · vMix' },
      { event: 'bangkok', game: 'valorant', roles: ['audio'], cover: 'bangkok-1', count: 4, flags: [{ label: "★ Int'l", live: true }, { label: 'Valorant' }], year: '2025 · Thailand', title: 'Valorant Masters Bangkok', role: 'Audio Operator' },
      { event: 'pacific', game: 'valorant', roles: ['cg', 'audio'], cover: 'pacific-1', count: 4, flags: [{ label: "★ Int'l", live: true }, { label: 'Valorant' }], year: '2025 · Indonesia & Taiwan', title: 'VCT Pacific — Stage 1 & 2', role: 'CG & Audio Operator' },
      { event: 'm3', game: 'mlbb', roles: ['encoder'], cover: 'm3-1', count: 3, flags: [{ label: '★ World', live: true }, { label: 'MLBB' }], year: 'MLBB World Championship', title: 'M3 World Championship', role: 'Stream Encoder Operator' },
      { event: 'ascension', game: 'valorant', roles: ['replay'], cover: 'asc-1', count: 3, flags: [{ label: 'Valorant' }], year: 'Pacific', title: 'Valorant Ascension Pacific', role: 'Replay Operator' },
      { event: 'predator', game: 'multi', roles: ['tech'], cover: 'pred-1', count: 5, flags: [{ label: 'Multi-title' }], year: 'Indonesia', title: 'Pacific Predator League', role: 'Technical Support' },
      { event: 'arena', game: 'valorant', roles: ['observer', 'league'], cover: 'arena-1', count: 2, flags: [{ label: 'Valorant' }], year: 'Esports', title: 'Valorant Arena Showdown', role: 'Observer · League Operation' },
      { event: 'mpl', game: 'mlbb', roles: ['encoder'], cover: 'mpl-1', count: 4, flags: [{ label: 'MLBB' }], year: '2021 · ONE Esports', title: 'MPL Invitational', role: 'Encoder Operator' },
      { event: 'pmpl', game: 'pubg', roles: ['observer', 'league'], cover: 'pmpl-1', count: 4, flags: [{ label: 'PUBG Mobile' }], year: '2022 · Spring', title: 'PMPL & Pro League ID', role: 'Observer · League Operation' },
      { event: 'sukro', game: 'freefire', roles: ['tech'], cover: 'sukro-1', count: 3, flags: [{ label: 'Free Fire' }], year: '2024', title: 'Mas Sukro Cup — Free Fire', role: 'Technical Support' },
      { event: 'pbnc', game: 'multi', roles: ['tech', 'audio'], cover: 'pbnc-1', count: 4, flags: [{ label: 'Point Blank' }], year: '2025 · Indonesia', title: 'PBNC — National Championship', role: 'Technical Support — Audio' },
      { event: 'adrenalin', game: 'valorant', roles: ['observer', 'league'], cover: 'adr-1', count: 4, flags: [{ label: 'Valorant' }], year: 'S1 · S2 · S3', title: 'AMD Adrenalin Invitational', role: 'Observer · League Operation' },
      { event: 'iron', game: 'valorant', roles: ['observer', 'league'], cover: 'iron-1', count: 3, flags: [{ label: 'Valorant' }], year: 'Ligagame · S1 · S2', title: 'Battle of Iron', role: 'Observer · League Operation' },
    ],
  },

  freelance: {
    kicker: 'Freelance · Upwork',
    heading: 'Remote vMix & OBS consulting for clients abroad.',
    sub: 'Building live graphics packages and advising on broadcast technical setups for international productions — with a 100% job-success record.',
    stats: [
      { n: '100', plus: '%', label: 'Job success' },
      { n: '13', plus: '', label: 'Jobs completed' },
      { n: '$700', plus: '+', label: 'Total earned' },
      { n: 'Rising', plus: '', label: 'Upwork talent' },
    ],
    clients: [
      { event: 'tachartas', cover: 'tach-1', count: 4, pin: 'Client', name: 'Tachartas Sports', loc: 'United Kingdom · Rugby streaming', desc: 'vMix consultant — built the live graphics GT package and advised on the full broadcast technical setup for their YouTube sports channel.' },
      { event: 'tnt', cover: 'tnt-1', count: 1, pin: 'Client', name: 'Mr. Nguyen Tuyen', loc: 'Orange County, California', desc: 'Streaming & broadcast studio setup — created the graphic GT package and provided technical consultation for Tuyen News TV.' },
      { event: 'upwork', cover: 'upwork-1', count: 4, pin: 'Platform', name: 'Upwork Profile', loc: 'Tri Muhammad J. · Video Production', desc: 'OBS & vMix setups, dual-PC capture, Stream Deck and audio engineering — 20+ jobs across streaming clients.' },
    ],
    testimonial: {
      quote: '“I’m highly satisfied with Tri Muhammad Jidan’s excellent work setting up my studio. His professionalism, dedication, and attention to detail were impressive. The job was done promptly and affordably. If I could give more than 5 stars, I would. Highly recommended!”',
      stars: '★★★★★',
      cite: 'Tuyen — Streaming & Broadcast Studio Setup, Upwork',
    },
  },

  ledger: {
    kicker: 'Also Crewed',
    heading: 'More on the résumé.',
    rows: [
      { idx: '01', title: 'IESF World Championship', meta: '2022 · International' },
      { idx: '02', title: 'Valorant Champions Tour — Split 2 Indonesia', meta: 'Valorant' },
      { idx: '03', title: 'FSL Game Changer SEA Championship', meta: '2024 · SEA' },
      { idx: '04', title: 'Honor of Kings — Office Attack', meta: 'Honor of Kings' },
      { idx: '05', title: 'Honor of Kings — KIC PH Qualifier', meta: 'Honor of Kings' },
      { idx: '06', title: 'Dunia Games Championship — Free Fire', meta: '2024 · Free Fire' },
      { idx: '07', title: 'PMVB Season 2', meta: '2022 · PUBG Mobile' },
    ],
  },

  contact: {
    kicker: 'On Air Next?',
    heading: ['Let’s get your', 'broadcast running.'],
    sub: 'Available for live esports productions, remote vMix consulting and freelance broadcast technical work. Reach out and I’ll reply.',
    links: [
      { type: 'email', lbl: 'Email', val: 'jidantri14@gmail.com', href: 'mailto:jidantri14@gmail.com' },
      { type: 'whatsapp', lbl: 'WhatsApp', val: '+62 851-5091-9590', href: 'https://wa.me/6285150919590' },
      { type: 'instagram', lbl: 'Instagram', val: '@trimuhammadjidan', href: 'https://instagram.com/trimuhammadjidan' },
      { type: 'upwork', lbl: 'Upwork', val: 'Tri Muhammad Jidan', href: 'https://www.upwork.com/freelancers/~01e435a09815c57d06' },
    ],
  },

  footer: {
    left: '© 2025 Tri Muhammad Jidan · Broadcast & Livestream Operator',
    right: 'Designed for the control room',
  },
}

// Lightbox image sets — key matches each event/client `event` field.
export const galleryData: Record<string, { title: string; imgs: [string, string][] }> = {
  toronto: { title: 'Valorant Masters Toronto 2025', imgs: [
    ['toronto-1', 'Tournament key art — Toronto skyline'],
    ['toronto-2', 'Showmatch — live in-game observer feed'],
    ['toronto-3', 'Player reflection interview segment'],
    ['toronto-4', 'Grand Final countdown — PRX vs FNC']] },
  bangkok: { title: 'Valorant Masters Bangkok 2025', imgs: [
    ['bangkok-1', 'Tournament key art — Bangkok skyline'],
    ['bangkok-2', 'Crystal key art — Dawn of the Duelist'],
    ['bangkok-3', 'Studio talkshow desk'],
    ['bangkok-4', 'Showmatch scoreboard — Thailand vs International']] },
  pacific: { title: 'VCT Pacific — Stage 1 & 2', imgs: [
    ['pacific-1', 'Rise Pacific key art — Stage 1'],
    ['pacific-2', 'Pacific studio talkshow desk'],
    ['pacific-3', 'Stage 2 player interview'],
    ['pacific-4', 'VCT Pacific Stage 2 ident']] },
  m3: { title: 'M3 World Championship', imgs: [
    ['m3-1', 'Grand Final analyst desk — To The Top'],
    ['m3-2', 'World Championship Quickie segment'],
    ['m3-3', 'Grand Final — ONIC PH player intro']] },
  ascension: { title: 'Valorant Ascension Pacific', imgs: [
    ['asc-1', 'Ascend to Greatness talkshow desk'],
    ['asc-2', 'Replay Operator — broadcast credits'],
    ['asc-3', 'In-game replay — spike carrier down']] },
  predator: { title: 'Pacific Predator League', imgs: [
    ['pred-1', 'Main stage — Tim Severine vs Tim Sleepy'],
    ['pred-2', 'Indonesian Online Qualifiers — BO3'],
    ['pred-3', 'Champions — Technical Support credits'],
    ['pred-4', 'Group stage — Helios vs Nitro'],
    ['pred-5', 'Predator main stage — wide']] },
  arena: { title: 'Valorant Arena Showdown', imgs: [
    ['arena-1', 'Arena Showdown analyst desk'],
    ['arena-2', 'In-game observer feed']] },
  mpl: { title: 'MPL Invitational 2021 — ONE Esports', imgs: [
    ['mpl-1', 'Main stage'],
    ['mpl-2', 'Analyst desk'],
    ['mpl-3', 'Pick & ban — Ranger Frags vs Modochan'],
    ['mpl-4', 'Players on stage']] },
  pmpl: { title: 'PMPL & PUBG Pro League Indonesia', imgs: [
    ['pmpl-1', 'PMPL ID Spring — coming soon ident'],
    ['pmpl-2', 'Grand Champions — ONIC G'],
    ['pmpl-3', 'Caster desk — Sanskuy & Jelly'],
    ['pmpl-4', 'Pro League Indonesia — Be The #1']] },
  sukro: { title: 'Mas Sukro Cup — Free Fire', imgs: [
    ['sukro-1', 'Opening ceremony — main stage'],
    ['sukro-2', 'Champions — Pandora Stars'],
    ['sukro-3', 'In-game — MBCUP 2024 Grand Final']] },
  pbnc: { title: 'PBNC — Point Blank National Championship', imgs: [
    ['pbnc-1', 'Talent desk'],
    ['pbnc-2', 'Starting-soon countdown'],
    ['pbnc-3', 'Broadcast credits — TS Audio: Jidan'],
    ['pbnc-4', 'In-game — scope cam']] },
  adrenalin: { title: 'AMD Adrenalin Valorant Invitational', imgs: [
    ['adr-1', 'Season 1 — Main Event bracket'],
    ['adr-2', 'Season 2 — Final Day'],
    ['adr-3', 'Season 3 — show intro'],
    ['adr-4', 'Season 3 — analyst desk']] },
  iron: { title: 'Ligagame Battle of Iron', imgs: [
    ['iron-1', 'Season 1 — starting soon'],
    ['iron-2', 'Season 2 — Low Skill bracket'],
    ['iron-3', 'Countdown ident']] },
  tachartas: { title: 'Tachartas Sports — United Kingdom', imgs: [
    ['tach-1', 'Live rugby — MER vs DOL'],
    ['tach-2', 'YouTube channel — schools rugby coverage'],
    ['tach-3', 'Merchiston Castle vs Dollar Academy — half time'],
    ['tach-4', "Commentary desk — George Watson's vs Dollar"]] },
  tnt: { title: 'Tuyen News TV — California', imgs: [
    ['tnt-1', 'Two-box broadcast — Nguyen Tuyen & guest']] },
  upwork: { title: 'Upwork — Video Production', imgs: [
    ['upwork-1', 'Profile — 100% Job Success, Rising Talent'],
    ['upwork-2', 'Jobs in progress'],
    ['upwork-3', 'Completed jobs — 5-star reviews'],
    ['upwork-4', 'More completed work']] },
}
