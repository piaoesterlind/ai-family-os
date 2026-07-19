import { useEffect, useRef, useState } from 'react'

const today = new Date()
const currentYear = today.getFullYear()
const currentMonth = today.getMonth()

const demoDate = (offset) => {
  const date = new Date(today)
  date.setDate(today.getDate() + offset)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const initialMembers = [
  { id: 'me', firstName: 'Me', lastName: '', dateOfBirth: '', relationship: 'Me' },
  { id: 'child-1', firstName: 'Child 1', lastName: '', dateOfBirth: '', relationship: 'Child' },
  { id: 'child-2', firstName: 'Child 2', lastName: '', dateOfBirth: '', relationship: 'Child' },
]

const initialEvents = [
  { id: 'event-1', date: demoDate(0), startTime: '07:45', endTime: '08:15', title: 'Kindergarten', category: 'School', memberId: 'child-1', notes: 'Drop-off at the main entrance.' },
  { id: 'event-2', date: demoDate(0), startTime: '08:00', endTime: '08:05', title: 'Vitamin D reminder', category: 'Medication', memberId: 'child-1', notes: 'After breakfast.' },
  { id: 'event-3', date: demoDate(1), startTime: '16:00', endTime: '17:00', title: 'Speech therapy', category: 'Therapy', memberId: 'child-2', notes: 'Bring therapy bag.' },
  { id: 'event-4', date: demoDate(2), startTime: '10:00', endTime: '10:45', title: 'Pediatrician appointment', category: 'Appointment', memberId: 'child-1', notes: 'Location to be confirmed.' },
  { id: 'event-5', date: demoDate(3), startTime: '08:00', endTime: '08:10', title: 'Bring diapers', category: 'Reminder', memberId: 'child-1', notes: 'Leave them by the front door.' },
  { id: 'event-6', date: demoDate(3), startTime: '19:30', endTime: '19:45', title: 'Pack therapy bag', category: 'Reminder', memberId: 'child-2', notes: 'Prepare it for tomorrow.' },
  { id: 'event-7', date: demoDate(5), startTime: '10:30', endTime: '11:30', title: 'Family walk', category: 'Reminder', memberId: 'me', notes: 'Park or forest trail, weather permitting.' },
  { id: 'event-8', date: demoDate(6), startTime: '18:30', endTime: '19:00', title: 'Plan the week', category: 'Reminder', memberId: 'me', notes: 'Review calendar, bags, meals, and school notes.' },
]

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

const categoryStyles = { School: 'teal', Therapy: 'lilac', Appointment: 'coral', Medication: 'sun', Reminder: 'sand' }
const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const emptyMember = { firstName: '', lastName: '', dateOfBirth: '', relationship: 'Child' }

function toIsoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function formatDate(dateString, options = { weekday: 'long', month: 'long', day: 'numeric' }) {
  return new Intl.DateTimeFormat('en-US', options).format(new Date(`${dateString}T12:00:00`))
}

function memberName(member) {
  return member ? `${member.firstName}${member.lastName ? ` ${member.lastName}` : ''}` : 'My Family'
}

function processBrainDump(text) {
  const lines = text.split(/[.!?\n]+/).map((line) => line.trim()).filter(Boolean)
  const result = { Appointments: [], Tasks: [], Medications: [], Routines: [], 'Follow-up questions': [] }

  lines.forEach((line) => {
    const lower = line.toLowerCase()
    const detail = lower.match(/(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|next week|at \d{1,2}(?::\d{2})?)/)?.[0] || 'When should this happen?'

    if (/(appointment|therapy|doctor|pediatrician|dentist|meeting|visit)/.test(lower)) {
      result.Appointments.push({ title: line, detail, icon: '🗓' })
      if (detail === 'When should this happen?') result['Follow-up questions'].push({ title: 'When is this appointment?', detail: line, icon: '?' })
    }
    if (/(remind|remember|bring|pack|buy|order|pick up|call|reply|send)/.test(lower)) result.Tasks.push({ title: line, detail, icon: '✓' })
    if (/(vitamin|medication|medicine|dose|tablet|prescription)/.test(lower)) result.Medications.push({ title: line, detail: 'Check timing and dosage', icon: '💛' })
    if (/(every |daily|routine|morning|evening|bedtime|after breakfast)/.test(lower)) result.Routines.push({ title: line, detail: 'Recurring family rhythm', icon: '⌁' })
  })

  if (!result.Appointments.length && !result.Tasks.length && !result.Medications.length && !result.Routines.length) {
    result.Tasks.push({ title: text.trim(), detail: 'Captured for your family plan', icon: '✦' })
  }

  if (!result['Follow-up questions'].length && /(?:need|should|remember)/i.test(text)) {
    result['Follow-up questions'].push({ title: 'Who is this for?', detail: 'Add a family member when you are ready.', icon: '?' })
  }

  return result
}

function SectionHeading({ eyebrow, title, action }) {
  return <div className="section-heading"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2></div>{action}</div>
}

function Modal({ children, label, onClose, className = '' }) {
  return <div className="modal-backdrop" role="presentation" onClick={onClose}>
    <section className={`modal ${className}`} role="dialog" aria-modal="true" aria-label={label} onClick={(event) => event.stopPropagation()}>
      <button className="close-button" type="button" onClick={onClose} aria-label="Close">×</button>
      {children}
    </section>
  </div>
}

function App() {
  const [members, setMembers] = useState(initialMembers)
  const [selectedMemberId, setSelectedMemberId] = useState('me')
  const [familyMenuOpen, setFamilyMenuOpen] = useState(false)
  const [memberModal, setMemberModal] = useState(null)
  const [memberForm, setMemberForm] = useState(emptyMember)

  const [events, setEvents] = useState(initialEvents)
  const [monthDate, setMonthDate] = useState(new Date(currentYear, currentMonth, 1))
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState(null)
  const [eventModalOpen, setEventModalOpen] = useState(false)
  const [editingEventId, setEditingEventId] = useState(null)
  const [eventForm, setEventForm] = useState({
    title: '',
    date: toIsoDate(today),
    startTime: '09:00',
    endTime: '10:00',
    category: 'Appointment',
    memberId: 'me',
    notes: '',
  })

  const [tasks, setTasks] = useState(initialTasks)
  const [medicationDone, setMedicationDone] = useState(false)

  const [brainDump, setBrainDump] = useState('')
  const [processedData, setProcessedData] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [brainMessage, setBrainMessage] = useState('')
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)

  const [question, setQuestion] = useState('')
  const [chat, setChat] = useState([{ role: 'assistant', text: 'Hi — I’m here to make the day feel lighter. What would you like to plan?' }])

  const selectedMember = members.find((member) => member.id === selectedMemberId) || members[0]

  useEffect(() => () => recognitionRef.current?.stop(), [])

  const week = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() + index)
    const iso = toIsoDate(date)

    return {
      day: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date),
      date: date.getDate(),
      iso,
      events: events.filter((event) => event.date === iso).slice(0, 3),
    }
  })

  const openMemberModal = (mode, member = null) => {
    setMemberModal({ mode, memberId: member?.id })
    setMemberForm(member ? {
      firstName: member.firstName,
      lastName: member.lastName,
      dateOfBirth: member.dateOfBirth,
      relationship: member.relationship,
    } : emptyMember)
    setFamilyMenuOpen(false)
  }

  const saveMember = (event) => {
    event.preventDefault()
    if (!memberForm.firstName.trim()) return

    if (memberModal.mode === 'edit') {
      setMembers((items) => items.map((item) => item.id === memberModal.memberId
        ? { ...item, ...memberForm, firstName: memberForm.firstName.trim() }
        : item))
    } else {
      const member = { id: `member-${Date.now()}`, ...memberForm, firstName: memberForm.firstName.trim() }
      setMembers((items) => [...items, member])
      setSelectedMemberId(member.id)
    }

    setMemberModal(null)
  }

  const toggleVoice = () => {
    if (listening) {
      recognitionRef.current?.stop()
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setBrainMessage('Voice input is not supported by this browser. You can type your thoughts instead.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = true
    recognition.continuous = false

    let receivedTranscript = false

    recognition.onstart = () => {
      setListening(true)
      setBrainMessage('Listening… tap Voice note again to stop.')
    }

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map((result) => result[0].transcript).join(' ').trim()

      if (transcript) {
        receivedTranscript = true
        setBrainDump((value) => `${value}${value ? ' ' : ''}${transcript}`)
        setBrainMessage('Voice note added. You can keep typing or process it with AI.')
      }
    }

    recognition.onerror = () => setBrainMessage('Voice input could not capture your speech. Please try again or type your thought.')

    recognition.onend = () => {
      setListening(false)

      if (!receivedTranscript) {
        setBrainMessage('Voice input could not capture your speech. Please try again or type your thought.')
      }

      recognitionRef.current = null
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const handleProcess = () => {
    if (!brainDump.trim()) {
      setBrainMessage('Add a thought first, then I can organize it for you.')
      setProcessedData(null)
      return
    }

    setProcessing(true)
    setBrainMessage('')

    setTimeout(() => {
      setProcessedData(processBrainDump(brainDump))
      setProcessing(false)
    }, 500)
  }

  const monthCells = () => {
    const year = monthDate.getFullYear()
    const month = monthDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const offset = (firstDay.getDay() + 6) % 7
    const days = new Date(year, month + 1, 0).getDate()

    return [...Array(offset).fill(null), ...Array.from({ length: days }, (_, index) => new Date(year, month, index + 1))]
  }

  const openEventForm = () => {
    setEventForm({
      title: '',
      date: selectedDay || toIsoDate(today),
      startTime: '09:00',
      endTime: '10:00',
      category: 'Appointment',
      memberId: selectedMemberId,
      notes: '',
    })
    setEditingEventId(null)
    setEventModalOpen(true)
  }

  const openEditEvent = (event) => {
    setEventForm({
      title: event.title,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      category: event.category,
      memberId: event.memberId,
      notes: event.notes,
    })
    setEditingEventId(event.id)
    setEventModalOpen(true)
  }

  const saveEvent = (event) => {
    event.preventDefault()
    if (!eventForm.title.trim()) return

    if (editingEventId) {
      setEvents((items) => items.map((item) => item.id === editingEventId
        ? { ...item, ...eventForm, title: eventForm.title.trim() }
        : item))
    } else {
      setEvents((items) => [...items, {
        ...eventForm,
        id: `event-${Date.now()}`,
        title: eventForm.title.trim(),
      }])
    }

    setSelectedDay(eventForm.date)
    setEventModalOpen(false)
    setEditingEventId(null)
  }

  const deleteEvent = () => {
    if (!editingEventId || !window.confirm('Delete this event? This only removes it from the local demo.')) return

    setEvents((items) => items.filter((item) => item.id !== editingEventId))
    setEventModalOpen(false)
    setEditingEventId(null)
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
      <a className="brand" href="#top" aria-label="AI Family OS home">
        <span className="brand-mark">✦</span>
        <span>AI Family <em>OS</em></span>
      </a>

      <div className="family-control">
        <button className="family-button" type="button" onClick={() => setFamilyMenuOpen((value) => !value)} aria-expanded={familyMenuOpen}>
          <span className="avatar-stack"><i>{selectedMember.firstName.slice(0, 1)}</i></span>
          <span>My Family</span>
          <b>⌄</b>
        </button>

        {familyMenuOpen && <div className="family-menu">
          {members.map((member) => <div className={`family-menu-row ${member.id === selectedMemberId ? 'active' : ''}`} key={member.id}>
            <button type="button" onClick={() => { setSelectedMemberId(member.id); setFamilyMenuOpen(false) }}>
              <span className="member-dot">{member.firstName.slice(0, 1)}</span>
              <span><strong>{memberName(member)}</strong><small>{member.relationship}</small></span>
            </button>

            <button className="edit-member" type="button" onClick={() => openMemberModal('edit', member)} aria-label={`Edit ${memberName(member)}`}>✎</button>
          </div>)}

          <button className="add-member-button" type="button" onClick={() => openMemberModal('add')}>＋ Add Family Member</button>
        </div>}
      </div>
    </nav>

    <section id="top" className="hero">
      <p className="eyebrow">{formatDate(toIsoDate(today), { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      <h1>Good morning.<br /><span>Your family is in good hands.</span></h1>
      <p className="tagline">Capture everything. Organize nothing. AI does the rest.</p>
    </section>

    <section className="calendar-section">
      <SectionHeading
        eyebrow="The next seven days"
        title="What’s coming up"
        action={<button className="outline-button" type="button" onClick={() => setCalendarOpen(true)}>Open Calendar <span>→</span></button>}
      />

      <div className="weekly-calendar">
        {week.map((day, index) => <article className={`day-card ${index === 0 ? 'today' : ''}`} key={day.iso}>
          <header><span>{day.day}</span><strong>{day.date}</strong></header>

          <div className="day-events">
            {day.events.length
              ? day.events.map((event) => <div className={`calendar-event ${categoryStyles[event.category]}`} key={event.id}><time>{event.startTime}</time><span>{event.title}</span></div>)
              : <span className="clear-day">A quiet day</span>}
          </div>
        </article>)}
      </div>

      <p className="calendar-note">A gentle view of the plans and routines that matter most.</p>
    </section>

    <section className="tasks-section">
      <SectionHeading eyebrow="Small steps, lighter day" title="Tasks & to-dos" action={<span className="count-pill">{tasks.filter((task) => !task.done).length} to do</span>} />

      <div className="task-list">
        {tasks.map((task, index) => <button className={`task-row ${task.done ? 'complete' : ''}`} onClick={() => setTasks((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, done: !item.done } : item))} type="button" key={task.title}>
          <span className="check">{task.done && '✓'}</span>
          <span className="task-copy"><strong>{task.title}</strong><small>{task.note}</small></span>
          <span className={`source-badge ${task.tone}`}>{task.source}</span>
        </button>)}
      </div>

      <p className="connection-note">Ready for future connections to Todoist, Apple Reminders, Microsoft To Do, and Google Tasks.</p>
    </section>

    <section className="signals-section" aria-label="Family signals">
      <article className="overview-card medication-card">
        <div className="card-heading"><span className="mini-icon sun">☀</span><h3>Medication</h3></div>
        <button className={`medicine-row ${medicationDone ? 'complete' : ''}`} onClick={() => setMedicationDone((done) => !done)} type="button">
          <span className="check">{medicationDone && '✓'}</span>
          <span><strong>Vitamin D for Child 1</strong><small>After breakfast · daily</small></span>
        </button>
        <p>One reminder for today</p>
      </article>

      <article className="overview-card">
        <div className="card-heading"><span className="mini-icon teal">⌁</span><h3>Routines</h3></div>
        <div className="routine-row"><time>07:15</time><span><strong>Morning launch</strong><small>Breakfast · bags · jackets</small></span></div>
        <div className="routine-row"><time>19:00</time><span><strong>Wind-down</strong><small>Bath · stories · lights low</small></span></div>
      </article>

      <article className="overview-card inbox-card">
        <div className="card-heading"><span className="mini-icon coral">✉</span><h3>Inbox signals</h3><span className="signal-count">2</span></div>
        <div className="signal"><strong>Kindergarten email detected</strong><small>Bring diapers by Thursday</small></div>
        <div className="signal"><strong>Therapy update needs review</strong><small>New appointment detail found</small></div>
      </article>
    </section>

    <section className="brain-dump card" aria-labelledby="dump-title">
      <div className="brain-dump-intro">
        <div className="soft-icon teal">✦</div>
        <div>
          <p className="eyebrow">Your family brain</p>
          <h2 id="dump-title">What’s on your mind?</h2>
          <p>Type or speak anything on your mind. AI Family OS will organize it.</p>
        </div>
      </div>

      <div className={`input-shell ${listening ? 'listening' : ''}`}>
        <textarea value={brainDump} onChange={(event) => setBrainDump(event.target.value)} placeholder="Tell me what’s on your mind…" aria-label="Brain dump" />

        <div className="input-actions">
          <button className={`voice-button ${listening ? 'active' : ''}`} onClick={toggleVoice} type="button" aria-pressed={listening}>◉ {listening ? 'Stop listening' : 'Voice note'}</button>
          <button className="primary-button" onClick={handleProcess} type="button" disabled={processing}>✦ {processing ? 'Finding the threads…' : 'Process with AI'}</button>
        </div>
      </div>

      {brainMessage && <p className="brain-message">{brainMessage}</p>}
    </section>

    {processedData && <section className="ai-result">
      <SectionHeading eyebrow="A calmer view" title="Here’s what I found" action={<span className="ai-badge">✦ Mock AI processing</span>} />

      <div className="extracted-grid">
        {Object.entries(processedData).map(([category, items]) => <article className="extract-card" key={category}>
          <h3>{category}<span>{items.length}</span></h3>
          {items.length
            ? <ul>{items.map((item, index) => <li key={`${item.title}-${index}`}><span className="item-icon">{item.icon}</span><div><strong>{item.title}</strong><small>{item.detail}</small></div></li>)}</ul>
            : <p className="empty-output">Nothing found here yet.</p>}
        </article>)}
      </div>
    </section>}

    <section className="assistant-section card" aria-labelledby="assistant-title">
      <div className="assistant-intro">
        <div className="assistant-face">✦</div>
        <div><p className="eyebrow">Your planning partner</p><h2 id="assistant-title">Ask your family assistant</h2><p>For the questions you don’t want to keep carrying around.</p></div>
      </div>

      <div className="chat-window" aria-live="polite">
        {chat.map((message, index) => <div className={`message ${message.role}`} key={`${message.text}-${index}`}>{message.role === 'assistant' && <span className="mini-assistant">✦</span>}<p>{message.text}</p></div>)}
      </div>

      <div className="prompt-row">{Object.keys(assistantAnswers).map((prompt) => <button type="button" key={prompt} onClick={() => askAssistant(prompt)}>{prompt}</button>)}</div>

      <form className="chat-input" onSubmit={(event) => { event.preventDefault(); askAssistant(question) }}>
        <input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about your family’s week…" aria-label="Ask the family assistant" />
        <button type="submit" aria-label="Send question">↑</button>
      </form>
    </section>

    <section className="integrations">
      <SectionHeading eyebrow="Coming when you’re ready" title="Works with the tools you already use" />
      <div className="integration-grid">
        {[['31', 'Google Calendar'], ['◐', 'Apple Calendar'], ['O', 'Outlook Calendar'], ['M', 'Gmail'], ['✓', 'Todoist'], ['◌', 'Apple Reminders'], ['□', 'Microsoft To Do'], ['◉', 'Voice input']].map(([symbol, name]) => <article className="integration-card" key={name}><span className="integration-logo">{symbol}</span><h3>{name}</h3><small>Planned</small></article>)}
      </div>
    </section>

    {memberModal && <Modal label={memberModal.mode === 'add' ? 'Add family member' : 'Edit family member'} onClose={() => setMemberModal(null)}>
      <p className="eyebrow">My Family</p>
      <h2>{memberModal.mode === 'add' ? 'Add a family member' : 'Edit family member'}</h2>

      <form className="form-stack" onSubmit={saveMember}>
        <label>First name<input required value={memberForm.firstName} onChange={(event) => setMemberForm({ ...memberForm, firstName: event.target.value })} /></label>
        <label>Last name<input value={memberForm.lastName} onChange={(event) => setMemberForm({ ...memberForm, lastName: event.target.value })} /></label>
        <label>Date of birth<input type="date" value={memberForm.dateOfBirth} onChange={(event) => setMemberForm({ ...memberForm, dateOfBirth: event.target.value })} /></label>
        <label>Relationship<select value={memberForm.relationship} onChange={(event) => setMemberForm({ ...memberForm, relationship: event.target.value })}><option>Me</option><option>Partner</option><option>Child</option><option>Other</option></select></label>
        <button className="primary-button form-submit" type="submit">Save family member</button>
      </form>
    </Modal>}

    {calendarOpen && <Modal label="Calendar" className="calendar-modal" onClose={() => setCalendarOpen(false)}>
      <p className="eyebrow">Calendar preview</p>

      <div className="month-title">
        <button type="button" onClick={() => setMonthDate(new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, 1))} aria-label="Previous month">←</button>
        <h2>{new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(monthDate)}</h2>
        <button type="button" onClick={() => setMonthDate(new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1))} aria-label="Next month">→</button>
      </div>

      <div className="month-grid">
        <div className="month-weekdays">{weekdays.map((day) => <span key={day}>{day}</span>)}</div>

        <div className="month-days">
          {monthCells().map((date, index) => {
            if (!date) return <span className="blank-day" key={`blank-${index}`} />

            const iso = toIsoDate(date)
            const dayEvents = events.filter((event) => event.date === iso)
            const isToday = iso === toIsoDate(today)

            return <button className={`month-day ${isToday ? 'today' : ''}`} type="button" onClick={() => setSelectedDay(iso)} key={iso}>
              <strong>{date.getDate()}</strong>
              <span className="event-dots">{dayEvents.slice(0, 4).map((event) => <i className={categoryStyles[event.category]} key={event.id} />)}</span>
            </button>
          })}
        </div>
      </div>

      <p className="calendar-instruction">Tap any day to see its plans and reminders.</p>
    </Modal>}

    {selectedDay && <Modal label={`Plans for ${formatDate(selectedDay)}`} className="day-modal" onClose={() => setSelectedDay(null)}>
      <p className="eyebrow">Day details</p>
      <h2>{formatDate(selectedDay)}</h2>

      <div className="day-detail-events">
        {events.filter((event) => event.date === selectedDay).length
          ? events.filter((event) => event.date === selectedDay).sort((a, b) => a.startTime.localeCompare(b.startTime)).map((event) => <button className="detail-event" type="button" onClick={() => openEditEvent(event)} key={event.id}>
            <span className={`event-dot ${categoryStyles[event.category]}`} />
            <div>
              <time>{event.startTime}–{event.endTime}</time>
              <strong>{event.title}</strong>
              <small>{event.category} · {memberName(members.find((member) => member.id === event.memberId))}</small>
              {event.notes && <p>{event.notes}</p>}
            </div>
          </button>)
          : <p className="empty-day">Nothing planned yet. Enjoy the breathing room.</p>}
      </div>

      <button className="primary-button form-submit" type="button" onClick={openEventForm}>＋ Add Event</button>
    </Modal>}

    {eventModalOpen && <Modal label={editingEventId ? 'Edit event' : 'Add event'} onClose={() => { setEventModalOpen(false); setEditingEventId(null) }}>
      <p className="eyebrow">Calendar</p>
      <h2>{editingEventId ? 'Edit event' : 'Add an event'}</h2>

      <form className="form-stack" onSubmit={saveEvent}>
        <label>Event title<input required value={eventForm.title} onChange={(event) => setEventForm({ ...eventForm, title: event.target.value })} placeholder="e.g. Dentist appointment" /></label>

        <div className="form-two-columns">
          <label>Date<input required type="date" value={eventForm.date} onChange={(event) => setEventForm({ ...eventForm, date: event.target.value })} /></label>
          <label>Family member<select value={eventForm.memberId} onChange={(event) => setEventForm({ ...eventForm, memberId: event.target.value })}>{members.map((member) => <option value={member.id} key={member.id}>{memberName(member)}</option>)}</select></label>
        </div>

        <div className="form-two-columns">
          <label>Start time<input required type="time" value={eventForm.startTime} onChange={(event) => setEventForm({ ...eventForm, startTime: event.target.value })} /></label>
          <label>End time<input required type="time" value={eventForm.endTime} onChange={(event) => setEventForm({ ...eventForm, endTime: event.target.value })} /></label>
        </div>

        <label>Category<select value={eventForm.category} onChange={(event) => setEventForm({ ...eventForm, category: event.target.value })}>{Object.keys(categoryStyles).map((category) => <option key={category}>{category}</option>)}</select></label>
        <label>Notes <span>(optional)</span><textarea value={eventForm.notes} onChange={(event) => setEventForm({ ...eventForm, notes: event.target.value })} /></label>

        <button className="primary-button form-submit" type="submit">{editingEventId ? 'Save changes' : 'Save event'}</button>
        {editingEventId && <button className="delete-button" type="button" onClick={deleteEvent}>Delete Event</button>}
      </form>
    </Modal>}

    <footer><span className="brand-mark">✦</span> AI Family OS <i>Capture everything. Organize nothing. AI does the rest.</i></footer>
  </main>
}

export default App
