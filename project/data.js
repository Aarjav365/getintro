// Data for Get Intro prototype
window.GI_DATA = (() => {
  const personas = {
    maya: {
      id: 'maya',
      name: 'Maya Chen',
      handle: 'maya',
      role: 'Angel investor · ex-Stripe PM',
      bio: "Angel investing in fintech & dev tools. Previously 2nd PM at Stripe, shipped Billing & Connect. I answer most serious intros within 72h. If we've never met, use the menu below — I don't do cold DMs.",
      avatar: { color: 'amber', initials: 'MC' },
      stats: { sent: '240k', replies: '94%', turnaround: '36h' },
      verified: true,
    },
    devon: {
      id: 'devon',
      name: 'Devon Okafor',
      handle: 'devon',
      role: 'Founder · Helios (YC W25)',
      bio: "Building Helios — commissionable AI agents for logistics ops. Hiring founding eng. Happy to meet other early founders and infra folks.",
      avatar: { color: 'blue', initials: 'DO' },
      stats: { sent: '18k', replies: '88%', turnaround: '8h' },
      verified: false,
    },
    sana: {
      id: 'sana',
      name: 'Sana Patel',
      handle: 'sana',
      role: 'Writer · 180k readers · The Loop',
      bio: "Weekly newsletter on ambient AI + the future of work. Open to collabs with serious practitioners. All sponsorship inquiries → press form.",
      avatar: { color: 'purple', initials: 'SP' },
      stats: { sent: '52k', replies: '76%', turnaround: '4d' },
      verified: true,
    },
  };

  const requestTypes = [
    { id: 'call', icon: '☎', name: 'Book a call', desc: '20-min intro call. Share context below.', price: '$200', fields: ['topic','agenda','calendar'] },
    { id: 'invest', icon: '◉', name: 'Pitch for investment', desc: 'Send deck + traction. $25k–100k checks.', price: 'Free', free: true, fields: ['company','stage','deck','traction'] },
    { id: 'mentor', icon: '✦', name: 'Ask for mentorship', desc: '1 question, async. Reply in 72h or it\'s on me.', price: '$50', fields: ['question','context'] },
    { id: 'collab', icon: '⇌', name: 'Propose a collab', desc: 'Podcast, talk, co-write, advisory.', price: 'Free', free: true, fields: ['format','audience','timing'] },
    { id: 'apply', icon: '◷', name: 'Apply for a role', desc: 'Portfolio or IC roles at portfolio cos.', price: 'Free', free: true, fields: ['role','company','link'] },
    { id: 'intro', icon: '↗', name: 'Ask for an intro', desc: 'Warm intro to someone in my network.', price: '$100', fields: ['target','why','ask'] },
  ];

  const requests = [
    {
      id: 'r1', unread: true, selected: true, status: 'pending',
      sender: { name: 'Amelia Novak', role: 'Co-founder, Harbor (seed)', company: 'Harbor', avatar: { color: 'blue', initials: 'AN' }, location: 'Brooklyn, NY', links: [{k:'linkedin',v:'linkedin.com/in/amelianovak'},{k:'site',v:'harbor.so'}] },
      type: 'invest', typeLabel: 'Pitch for investment',
      subject: 'B2B treasury ops — $2.4M ARR, raising $6M seed',
      preview: 'We help SMB finance teams move cash across 40+ bank accounts in under a minute. Referred by Priya at Base10.',
      time: '2h', date: 'Tue 4:12 PM',
      message: [
        "Hi Maya — Priya at Base10 suggested I reach out. She thought Harbor's ICP (SMB finance ops) would resonate given your Stripe Billing background.",
        "We've built a treasury command center that consolidates cash across banks and auto-rebalances for yield. 2.4M ARR, 31% MoM growth the last six months, 88% gross retention. Closing our $6M seed this month — LifeX Ventures is leading at $28M post.",
        "Would love 20 minutes to show you the product and walk through traction. Happy to share the deck and financials ahead of any call."
      ],
      fields: { Company: 'Harbor', Stage: 'Seed', Raising: '$6M at $28M post', Traction: '$2.4M ARR · 31% MoM', Deck: 'harbor-deck-v4.pdf', Reference: 'Priya Shah (Base10)' },
      ai: {
        fit: 92,
        reasons: [
          { k: 'thesis', v: "Fintech + SMB tooling — you've backed <strong>3/5</strong> of your last checks in this exact category." },
          { k: 'warm', v: "Referred by <strong>Priya Shah</strong> — you've co-invested twice (Ledgerly, Canopy)." },
          { k: 'traction', v: "Growth rate sits in <strong>top 8%</strong> of fintech seed rounds tracked this quarter." },
          { k: 'risk', v: "Founder has no prior exits — but shipped 2 products at Plaid." }
        ],
        draftReply: "Amelia — thanks for the intro from Priya. Numbers look serious. Can you send the deck + a link to your cap table? I can do a call Thursday 2pm PT if that works."
      }
    },
    {
      id: 'r2', unread: true, status: 'pending',
      sender: { name: 'Jonas Liang', role: 'Product designer · Figma, Airtable', avatar: { color: 'green', initials: 'JL' }, location: 'San Francisco' },
      type: 'mentor', typeLabel: 'Mentorship',
      subject: 'How did you decide Stripe was the right place to stay 6+ years?',
      preview: 'Getting pressure to jump to a Series A CPO role. Current comp at Figma is strong and I love the team, but...',
      time: '6h', date: 'Tue 11:47 AM',
      message: [
        "Hi Maya — been reading your essays on staying vs. jumping. I'm 3 years into my senior PD role at Figma. Just got offered CPO at a $40M-raised Series A (rev sync / ops category).",
        "I've modeled the math. What I can't model is the career shape question. You famously stayed at Stripe long past the 'normal' exit point — how did you decide that was right, and what would flip it?"
      ],
      fields: { Question: 'Stay vs. jump to a CPO role', Context: '3 yrs @ Figma, 6 yrs career', Urgency: 'Decision by Friday' },
      ai: { fit: 68, reasons: [ { k:'topic', v: "Maps to your <strong>published essays</strong> on career tenure." }, { k:'signal', v: "Asker has a clear, specific question — higher chance of a good thread." } ] }
    },
    {
      id: 'r3', unread: false, status: 'pending',
      sender: { name: 'Teo Marquez', role: 'Host · Equity & Bits podcast', avatar: { color: 'pink', initials: 'TM' }, location: 'Austin' },
      type: 'collab', typeLabel: 'Collab',
      subject: 'Would you guest on E&B? Topic: fintech post-Stripe era',
      preview: 'We\'re doing a 6-part series on what the post-Stripe fintech landscape looks like. Would love you for ep 2...',
      time: '1d', date: 'Mon 3:20 PM',
      message: [
        "Hi Maya — I host Equity & Bits (~40k weekly listeners). We're doing a series on the post-Stripe fintech era: who's next, what's overbuilt, what's underinvested.",
        "Would love you as ep 2. Can record remote, 60 minutes. We'd send questions a week ahead."
      ],
      fields: { Format: 'Podcast (remote)', Length: '60 min', Audience: '~40k/wk', Timing: 'Late May' }
    },
    {
      id: 'r4', unread: false, status: 'accepted',
      sender: { name: 'Dr. Rania Haddad', role: 'Clinical director · Lumen Health', avatar: { color: 'teal', initials: 'RH' } },
      type: 'call', typeLabel: 'Call',
      subject: 'Thoughts on founder-led sales into health systems?',
      preview: 'Booked for Thu 3pm PT. Sending prep doc.',
      time: '1d', date: 'Mon 10:05 AM',
      fields: {}
    },
    {
      id: 'r5', unread: false, status: 'pending',
      sender: { name: 'Kwame Adebayo', role: 'Eng lead · Vercel', avatar: { color: 'purple', initials: 'KA' } },
      type: 'intro', typeLabel: 'Intro request',
      subject: 'Warm intro to Elad Gil?',
      preview: 'Raising Series A. I think Elad would resonate with what we\'re building. Happy to send a blurb...',
      time: '2d', date: 'Sun 6:44 PM',
      fields: { Target: 'Elad Gil', Reason: 'Raising Series A in AI infra', Ask: 'Blurb intro if warm' }
    },
    {
      id: 'r6', unread: false, status: 'pending',
      sender: { name: 'Sachi Yamamoto', role: 'Ex-Stripe, building in stealth', avatar: { color: 'amber', initials: 'SY' } },
      type: 'invest', typeLabel: 'Pitch',
      subject: 'Pre-seed — devtools for agent telemetry',
      preview: 'Solo founder, 8 weeks in, shipped v0.1 to 12 design partners. Looking for a $1.5M pre-seed...',
      time: '2d', date: 'Sun 9:12 AM',
      fields: { Stage: 'Pre-seed', Raising: '$1.5M', Traction: '12 design partners' }
    },
    {
      id: 'r7', unread: false, status: 'declined',
      sender: { name: 'Ben Cutler', role: 'MBA student · HBS', avatar: { color: 'slate', initials: 'BC' } },
      type: 'call', typeLabel: 'Call',
      subject: 'Career advice call?',
      preview: 'Auto-declined — matched your "no general career coffees" rule.',
      time: '3d', date: 'Sat'
    },
    {
      id: 'r8', unread: false, status: 'pending',
      sender: { name: 'Priya Shah', role: 'Partner · Base10', avatar: { color: 'green', initials: 'PS' } },
      type: 'intro', typeLabel: 'Intro request',
      subject: 'Can you warm-intro Amelia from Harbor?',
      preview: 'She\'s raising. You and I co-invested in Ledgerly — thought you\'d want the look...',
      time: '3d', date: 'Sat 11:00 AM',
      fields: {}
    },
  ];

  // network for constellation
  const network = [
    { id: 'you', name: 'You', x: 50, y: 50, you: true, score: null, tags: ['Fintech','SMB','Infra'] },
    { id: 'n1', name: 'Sana Ravi', role: 'GP · Index', x: 22, y: 28, score: 94, color: 'purple', initials: 'SR', active: true,
      why: 'Co-invested in 3 fintech seeds. Leads Series A in your thesis.',
      overlap: ['Fintech thesis', 'SMB tooling', 'Stripe alumni'] },
    { id: 'n2', name: 'Ben Yoo', role: 'Founder · Pier', x: 72, y: 22, score: 88, color: 'blue', initials: 'BY', active: false,
      why: 'Building adjacent infra. Looking for design advisors — you fit.',
      overlap: ['Developer tools', 'Founding team'] },
    { id: 'n3', name: 'Lena Torres', role: 'CFO · Ramp', x: 80, y: 62, score: 81, color: 'pink', initials: 'LT', active: false,
      why: "Mutual connect through Priya. She's hiring a Head of Platform.",
      overlap: ['Finance ops', 'SMB GTM'] },
    { id: 'n4', name: 'Kofi Asare', role: 'Writer · Signals', x: 32, y: 74, score: 76, color: 'amber', initials: 'KA', active: false,
      why: 'Covers your beat. Could profile your thesis for 40k+ readers.',
      overlap: ['Fintech writing', 'Thought leadership'] },
    { id: 'n5', name: 'Mira Chen', role: 'Ex-Plaid, building', x: 60, y: 78, score: 72, color: 'teal', initials: 'MC', active: false,
      why: 'Former Plaid PM. Raising pre-seed in compliance tooling.',
      overlap: ['Fintech', 'Plaid alumni'] },
    { id: 'n6', name: 'Oskar Lind', role: 'GP · Sequence', x: 15, y: 55, score: 64, color: 'slate', initials: 'OL', active: false,
      why: 'New to SF. Looking to meet operators in fintech.',
      overlap: ['Fintech', 'SF network'] },
  ];

  // community (admin)
  const community = {
    name: 'On Deck Fintech',
    members: 428,
    kpis: [
      { label: 'Active members', value: '428', delta: '+12 wk', spark: [4,6,5,7,8,9,7,10,11,12,11,14] },
      { label: 'Intros made', value: '182', delta: '+31 wk', spark: [1,3,2,4,5,7,6,8,10,9,12,14] },
      { label: 'Reply rate', value: '428', delta: '+2.1 pp', spark: [70,72,74,73,75,78,80,79,82,83,84,84] },
      { label: 'Avg turnaround', value: '38h', delta: '-6h', spark: [60,58,55,52,50,48,46,44,42,40,39,38] },
    ],
    funnel: [
      { label: 'Profile views', sub: 'Public link hits', count: 2484, pct: 1.0 },
      { label: 'Requests started', sub: 'Clicked a menu item', count: 612, pct: 0.31 },
      { label: 'Requests sent', sub: 'Filled + submitted', count: 341, pct: 0.18 },
      { label: 'Accepted', sub: 'Replied + scheduled', count: 247, pct: 0.13 },
      { label: 'Intros made', sub: 'AI-matched or manual', count: 182, pct: 0.10 },
    ],
    leaders: [
      { name: 'Yuki Okabe', role: 'Partner · Mercator', val: 34, rank: 1 },
      { name: 'Devon Okafor', role: 'Founder · Helios', val: 22, rank: 2 },
      { name: 'Maya Chen', role: 'Angel · ex-Stripe', val: 18, rank: 3 },
      { name: 'Amelia Novak', role: 'Co-founder · Harbor', val: 11, rank: 4 },
      { name: 'Kofi Asare', role: 'Writer · Signals', val: 9, rank: 5 },
    ]
  };

  return { personas, requestTypes, requests, network, community };
})();
