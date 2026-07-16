import { useEffect, useState } from 'react'

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return reduced
}

function usePlayback(max: number, interval = 900) {
  const reduced = useReducedMotion()
  const [step, setStep] = useState(0)
  const [run, setRun] = useState(0)

  useEffect(() => {
    if (reduced) {
      setStep(max)
      return
    }

    setStep(0)
    const timer = window.setInterval(() => {
      setStep((current) => {
        if (current >= max) {
          window.clearInterval(timer)
          return current
        }
        return current + 1
      })
    }, interval)

    return () => window.clearInterval(timer)
  }, [interval, max, reduced, run])

  return { step, replay: () => setRun((current) => current + 1) }
}

function ReplayButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="replay" type="button" onClick={onClick}>
      replay mechanism
    </button>
  )
}

const inputTokens = ['A', 'memory', 'is', 'just']
const outputTokens = ['a', 'token', 'at', 'a', 'time', '<STOP>']

export function AutoregressionVisual() {
  const { step, replay } = usePlayback(outputTokens.length * 3, 660)
  const finished = step >= outputTokens.length * 3
  const cycle = Math.min(Math.floor(step / 3), outputTokens.length - 1)
  const phase = finished ? 2 : step % 3
  const appended = finished
    ? outputTokens.length
    : Math.min(outputTokens.length, cycle + (phase >= 1 ? 1 : 0))
  const currentToken = outputTokens[cycle]
  const phaseLabels = ['predict one token', 'append it', 'continue from the longer sequence']

  return (
    <div className="mechanism autoregression">
      <div className="token-runway" aria-label="Growing token sequence">
        {[...inputTokens, ...outputTokens.slice(0, appended)].map((token, index) => {
          const generated = index >= inputTokens.length
          const isNewest = generated && index === inputTokens.length + appended - 1
          return (
            <span
              className={`token ${generated ? 'token--signal' : ''} ${token === '<STOP>' ? 'token--alert' : ''} ${isNewest ? 'token--new' : ''}`}
              key={`${token}-${index}`}
            >
              {token}
            </span>
          )
        })}
        {!finished && phase === 0 && <span className="token token--ghost">?</span>}
      </div>

      <div className="cycle-board">
        <div className={`cycle-step ${phase === 0 && !finished ? 'is-active' : ''}`}>
          <span>1</span>
          predict
          <strong>{finished ? '<STOP>' : currentToken}</strong>
        </div>
        <div className="cycle-arrow" aria-hidden="true">→</div>
        <div className={`cycle-step ${phase === 1 && !finished ? 'is-active' : ''}`}>
          <span>2</span>
          append
          <strong>to sequence</strong>
        </div>
        <div className="cycle-arrow" aria-hidden="true">→</div>
        <div className={`cycle-step ${phase === 2 && !finished ? 'is-active' : ''}`}>
          <span>3</span>
          continue
          <strong>until stop</strong>
        </div>
      </div>

      <div className="mechanism-caption">
        <p>
          {finished
            ? 'Stop token reached. The response is complete.'
            : `${phaseLabels[phase]} — the next token depends on everything before it.`}
        </p>
        <ReplayButton onClick={replay} />
      </div>
      <p className="fine-print">
        Efficient engines reuse a KV cache; conceptually, the model still conditions each next token on the growing sequence.
      </p>
    </div>
  )
}

const loopMessages = [
  { role: 'user', text: 'Draft a project update.' },
  { role: 'assistant', text: 'What should it emphasize?' },
  { role: 'user', text: 'Keep it calm. No dashboard mention.' },
  { role: 'assistant', text: 'Understood — calm, no dashboard.' },
  { role: 'user', text: 'Now write it.' },
  { role: 'assistant', text: 'Quick update: tying up follow-ups…' },
]

export function AgentLoopVisual() {
  const { step, replay } = usePlayback(loopMessages.length, 950)
  const visible = loopMessages.slice(0, step)
  const current = loopMessages[Math.max(0, step - 1)]

  return (
    <div className="mechanism two-column-mechanism">
      <div className="code-card" aria-label="Simplified agent loop pseudocode">
        <div className="card-label">HARNESS / AGENT LOOP</div>
        {[
          'messages = []',
          'while conversation:',
          '  messages += user',
          '  answer = model(messages)',
          '  messages += answer',
        ].map((line, index) => (
          <code
            className={
              (current?.role === 'user' && index === 2) ||
              (current?.role === 'assistant' && (index === 3 || index === 4))
                ? 'is-active'
                : ''
            }
            key={line}
          >
            {line}
          </code>
        ))}
        <div className="loop-back">↳ repeat with the longer list</div>
      </div>

      <div className="message-stack">
        <div className="stack-header">
          <span>PROMPT FOR THIS CALL</span>
          <strong>{visible.length} messages</strong>
        </div>
        <div className="message-list" aria-live="polite">
          {visible.map((message, index) => (
            <div className={`message message--${message.role}`} key={`${message.text}-${index}`}>
              <span>{message.role}</span>
              {message.text}
            </div>
          ))}
          {visible.length === 0 && <div className="empty-state">The list starts empty.</div>}
        </div>
      </div>

      <div className="mechanism-caption span-all">
        <p>The model gets “history” only because the harness re-sends it.</p>
        <ReplayButton onClick={replay} />
      </div>
    </div>
  )
}

const contextTurns = [1700, 2450, 3100, 3900, 4300]
const contextLimit = 12_000

export function ContextWindowVisual() {
  const { step, replay } = usePlayback(contextTurns.length, 920)
  const total = contextTurns.slice(0, step).reduce((sum, tokens) => sum + tokens, 0)
  const percent = Math.min(100, (total / contextLimit) * 100)
  const overflow = Math.max(0, total - contextLimit)

  return (
    <div className="mechanism window-mechanism">
      <div className="window-scale">
        <div className="stack-header">
          <span>CONTEXT WINDOW</span>
          <strong className={overflow ? 'alert-text' : ''}>
            {total.toLocaleString()} / {contextLimit.toLocaleString()} tokens
          </strong>
        </div>
        <div className="window-track">
          <div className={`window-fill ${overflow ? 'window-fill--over' : ''}`} style={{ width: `${percent}%` }} />
          <span>{Math.round((total / contextLimit) * 100)}%</span>
        </div>
        <div className="turn-blocks">
          {contextTurns.slice(0, step).map((tokens, index) => (
            <div className={`turn-block ${index === step - 1 ? 'is-new' : ''}`} key={tokens}>
              <span>turn {index + 1}</span>
              <strong>{tokens.toLocaleString()}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className={`limit-card ${overflow ? 'limit-card--alert' : ''}`}>
        <div className="limit-mark">{overflow ? 'LIMIT EXCEEDED' : 'STILL FITS'}</div>
        <p>
          {overflow
            ? `${overflow.toLocaleString()} tokens have nowhere to go. The harness must choose what reaches the next call.`
            : 'Every turn makes the next input larger.'}
        </p>
        <small>The window covers the current input and capacity reserved for output.</small>
      </div>

      <div className="mechanism-caption span-all">
        <p>A finite window turns “memory” into a context-selection problem.</p>
        <ReplayButton onClick={replay} />
      </div>
    </div>
  )
}

export function MemoryGapVisual() {
  const { step, replay } = usePlayback(3, 1250)
  const pruned = step >= 2
  const wrongAnswer = step >= 3

  return (
    <div className="mechanism gap-mechanism">
      <div className="gap-history">
        <div className="card-label">VISIBLE CHAT</div>
        <div className="message message--user">Write a calm project update.</div>
        <div className={`message message--user critical-message ${pruned ? 'is-dropped' : ''}`}>
          <span>user</span>
          Do NOT mention the dashboard.
          {pruned && <b>not sent</b>}
        </div>
        <div className="message message--user">Okay, write it now.</div>
      </div>

      <div className="gap-divider" aria-hidden="true">
        <span>{pruned ? '✕' : '→'}</span>
        <small>{pruned ? 'oldest turns clipped' : 'send history'}</small>
      </div>

      <div className="gap-result">
        <div className="card-label">MODEL INPUT / RESPONSE</div>
        {pruned ? (
          <>
            <div className="missing-slot">[ instruction missing ]</div>
            {wrongAnswer ? (
              <div className="wrong-answer">
                “Quick update: I’m reviewing the <mark>dashboard</mark>…”
              </div>
            ) : (
              <div className="thinking-state">generating from what remains…</div>
            )}
          </>
        ) : (
          <div className="safe-answer">Constraint is present. The model can account for it.</div>
        )}
      </div>

      <div className="mechanism-caption span-all">
        <p>{wrongAnswer ? 'The model did not forget the instruction. It never received it.' : 'The easy fix: keep only the newest messages.'}</p>
        <ReplayButton onClick={replay} />
      </div>
    </div>
  )
}

export function CompactionVisual() {
  const { step, replay } = usePlayback(5, 1050)

  return (
    <div className="mechanism compaction-mechanism">
      <section className={`thread-panel ${step >= 2 ? 'is-muted' : ''}`}>
        <div className="card-label">1 / OLD RAW TURNS</div>
        <div className="mini-message">Draft a calm update.</div>
        <div className="mini-message mini-message--critical">Never mention the dashboard.</div>
        <div className="mini-message">Got it. No dashboard.</div>
        <div className="mini-message">More conversation…</div>
      </section>

      <div className={`transfer-arrow ${step >= 1 ? 'is-active' : ''}`}>
        <span>→</span>
        <small>summarize</small>
      </div>

      <section className={`summary-panel ${step >= 2 ? 'is-active' : ''}`}>
        <div className="card-label">2 / COMPACTED MEANING</div>
        {step >= 2 ? (
          <p>User needs a calm project update. <strong>Never mention the dashboard.</strong></p>
        ) : (
          <div className="empty-state">waiting for compactor</div>
        )}
        <div className="compression-stat">940 raw tokens → 126 summary tokens</div>
      </section>

      <div className={`transfer-arrow ${step >= 3 ? 'is-active' : ''}`}>
        <span>→</span>
        <small>inject</small>
      </div>

      <section className={`thread-panel prompt-panel ${step >= 3 ? 'is-active' : ''}`}>
        <div className="card-label">3 / NEXT HIDDEN PROMPT</div>
        {step >= 3 && <div className="summary-chip">summary · never mention dashboard</div>}
        <div className="mini-message">user · Okay, write it now.</div>
        {step >= 5 && <div className="model-answer">assistant · “Quick update: tying up follow-ups…”</div>}
      </section>

      <div className="mechanism-caption span-all">
        <p>{step >= 5 ? 'Continuity restored — approximately.' : 'Compress old turns; preserve recent turns verbatim.'}</p>
        <ReplayButton onClick={replay} />
      </div>
    </div>
  )
}

const memoryDocs = [
  { title: 'Lunch menu', body: 'Friday: biryani and raita', relevant: false },
  { title: 'Project Atlas', body: 'Never mention the dashboard in status updates', relevant: true },
  { title: 'Travel policy', body: 'Receipts required above $25', relevant: false },
]

export function RetrievalVisual() {
  const { step, replay } = usePlayback(4, 1100)

  return (
    <div className="mechanism retrieval-mechanism">
      <div className={`query-card ${step >= 1 ? 'is-active' : ''}`}>
        <span>NEW QUERY</span>
        “Write the Atlas status update.”
      </div>
      <div className={`search-line ${step >= 2 ? 'is-active' : ''}`}>
        <span>find related notes</span>
        <i aria-hidden="true" />
      </div>
      <div className="document-shelf">
        {memoryDocs.map((doc) => (
          <article className={`${step >= 3 && doc.relevant ? 'is-match' : ''}`} key={doc.title}>
            <span>{doc.title}</span>
            <p>{doc.body}</p>
            {step >= 3 && doc.relevant && <strong>relevant match</strong>}
          </article>
        ))}
      </div>
      <div className={`retrieved-prompt ${step >= 4 ? 'is-active' : ''}`}>
        <span>INJECTED INTO THIS CALL</span>
        {step >= 4 ? 'Project Atlas · never mention the dashboard' : '[ selected context appears here ]'}
      </div>
      <div className="mechanism-caption span-all">
        <p>Retrieval is relevance-based context selection — useful, fallible, and still outside the model.</p>
        <ReplayButton onClick={replay} />
      </div>
    </div>
  )
}
