import { useState } from 'react'

const initialDump = `Jonas has a pediatrician appointment next Tuesday at 10. Remind me to bring diapers to kindergarten on Thursday. Mansur has speech therapy every Thursday afternoon. Jonas needs Vitamin D after breakfast. We should pack the therapy bag the night before.`

const extractedItems = {
  Appointments: [
    { title: 'Pediatrician — Jonas', detail: 'Tuesday · 10:00', icon: '🩺' },
    { title: 'Speech therapy — Mansur', detail: 'Every Thursday · afternoon', icon: '💬' },
  ],
  Tasks: [
    { title: 'Bring diapers to kindergarten', detail: 'Thursday', icon: '🧷' },
    { title: 'Pack the therapy bag', detail: 'Wednesday evening', icon: '🎒' },
  ],
  Medications: [
    { title: 'Jonas — Vitamin D', detail: 'After breakfast · daily', icon: '💛' },
  ],
  Routines: [
    { title: 'Therapy-bag check', detail: 'The evening before therapy', icon: '✓' },
  ],
  'Follow-up questions': [
    { title: 'Which pediatrician is Jonas seeing?', detail: 'Add the location to the appointment', icon: '?' },
  ],
}

const dashboardData = {
  appointments: [
    { time: '09:30', title: 'Kindergarten drop-off', person: 'Jonas', tone: 'coral' },
    { time: '16:00', title: 'Speech therapy', person: 'Mansur', tone: 'lavender' },
  ],
  tasks: [
    { title: 'Pack the therapy bag', note: 'Before 15:30', done: false },
    { title: 'Order diapers', note: 'Low stock', done: false },
    { title: 'Reply to kindergarten email', note: '2 min', done: false },
  ],
  medication: { title: 'Vitamin D for Jonas', time: 'After breakfast', done: false },
  routines: [
    { time: '07:15', title: 'Morning launch', detail: 'Breakfast · bags · jackets' },
    { time: '19:00', title: 'Wind-down', detail: 'Bath · stories · lights low' },
  ],
}

const assistantAnswers = {
  'What should I focus on today?': 'Start with the therapy bag before 15:30. Then your two small tasks can fit into a calm 15-minute window after dinner.',
  'What do I need to prepare for tomorrow?': 'Tomorrow is light. The helpful prep is to check the diaper supply tonight and keep Jonas’s Vitamin D by the breakfast table.',
  'Are there any conflicts this week?': 'No conflicts found in this demo. Thursday has both kindergarten errands and speech therapy, so I would prepare the therapy bag on Wednesday evening.',
  'When could I schedule this task?': 'A good open moment is around 20:15 after the wind-down routine. I can suggest that slot when calendar sync is connected.',
}

function Icon({ children, className = '' }) {
  return <span className={`icon ${className}`}>{children}</span>
}

function SectionHeading({ eyebrow, title, action }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  )
}

function App() {
  const [brainDump, setBrainDump] = useState(initialDump)
  const [processed, setProcessed] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [listening, setListening] = useState(false)
  const [tasks, setTasks] = useState(dashboardData.tasks)
  const [medicationDone, setMedicationDone] = useState(false)
  const [question, setQuestion] = useState('')
  const [chat, setChat] = useState([
    { role: 'assistant', text: 'Hi Pia — I’m here to make the day feel lighter. What would you like to plan?' },
  ])

  const processDump = () => {
    if (!brainDump.trim()) return
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setProcessed(true)
    }, 650)
  }

  const toggleVoice = () => {
    setListening((value) => !value)
  }

  const askAssistant = (prompt) => {
    const cleaned = prompt.trim()
    if (!cleaned) return
    const answer = assistantAnswers[cleaned] || 'I’ve added that thought to our planning view. In a connected version, I would look across your calendar and family routines for the best next step.'
    setChat((messages) => [...messages, { role: 'user', text: cleaned }, { role: 'assistant', text: answer }])
    setQuestion('')
  }

  const toggleTask = (index) => {
    setTasks((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, done: !item.done } : item))
  }

  return (
    <main>
      <nav className="topbar">
        <a className="brand" href="#top" aria-label="AI Family OS home">
          <span className="brand-mark">✦</span>
          <span>AI Family <em>OS</em></span>
        </a>
        <div className="family-chip"><span className="avatar-stack"><i>J</i><i>M</i><i>P</i></span> The Österlind family <span className="chevron">⌄</span></div>
      </nav>

      <section id="top" className="hero">
        <div>
          <p className="eyebrow">Tuesday, 16 July</p>
          <h1>Good morning, Pia.<br /><span>Let’s make room for what matters.</span></h1>
          <p className="hero-copy">Your family’s little details, gently held in one place.</p>
        </div>
        <div className="hero-orb" aria-hidden="true"><span>☀</span></div>
      </section>

      <section className="brain-dump card" aria-labelledby="dump-title">
        <div className="brain-dump-intro">
          <div className="soft-icon teal">✦</div>
          <div>
            <p className="eyebrow">Your family brain</p>
            <h2 id="dump-title">What’s on your mind?</h2>
            <p>Drop it all here. We’ll make sense of it together.</p>
          </div>
        </div>
        <div className={`input-shell ${listening ? 'listening' : ''}`}>
          <textarea value={brainDump} onChange={(event) => setBrainDump(event.target.value)} placeholder="Appointments, reminders, tiny worries…" aria-label="Brain dump" />
          <div className="input-actions">
            <button className={`voice-button ${listening ? 'active' : ''}`} onClick={toggleVoice} type="button" aria-pressed={listening}>
              <Icon>◉</Icon> {listening ? 'Listening…' : 'Voice note'}
            </button>
            <button className="primary-button" onClick={processDump} type="button" disabled={processing}>
              <Icon>✦</Icon> {processing ? 'Finding the threads…' : 'Process with AI'}
            </button>
          </div>
        </div>
        {listening && <p className="voice-hint"><span className="pulse-dot" /> Voice input is a demo concept — your thoughts are safe here.</p>}
      </section>

      {processed && <section className="ai-result" aria-labelledby="result-title">
        <SectionHeading eyebrow="A calmer view" title="Here’s what I found" action={<span className="ai-badge">✦ Mock AI processing</span>} />
        <div className="extracted-grid">
          {Object.entries(extractedItems).map(([category, items]) => (
            <article className="extract-card" key={category}>
              <h3>{category}<span>{items.length}</span></h3>
              <ul>
                {items.map((item) => <li key={item.title}><Icon>{item.icon}</Icon><div><strong>{item.title}</strong><small>{item.detail}</small></div></li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>}

      <section className="today-section" aria-labelledby="today-title">
        <SectionHeading eyebrow="Your day, at a glance" title="Today, gently organized" action={<button className="link-button" type="button">See calendar <span>→</span></button>} />
        <div className="today-grid">
          <article className="today-card appointments-card">
            <h3><Icon>◷</Icon> Appointments</h3>
            {dashboardData.appointments.map((item) => <div className="appointment-row" key={item.title}><time>{item.time}</time><span className={`time-line ${item.tone}`} /><div><strong>{item.title}</strong><small>{item.person}</small></div></div>)}
          </article>
          <article className="today-card tasks-card">
            <h3><Icon>✓</Icon> Small wins</h3>
            {tasks.map((task, index) => <button className={`task-row ${task.done ? 'complete' : ''}`} onClick={() => toggleTask(index)} type="button" key={task.title}><span className="check">{task.done && '✓'}</span><span><strong>{task.title}</strong><small>{task.note}</small></span></button>)}
          </article>
          <article className="today-card medication-card">
            <h3><Icon>✚</Icon> Medication</h3>
            <button className={`medicine-row ${medicationDone ? 'complete' : ''}`} onClick={() => setMedicationDone((done) => !done)} type="button"><span className="medicine-icon">☀</span><span><strong>{dashboardData.medication.title}</strong><small>{dashboardData.medication.time}</small></span><span className="check">{medicationDone && '✓'}</span></button>
          </article>
          <article className="today-card routines-card">
            <h3><Icon>⌁</Icon> Familiar rhythm</h3>
            {dashboardData.routines.map((routine) => <div className="routine-row" key={routine.time}><time>{routine.time}</time><div><strong>{routine.title}</strong><small>{routine.detail}</small></div></div>)}
          </article>
        </div>
        <aside className="suggestion-card"><div className="soft-icon butter">✦</div><div><p className="eyebrow">A little nudge from AI</p><h3>One thing to make Thursday easier</h3><p>Pack Mansur’s therapy bag on Wednesday evening. It’s one less thing to remember in the rush.</p></div><button type="button" onClick={() => setTasks((items) => [{ title: 'Pack Mansur’s therapy bag', note: 'Wednesday evening', done: false }, ...items])}>Add to plan <span>→</span></button></aside>
      </section>

      <section className="assistant-section card" aria-labelledby="assistant-title">
        <div className="assistant-intro"><div className="assistant-face">✦</div><div><p className="eyebrow">Your planning partner</p><h2 id="assistant-title">Ask your family assistant</h2><p>For the questions you don’t want to keep carrying around.</p></div></div>
        <div className="chat-window" aria-live="polite">
          {chat.map((message, index) => <div className={`message ${message.role}`} key={`${message.text}-${index}`}>{message.role === 'assistant' && <span className="mini-assistant">✦</span>}<p>{message.text}</p></div>)}
        </div>
        <div className="prompt-row">
          {Object.keys(assistantAnswers).slice(0, 3).map((prompt) => <button type="button" key={prompt} onClick={() => askAssistant(prompt)}>{prompt}</button>)}
        </div>
        <form className="chat-input" onSubmit={(event) => { event.preventDefault(); askAssistant(question) }}><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about your family’s week…" aria-label="Ask the family assistant" /><button type="submit" aria-label="Send question">↑</button></form>
      </section>

      <section className="integrations" aria-labelledby="integrations-title">
        <SectionHeading eyebrow="Coming when you’re ready" title="Works with the tools you already use" />
        <div className="integration-grid">
          {[['31', 'Google Calendar', 'Bring your plans together'], ['◐', 'Apple Calendar', 'No second calendar to manage'], ['O', 'Outlook Calendar', 'Keep work and family in view'], ['M', 'Gmail', 'Turn messages into next steps'], ['◉', 'Voice input', 'Capture a thought hands-free']].map(([symbol, name, copy]) => <article className="integration-card" key={name}><span className="integration-logo">{symbol}</span><div><h3>{name}</h3><p>{copy}</p></div><small>Planned</small></article>)}
        </div>
      </section>

      <footer><span className="brand-mark">✦</span> AI Family OS <i>Capture everything. Organize nothing. AI does the rest.</i></footer>
    </main>
  )
}

export default App
