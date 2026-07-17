import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import spoilerCat from '../assets/spolier-alert-cat.jpg'
import stairSkipping from '../assets/stair-skipping.jpg'
import thankYou from '../assets/thank-you-chatgpt.jpeg'
import {
  AgentLoopVisual,
  AutoregressionVisual,
  CompactionVisual,
  ContextWindowVisual,
  MemoryGapVisual,
  RetrievalVisual,
} from './components/Mechanisms'

type TraceTone = 'plain' | 'context' | 'signal' | 'alert' | 'muted'

type TraceSegment = {
  label: string
  tone?: TraceTone
  crossed?: boolean
}

type SlideDefinition = {
  section: string
  railTitle: string
  trace: TraceSegment[]
  content: ReactNode
}

const slides: SlideDefinition[] = [
  {
    section: 'OPENING QUESTION',
    railTitle: 'Hold your answer',
    trace: [{ label: 'user · How does AI remember?', tone: 'plain' }],
    content: (
      <section className="slide slide--title centered-slide">
        <p className="eyebrow">A QUESTION FOR THE ROOM</p>
        <h1>
          How does AI
          <span className="marker-underline"> remember?</span>
        </h1>
        <p className="lede">Hold your answer. We’ll rebuild it from the smallest unit up.</p>
        <div className="title-stamp">LLMs / AGENTS / THE ILLUSION BETWEEN THEM</div>
      </section>
    ),
  },
  {
    section: 'THE REVEAL',
    railTitle: 'Spoiler alert',
    trace: [{ label: 'user · How does AI remember?', tone: 'plain' }],
    content: (
      <section className="slide centered-slide image-slide">
        <div className="projected-photo projected-photo--wide">
          <img src={spoilerCat} alt="A surprised cat dressed as Darth Vader with the words Spoiler Alert" />
          <span className="photo-index">EXHIBIT A</span>
        </div>
      </section>
    ),
  },
  {
    section: 'THE REVEAL',
    railTitle: 'The claim',
    trace: [{ label: 'current input only', tone: 'alert' }],
    content: (
      <section className="slide centered-slide quote-slide">
        <p className="eyebrow">THE SHORT ANSWER</p>
        <blockquote>
          “LLMs do not
          <span> remember anything.”</span>
        </blockquote>
        <p className="definition-note">Not between independent calls. The continuity lives around the model.</p>
      </section>
    ),
  },
  {
    section: 'A SMALL DETOUR',
    railTitle: 'Language before machinery',
    trace: [
      { label: 'metaphor', tone: 'muted' },
      { label: '→' },
      { label: 'mental model', tone: 'context' },
    ],
    content: (
      <section className="slide literature-slide">
        <div className="projected-photo projected-photo--portrait">
          <img src={stairSkipping} alt="A meme about skipping literature and falling while rushing toward engineering" />
          <span className="photo-index">FIG. 04</span>
        </div>
        <div className="literature-copy">
          <p className="eyebrow">BEFORE THE ENGINEERING</p>
          <h1>Let’s not do that.</h1>
          <p>
            The words we choose smuggle a theory of mind into a software diagram.
          </p>
          <p className="literary-aside">First, a few minutes of literature.</p>
        </div>
      </section>
    ),
  },
  {
    section: 'LINGUISTIC DECEPTION',
    railTitle: 'Industry and media jargon',
    trace: [
      { label: '“the AI remembers…”', tone: 'alert', crossed: true },
      { label: 'show the mechanism', tone: 'context' },
    ],
    content: (
      <section className="slide jargon-slide">
        <header className="slide-heading slide-heading--split">
          <div>
            <p className="eyebrow">LINGUISTIC DECEPTION</p>
            <h1>Metaphor quietly becomes mechanism.</h1>
          </div>
          <p>
            <strong>Anthropomorphism</strong> is our tendency to assign human traits to non-human things.
          </p>
        </header>
        <div className="jargon-table" role="table" aria-label="Anthropomorphic AI phrases and what they imply">
          <div className="jargon-row jargon-row--header" role="row">
            <span role="columnheader">ANTHROPOMORPHIC PHRASE</span>
            <span role="columnheader">WHAT THE METAPHOR SUGGESTS</span>
          </div>
          {[
            ['“The AI hallucinated.”', 'A sensory error or lapse in knowledge.'],
            ['“The AI decided…”', 'Agency that weighed options and chose.'],
            ['“The model understands…”', 'A conceptual grasp of reality.'],
            ['“The AI remembers…”', 'A persistent mental archive and identity over time.'],
          ].map(([phrase, implication], index) => (
            <div className={`jargon-row ${index === 3 ? 'jargon-row--focus' : ''}`} role="row" key={phrase}>
              <strong role="cell">{phrase}</strong>
              <span role="cell">{implication}</span>
            </div>
          ))}
        </div>
      </section>
    ),
  },
  {
    section: 'FIRST PRINCIPLES',
    railTitle: 'The stateless model',
    trace: [
      { label: 'input tokens', tone: 'plain' },
      { label: 'model', tone: 'signal' },
      { label: 'next token', tone: 'signal' },
    ],
    content: (
      <section className="slide stateless-slide">
        <header className="slide-heading">
          <p className="eyebrow">STRIP AWAY THE METAPHOR</p>
          <h1>The model answers the input in front of it.</h1>
        </header>
        <div className="inference-line">
          <div className="inference-box">
            <span>THIS CALL</span>
            <strong>[ input tokens ]</strong>
          </div>
          <span className="large-arrow" aria-hidden="true">→</span>
          <div className="model-box">
            <span>FIXED WEIGHTS</span>
            <strong>LANGUAGE MODEL</strong>
          </div>
          <span className="large-arrow" aria-hidden="true">→</span>
          <div className="inference-box inference-box--signal">
            <span>PREDICTION</span>
            <strong>[ next token ]</strong>
          </div>
        </div>
        <div className="stamp-row">
          <span>NO DIARY</span>
          <span>NO CHAT ARCHIVE</span>
          <span>NO PAST TURN—UNLESS IT IS SENT AGAIN</span>
        </div>
      </section>
    ),
  },
  {
    section: 'FIRST PRINCIPLES',
    railTitle: 'The autoregressive loop',
    trace: [
      { label: 'A', tone: 'plain' },
      { label: 'memory', tone: 'plain' },
      { label: 'is', tone: 'plain' },
      { label: 'just', tone: 'plain' },
      { label: '…next token', tone: 'signal' },
    ],
    content: (
      <section className="slide mechanism-slide">
        <header className="slide-heading slide-heading--inline">
          <div>
            <p className="eyebrow">AUTOREGRESSION</p>
            <h1>Predict. Attach. Continue.</h1>
          </div>
          <p>One response is assembled one token at a time.</p>
        </header>
        <AutoregressionVisual />
      </section>
    ),
  },
  {
    section: 'THE PROVIDER LAYER',
    railTitle: 'The loop gets hidden',
    trace: [
      { label: 'prompt', tone: 'plain' },
      { label: 'inference engine', tone: 'signal' },
      { label: 'message', tone: 'signal' },
    ],
    content: (
      <section className="slide provider-slide">
        <header className="slide-heading">
          <p className="eyebrow">A USEFUL ABSTRACTION</p>
          <h1>You usually never touch that loop.</h1>
          <p>The provider or inference engine runs it and gives you a higher-level API.</p>
        </header>
        <div className="provider-flow">
          <div className="provider-input">
            <span>INPUT</span>
            <strong>prompt</strong>
          </div>
          <div className="provider-engine">
            <span>UNDER THE HOOD</span>
            <strong>predict ↻ append ↻ repeat</strong>
            <small>provider / vLLM / serving engine</small>
          </div>
          <div className="provider-outputs">
            <div>
              <span>RESPONSE</span>
              <strong>whole message</strong>
            </div>
            <div>
              <span>STREAM</span>
              <strong>token · token · token…</strong>
            </div>
          </div>
        </div>
      </section>
    ),
  },
  {
    section: 'PROMPT CONSTRUCTION',
    railTitle: 'Messages and roles',
    trace: [
      { label: 'system', tone: 'context' },
      { label: 'user', tone: 'plain' },
      { label: 'assistant', tone: 'signal' },
      { label: 'tool', tone: 'muted' },
    ],
    content: (
      <section className="slide roles-slide">
        <header className="slide-heading slide-heading--inline">
          <div>
            <p className="eyebrow">THE PROMPT, DECOMPOSED</p>
            <h1>A prompt becomes a list of messages.</h1>
          </div>
          <p>Each message pairs a role with content.</p>
        </header>
        <div className="roles-layout">
          <div className="role-ledger">
            {[
              ['system', 'rules and framing', 'context'],
              ['user', 'what the person said', 'plain'],
              ['assistant', 'what the model said', 'signal'],
              ['tool', 'structured input or output for code', 'muted'],
            ].map(([role, detail, tone]) => (
              <div className={`role-row role-row--${tone}`} key={role}>
                <strong>{role}</strong>
                <span>{detail}</span>
              </div>
            ))}
          </div>
          <div className="prompt-sheet">
            <div className="card-label">CONSTRUCTED PROMPT</div>
            <div className="prompt-message prompt-message--system"><b>system</b> Be concise.</div>
            <div className="prompt-message prompt-message--user"><b>user</b> What can you do?</div>
            <div className="prompt-message prompt-message--assistant"><b>assistant</b> Answer and call tools.</div>
            <div className="prompt-message prompt-message--tool"><b>tool</b> {`{ "status": "ok" }`}</div>
          </div>
        </div>
      </section>
    ),
  },
  {
    section: 'THE HARNESS',
    railTitle: 'History creates continuity',
    trace: [
      { label: 'system', tone: 'context' },
      { label: 'turn 1', tone: 'plain' },
      { label: 'turn 2', tone: 'plain' },
      { label: 'new input', tone: 'plain' },
    ],
    content: (
      <section className="slide mechanism-slide">
        <header className="slide-heading slide-heading--inline">
          <div>
            <p className="eyebrow">THE AGENT LOOP</p>
            <h1>History is resent, turn after turn.</h1>
          </div>
          <p>The list grows in stateful software outside the model.</p>
        </header>
        <AgentLoopVisual />
      </section>
    ),
  },
  {
    section: 'THE HARD LIMIT',
    railTitle: 'Context fills up',
    trace: [
      { label: 'old history', tone: 'context' },
      { label: 'recent history', tone: 'plain' },
      { label: 'overflow', tone: 'alert' },
    ],
    content: (
      <section className="slide mechanism-slide">
        <header className="slide-heading slide-heading--inline">
          <div>
            <p className="eyebrow">THE CONTEXT WINDOW</p>
            <h1>The notebook does not fit forever.</h1>
          </div>
          <p>Every model call has a finite token budget.</p>
        </header>
        <ContextWindowVisual />
      </section>
    ),
  },
  {
    section: 'THE NAIVE FIX',
    railTitle: 'Drop old messages',
    trace: [
      { label: 'old constraint', tone: 'alert', crossed: true },
      { label: 'recent turn', tone: 'plain' },
      { label: 'wrong answer', tone: 'alert' },
    ],
    content: (
      <section className="slide mechanism-slide">
        <header className="slide-heading slide-heading--inline">
          <div>
            <p className="eyebrow">KEEP THE LAST N</p>
            <h1>It fits. The illusion breaks.</h1>
          </div>
          <p>A missing instruction cannot affect the response.</p>
        </header>
        <MemoryGapVisual />
      </section>
    ),
  },
  {
    section: 'MEMORY PRIMITIVE 01',
    railTitle: 'Rolling summarization',
    trace: [
      { label: 'compacted summary', tone: 'context' },
      { label: 'recent turns', tone: 'plain' },
      { label: 'new input', tone: 'plain' },
    ],
    content: (
      <section className="slide mechanism-slide">
        <header className="slide-heading slide-heading--inline">
          <div>
            <p className="eyebrow">ROLLING SUMMARIZATION</p>
            <h1>Compress, carry forward, repeat.</h1>
          </div>
          <p>A second model call turns old chat into the next prompt’s summary.</p>
        </header>
        <CompactionVisual />
      </section>
    ),
  },
  {
    section: 'MEMORY PRIMITIVE 02',
    railTitle: 'Retrieve what matters',
    trace: [
      { label: 'new query', tone: 'plain' },
      { label: 'relevant notes', tone: 'context' },
      { label: 'current call', tone: 'signal' },
    ],
    content: (
      <section className="slide mechanism-slide">
        <header className="slide-heading slide-heading--inline">
          <div>
            <p className="eyebrow">RETRIEVAL / RAG</p>
            <h1>Index the library. Retrieve a slice.</h1>
          </div>
          <p>Semantic search is a context-selection pipeline, not memory inside the model.</p>
        </header>
        <RetrievalVisual />
      </section>
    ),
  },
  {
    section: 'THE FULL MECHANISM',
    railTitle: 'What actually reaches the model',
    trace: [
      { label: 'instructions', tone: 'context' },
      { label: 'summary', tone: 'context' },
      { label: 'retrieved notes', tone: 'context' },
      { label: 'recent turns', tone: 'plain' },
      { label: 'new input', tone: 'plain' },
    ],
    content: (
      <section className="slide assembled-slide">
        <header className="slide-heading slide-heading--inline">
          <div>
            <p className="eyebrow">THE HIDDEN PROMPT</p>
            <h1>“Memory” is context assembly.</h1>
          </div>
          <p>The harness prepares a fresh packet for every call.</p>
        </header>
        <div className="assembly-map">
          <div className="context-packet">
            {[
              ['01', 'SYSTEM INSTRUCTIONS', 'Rules for this session', 'context'],
              ['02', 'COMPACTED HISTORY', 'What survived summarization', 'context'],
              ['03', 'RETRIEVED NOTES', 'What looked relevant now', 'context'],
              ['04', 'RECENT MESSAGES', 'Verbatim conversational turns', 'plain'],
              ['05', 'CURRENT USER INPUT', 'The request being answered', 'plain'],
            ].map(([number, label, detail, tone]) => (
              <div className={`packet-row packet-row--${tone}`} key={number}>
                <span>{number}</span>
                <strong>{label}</strong>
                <p>{detail}</p>
              </div>
            ))}
          </div>
          <div className="assembly-arrow">
            <span aria-hidden="true">→</span>
            <small>this call only</small>
          </div>
          <div className="fresh-model">
            <span>STATELESS CORE</span>
            <strong>MODEL</strong>
            <p>Responds to the assembled input.</p>
            <div>next call starts here again</div>
          </div>
        </div>
      </section>
    ),
  },
  {
    section: 'THE ANSWER',
    railTitle: 'Name the layers correctly',
    trace: [
      { label: 'stateful harness', tone: 'context' },
      { label: '+' },
      { label: 'stateless model', tone: 'signal' },
      { label: '=' },
      { label: 'perceived memory', tone: 'plain' },
    ],
    content: (
      <section className="slide answer-slide">
        <p className="eyebrow">SO, HOW DOES AI REMEMBER?</p>
        <h1>It doesn’t—<span>the software keeps the notes.</span></h1>
        <div className="answer-equation">
          <div className="equation-part equation-part--signal">
            <span>EVERY CALL</span>
            <strong>stateless model</strong>
          </div>
          <b>+</b>
          <div className="equation-part equation-part--context">
            <span>BETWEEN CALLS</span>
            <strong>stateful harness</strong>
          </div>
          <b>=</b>
          <div className="equation-part">
            <span>TO THE USER</span>
            <strong>perceived memory</strong>
          </div>
        </div>
        <p className="answer-note">History · compaction · retrieval · prompt construction</p>
      </section>
    ),
  },
  {
    section: 'CLOSE',
    railTitle: 'Keep saying thank you',
    trace: [
      { label: 'user · thank you', tone: 'plain' },
      { label: 'assistant · you’re welcome', tone: 'signal' },
    ],
    content: (
      <section className="slide closing-slide">
        <div className="closing-copy">
          <p className="eyebrow">ONE LAST ANTHROPOMORPHISM</p>
          <h1>You can still say thank you.</h1>
          <p>Just know which part kept the notes.</p>
          <div className="closing-takeaway">MODEL ≠ MEMORY &nbsp;·&nbsp; CONTEXT CREATES CONTINUITY</div>
        </div>
        <div className="projected-photo projected-photo--square">
          <img src={thankYou} alt="A man saying thank you to ChatGPT in case AI takes over the world" />
          <span className="photo-index">END OF TAPE</span>
        </div>
      </section>
    ),
  },
]

function parseSlideHash() {
  const match = window.location.hash.match(/slide-(\d+)/)
  const requested = match ? Number(match[1]) - 1 : 0
  return Math.min(slides.length - 1, Math.max(0, Number.isFinite(requested) ? requested : 0))
}

function PromptTrace({ segments }: { segments: TraceSegment[] }) {
  return (
    <aside className="prompt-trace" aria-label="What reaches the model on this slide">
      <span className="trace-label">MODEL INPUT / THIS TURN</span>
      <div className="trace-segments">
        {segments.map((segment, index) => (
          <span
            className={`trace-segment trace-segment--${segment.tone ?? 'plain'} ${segment.crossed ? 'is-crossed' : ''}`}
            key={`${segment.label}-${index}`}
          >
            {segment.label}
          </span>
        ))}
      </div>
      <span className="trace-end" aria-hidden="true">→ MODEL</span>
    </aside>
  )
}

function App() {
  const [slideIndex, setSlideIndex] = useState(parseSlideHash)
  const touchStart = useRef<number | null>(null)

  const goTo = useCallback((next: number) => {
    const clamped = Math.min(slides.length - 1, Math.max(0, next))
    setSlideIndex(clamped)
    window.history.replaceState(null, '', `#slide-${clamped + 1}`)
  }, [])

  const previous = useCallback(() => goTo(slideIndex - 1), [goTo, slideIndex])
  const next = useCallback(() => goTo(slideIndex + 1), [goTo, slideIndex])

  useEffect(() => {
    document.title = `${String(slideIndex + 1).padStart(2, '0')} · ${slides[slideIndex].railTitle} — How does AI remember?`
  }, [slideIndex])

  useEffect(() => {
    const onHashChange = () => setSlideIndex(parseSlideHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return
      if (event.key === ' ' && target?.closest('button, a')) return

      if (['ArrowRight', 'PageDown', ' '].includes(event.key)) {
        event.preventDefault()
        next()
      } else if (['ArrowLeft', 'PageUp'].includes(event.key)) {
        event.preventDefault()
        previous()
      } else if (event.key === 'Home') {
        event.preventDefault()
        goTo(0)
      } else if (event.key === 'End') {
        event.preventDefault()
        goTo(slides.length - 1)
      } else if (event.key.toLowerCase() === 'f') {
        event.preventDefault()
        if (document.fullscreenElement) void document.exitFullscreen()
        else void document.documentElement.requestFullscreen()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goTo, next, previous])

  const activeSlide = slides[slideIndex]

  return (
    <div
      className="deck"
      onTouchStart={(event) => {
        touchStart.current = event.changedTouches[0]?.clientX ?? null
      }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return
        const delta = (event.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current
        if (delta < -55) next()
        if (delta > 55) previous()
        touchStart.current = null
      }}
    >
      <header className="top-rail">
        <div className="rail-section"><span>SECTION</span>{activeSlide.section}</div>
        <div className="rail-title">{activeSlide.railTitle}</div>
        <div className="rail-count">
          <strong>{String(slideIndex + 1).padStart(2, '0')}</strong>
          <span>/ {String(slides.length).padStart(2, '0')}</span>
        </div>
      </header>

      <main className="slide-stage" aria-live="polite">
        <div className="slide-enter" key={slideIndex}>
          {activeSlide.content}
        </div>
      </main>

      <PromptTrace segments={activeSlide.trace} />

      <footer className="transport" aria-label="Presentation controls">
        <button type="button" onClick={previous} disabled={slideIndex === 0} aria-label="Previous slide">
          ← previous
        </button>
        <div className="transport-hint">ARROWS / SPACE TO NAVIGATE &nbsp;·&nbsp; F FOR FULLSCREEN</div>
        <button type="button" onClick={next} disabled={slideIndex === slides.length - 1} aria-label="Next slide">
          next →
        </button>
      </footer>
    </div>
  )
}

export default App
