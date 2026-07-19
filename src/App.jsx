import { useState } from 'react'

const initialDump = `Jonas has a pediatrician appointment next Tuesday at 10. Remind me to bring diapers to kindergarten on Thursday. Mansur has speech therapy every Thursday afternoon. Jonas needs Vitamin D after breakfast. We should pack the therapy bag the night before.`

const week = [
  { day: 'Mon', date: '15', events: [{ time: '07:45', label: 'Kindergarten', tone: 'teal' }, { time: '19:00', label: 'Wind-down routine', tone: 'sand' }] },
  { day: 'Tue', date: '16', current: true, events: [{ time: '09:30', label: 'Kindergarten', tone: 'teal' }, { time: '16:00', label: 'Speech therapy', tone: 'lilac' }] },
  { day: 'Wed', date: '17', events: [{ time: '08:00', label: 'Vitamin D reminder', tone: 'sun' }, { time: '19:30', label: 'Pack therapy bag', tone: 'coral' }] },
  { day: 'Thu', date: '18', events: [{ time: '08:00', label: 'Bring diapers', tone: 'coral' }, { time: '16:00', label: 'Speech therapy', tone: 'lilac' }] },
  { day: 'Fri', date: '19', events: [{ time: '08:00', label: 'Kindergarten', tone: 'teal' }] },
  { day: 'Sat', date: '20', events: [{ time: '10:30', label: 'Family walk', tone: 'sand' }] },
  { day: 'Sun', date: '21', events: [{ time: '18:30', label: 'Plan the week', tone: 'teal' }] },
]

const extractedItems = {
  Appointments: [{ title: 'Pediatrician — Jonas', detail: 'Tuesday · 10:00', icon: '🩺' }, { title: 'Speech therapy — Mansur', detail: 'Every Thursday · afternoon', icon: '💬' }],
  Tasks: [{ title: 'Bring diapers to kindergarten', detail: 'Thursday', icon: '🧷' }, { title: 'Pack the therapy bag', detail: 'Wednesday evening', icon: '🎒' }],
  Medications: [{ title: 'Jonas — Vitamin D', detail: 'After breakfast · daily', icon: '💛' }],
  Routines: [{ title: 'Therapy-bag check', detail: 'The evening before therapy', icon: '✓' }],
  'Follow-up questions': [{ title: 'Which pediatrician is Jonas seeing?', detail: 'Add the location to the appointment', icon: '?' }],
}

const initialTasks = [
  { title: 'Pack the therapy bag', note: 'Before 15:30 today', source: 'Routine', tone: 'lilac', done: false },
  { title: 'Order diapers', note: 'Stock is running low', source: 'Email', tone: 'coral', done: false },
  { title: 'Reply to kindergarten email', note: 'Two-minute task', source: 'Email', tone: 'sun', done: false },
  { title: 'Book Jonas’s pediatrician visit', note: 'Choose a location', source: 'Brain Dump', tone: 'teal', done: false },
]

const assistantAnswers = {
  'What should I focus on today?': 'Start with the therapy bag before 15:30. Then your two small tasks can fit into a calm 15-minute window after dinner.',
  'What do I need to prepare for tomorrow?': 'Tomorrow is light. The helpful prep is to check the diaper supply tonight and keep Jonas’s Vitamin D by the breakfast table.',
  'Are there any conflicts this week?': 'No conflicts found in this demo. Thursday has both kindergarten errands and speech therapy, so I would prepare the therapy bag on Wednesday evening.',
}

function SectionHeading({ eyebrow, title, action }) {
  return <div className="section-heading"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2></div>{action}</div>
}

function WeekCalendar({ expanded = false }) {
  return <div className={expanded ? 'calendar-grid expanded' : 'calendar-grid'}>
    {week.map((day) => <article className={`day-card ${day.current ? 'today' : ''}`} key={day.date}>
      <header><span>{day.day}</span><strong>{day.date}</strong></header>
      <div className="day-events">{day.events.map((event) => <div className={`calendar-event ${event.tone}`} key={event.label}><time>{event.time}</time><span>{event.label}</span></div>)}</div>
    </article>)}
  </div>
}

function App() {
  const [brainDump, setBrainDump] = useState(initialDump)
  const [processed, setProcessed] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [listening, setListening] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [tasks, setTasks] = useState(initialTasks)
  const [medicationDone, setMedicationDone] = useState(false)
  const [question, setQuestion] = useState('')
  const [chat, setChat] = useState([{ role: 'assistant', text: 'Hi Pia — I’m here to make the day feel lighter. What would you like to plan?' }])

  const processDump = () => {
    if (!brainDump.trim()) return
    setProcessing(true)
    setTimeout(() => { setProcessing(false); setProcessed(true) }, 650)
  }

  const askAssistant = (prompt) => {
    const cleaned = prompt.trim()
    if (!cleaned) return
    const answer = assistantAnswers[cleaned] || 'I’ve added that thought to our planning view. In a connected version, I would check family routines and calendars for the best next step.'
    setChat((messages) => [...messages, { role: 'user', text: cleaned }, { role: 'assistant', text: answer }])
    setQuestion('')
  }

  return <main>
    <nav className="topbar">
      <a className="brand" href="#top" aria-label="AI Family OS home"><span className="brand-mark">✦</span><span>AI Family <em>OS</em></span></a>
      <div className="family-chip"><span className="avatar-stack"><i>J</i><i>M</i><i>P</i></span><span>The Österlind family</span><b>⌄</b></div>
    </nav>

    <section id="top" className="hero">
      <p className="eyebrow">Tuesday, 16 July</p>
      <h1>Good morning, Pia.<br /><span>Your family is in good hands.</span></h1>
      <p className="tagline">Capture everything. Organize nothing. AI does the rest.</p>
    </section>

    <section className="calendar-section" aria-labelledby="calendar-title">
      <SectionHeading eyebrow="The next seven days" title="What’s coming up" action={<button className="outline-button" type="button" onClick={() => setCalendarOpen(true)}>Open Calendar <span>→</span></button>} />
      <WeekCalendar />
      <p className="calendar-note">A gentle view of the plans and routines that matter most.</p>
    </section>

    <section className="tasks-section" aria-labelledby="tasks-title">
      <SectionHeading eyebrow="Small steps, lighter day" title="Tasks & to-dos" action={<span className="count-pill">{tasks.filter((task) => !task.done).length} to do</span>} />
      <div className="task-list">
        {tasks.map((task, index) => <button className={`task-row ${task.done ? 'complete' : ''}`} onClick={() => setTasks((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, done: !item.done } : item))} type="button" key={task.title}>
          <span className="check">{task.done && '✓'}</span><span className="task-copy"><strong>{task.title}</strong><small>{task.note}</small></span><span className={`source-badge ${task.tone}`}>{task.source}</span>
        </button>)}
      </div>
      <p className="connection-note">Ready for future connections to Todoist, Apple Reminders, Microsoft To Do, and Google Tasks.</p>
    </section>

    <section className="signals-section" aria-label="Family signals">
      <article className="overview-card medication-card"><div className="card-heading"><span className="mini-icon sun">☀</span><h3>Medication</h3></div><button className={`medicine-row ${medicationDone ? 'complete' : ''}`} onClick={() => setMedicationDone((done) => !done)} type="button"><span className="check">{medicationDone && '✓'}</span><span><strong>Vitamin D for Jonas</strong><small>After breakfast · daily</small></span></button><p>One reminder for today</p></article>
      <article className="overview-card"><div className="card-heading"><span className="mini-icon teal">⌁</span><h3>Routines</h3></div><div className="routine-row"><time>07:15</time><span><strong>Morning launch</strong><small>Breakfast · bags · jackets</small></span></div><div className="routine-row"><time>19:00</time><span><strong>Wind-down</strong><small>Bath · stories · lights low</small></span></div></article>
      <article className="overview-card inbox-card"><div className="card-heading"><span className="mini-icon coral">✉</span><h3>Inbox signals</h3><span className="signal-count">2</span></div><div className="signal"><strong>Kindergarten email detected</strong><small>Bring diapers by Thursday</small></div><div className="signal"><strong>Therapy update needs review</strong><small>New appointment detail found</small></div></article>
    </section>

    <section className="brain-dump card" aria-labelledby="dump-title">
      <div className="brain-dump-intro"><div className="soft-icon teal">✦</div><div><p className="eyebrow">Your family brain</p><h2 id="dump-title">What’s on your mind?</h2><p>Type or speak anything on your mind. AI Family OS will organize it.</p></div></div>
      <div className={`input-shell ${listening ? 'listening' : ''}`}><textarea value={brainDump} onChange={(event) => setBrainDump(event.target.value)} placeholder="Appointments, reminders, tiny worries…" aria-label="Brain dump" /><div className="input-actions"><button className={`voice-button ${listening ? 'active' : ''}`} onClick={() => setListening((value) => !value)} type="button" aria-pressed={listening}>◉ {listening ? 'Listening…' : 'Voice note'}</button><button className="primary-button" onClick={processDump} type="button" disabled={processing}>✦ {processing ? 'Finding the threads…' : 'Process with AI'}</button></div></div>
      {listening && <p className="voice-hint"><span className="pulse-dot" /> Voice input is a demo concept — your thoughts are safe here.</p>}
    </section>

    {processed && <section className="ai-result" aria-labelledby="result-title"><SectionHeading eyebrow="A calmer view" title="Here’s what I found" action={<span className="ai-badge">✦ Mock AI processing</span>} /><div className="extracted-grid">{Object.entries(extractedItems).map(([category, items]) => <article className="extract-card" key={category}><h3>{category}<span>{items.length}</span></h3><ul>{items.map((item) => <li key={item.title}><span className="item-icon">{item.icon}</span><div><strong>{item.title}</strong><small>{item.detail}</small></div></li>)}</ul></article>)}</div></section>}

    <section className="assistant-section card" aria-labelledby="assistant-title"><div className="assistant-intro"><div className="assistant-face">✦</div><div><p className="eyebrow">Your planning partner</p><h2 id="assistant-title">Ask your family assistant</h2><p>For the questions you don’t want to keep carrying around.</p></div></div><div className="chat-window" aria-live="polite">{chat.map((message, index) => <div className={`message ${message.role}`} key={`${message.text}-${index}`}>{message.role === 'assistant' && <span className="mini-assistant">✦</span>}<p>{message.text}</p></div>)}</div><div className="prompt-row">{Object.keys(assistantAnswers).map((prompt) => <button type="button" key={prompt} onClick={() => askAssistant(prompt)}>{prompt}</button>)}</div><form className="chat-input" onSubmit={(event) => { event.preventDefault(); askAssistant(question) }}><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about your family’s week…" aria-label="Ask the family assistant" /><button type="submit" aria-label="Send question">↑</button></form></section>

    <section className="integrations" aria-labelledby="integrations-title"><SectionHeading eyebrow="Coming when you’re ready" title="Works with the tools you already use" /><div className="integration-grid">{[['31', 'Google Calendar'], ['◐', 'Apple Calendar'], ['O', 'Outlook Calendar'], ['M', 'Gmail'], ['✓', 'Todoist'], ['◌', 'Apple Reminders'], ['□', 'Microsoft To Do'], ['◉', 'Voice input']].map(([symbol, name]) => <article className="integration-card" key={name}><span className="integration-logo">{symbol}</span><h3>{name}</h3><small>Planned</small></article>)}</div></section>

    {calendarOpen && <div className="modal-backdrop" role="presentation" onClick={() => setCalendarOpen(false)}><section className="calendar-modal" role="dialog" aria-modal="true" aria-labelledby="month-title" onClick={(event) => event.stopPropagation()}><button className="close-button" type="button" onClick={() => setCalendarOpen(false)} aria-label="Close calendar">×</button><p className="eyebrow">Calendar preview</p><h2 id="month-title">July 2026</h2><p>This is a demo of your future shared family calendar.</p><WeekCalendar expanded /><button className="primary-button full-width" type="button" onClick={() => setCalendarOpen(false)}>Back to overview</button></section></div>}

    <footer><span className="brand-mark">✦</span> AI Family OS <i>Capture everything. Organize nothing. AI does the rest.</i></footer>
  </main>
}

export default App
