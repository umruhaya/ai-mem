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

  const conversation = [
    { role: 'user', text: 'Help me write a calm Atlas project update.', dropped: true },
    { role: 'assistant', text: 'Sure — what should the update include or avoid?', dropped: true },
    { role: 'user', text: 'Important: do not mention the dashboard. It broke this morning.', dropped: true, critical: true },
    { role: 'assistant', text: 'Understood. I’ll leave the dashboard out.', dropped: true },
    { role: 'user', text: 'Okay, write the update now.', dropped: false },
  ]

  return (
    <div className="mechanism gap-mechanism">
      <div className="gap-history">
        <div className="gap-panel-heading">
          <div className="card-label">CHAT RECORD</div>
          <span>5 messages visible to the user</span>
        </div>
        <div className="gap-chat-list">
          {conversation.map((message, index) => (
            <div
              className={`message message--${message.role} ${message.critical ? 'critical-message' : ''} ${pruned && message.dropped ? 'is-dropped' : ''}`}
              key={`${message.role}-${message.text}`}
            >
              <span>{message.role}</span>
              {message.text}
              {pruned && message.dropped && index === 2 && <b>not sent</b>}
            </div>
          ))}
        </div>
      </div>

      <div className="gap-divider" aria-hidden="true">
        <span>{pruned ? '✕' : '→'}</span>
        <small>{pruned ? 'keep last 1 · clip 4' : 'send full history'}</small>
      </div>

      <div className="gap-result">
        <div className="gap-panel-heading">
          <div className="card-label">ACTUAL MODEL INPUT</div>
          <span>{pruned ? '1 message sent' : '5 messages sent'}</span>
        </div>
        {pruned ? (
          <>
            <div className="input-packet">
              <div className="missing-slot">4 older messages omitted · constraint omitted</div>
              <div className="message message--user"><span>user</span>Okay, write the update now.</div>
            </div>
            {wrongAnswer ? (
              <div className="wrong-answer">
                <span>assistant</span>
                <p>“Quick update: the Atlas <mark>dashboard</mark> is being repaired while we close out the remaining work.”</p>
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
        <div className="panel-topline">
          <div className="card-label">1 / MAIN CHAT</div>
          <span>threshold reached</span>
        </div>
        <div className="token-meter"><i /><b>200k tokens</b></div>
        <div className="mini-message">user · Help me write an Atlas update.</div>
        <div className="mini-message">assistant · What should it include?</div>
        <div className="mini-message mini-message--critical">user · Never mention the dashboard.</div>
        <div className="mini-message">assistant · Understood. I’ll avoid it.</div>
        <div className="mini-message mini-message--recent">recent turns stay verbatim →</div>
      </section>

      <div className={`transfer-arrow ${step >= 1 ? 'is-active' : ''}`}>
        <span>→</span>
        <small>background request</small>
      </div>

      <section className={`summary-panel ${step >= 2 ? 'is-active' : ''}`}>
        <div className="panel-topline">
          <div className="card-label">2 / COMPACTOR THREAD</div>
          <span>separate model call</span>
        </div>
        {step >= 2 ? (
          <div className="summary-output">
            <span>SUMMARY</span>
            <p>Atlas update should sound calm. <strong>Never mention the dashboard.</strong></p>
          </div>
        ) : (
          <div className="empty-state">waiting for compactor</div>
        )}
        <div className="latency-card">
          <strong>200k → 10k tokens</strong>
          <span>at 200 output tok/s ≈ 50s</span>
        </div>
      </section>

      <div className={`transfer-arrow ${step >= 3 ? 'is-active' : ''}`}>
        <span>→</span>
        <small>inject</small>
      </div>

      <section className={`thread-panel prompt-panel ${step >= 3 ? 'is-active' : ''}`}>
        <div className="panel-topline">
          <div className="card-label">3 / NEXT PROMPT</div>
          <span>under the hood</span>
        </div>
        {step >= 3 && <div className="summary-chip">compacted history · avoid dashboard</div>}
        <div className="recent-turns">
          <span>RECENT TURNS · RAW</span>
          <div className="mini-message">user · Okay, write the update now.</div>
        </div>
        {step >= 5 && <div className="model-answer">assistant · “Quick update: Atlas is on track…”</div>}
        <div className="roll-again">next threshold → summarize again ↻</div>
      </section>

      <div className="mechanism-caption span-all">
        <p>{step >= 5 ? 'Better than clipping, but the summary is lossy, finite, and slower to produce.' : 'Compress old turns; preserve recent turns verbatim.'}</p>
        <ReplayButton onClick={replay} />
      </div>
    </div>
  )
}

export function RetrievalVisual() {
  const { step, replay } = usePlayback(5, 920)

  return (
    <div className="mechanism retrieval-mechanism">
      <section className="indexing-lane">
        <div className="panel-topline">
          <div className="card-label">OFFLINE / INDEX ONCE</div>
          <span>20M-token knowledge base</span>
        </div>
        <div className="indexing-flow">
          <div><b>documents</b><span>policies · notes · wikis</span></div>
          <i>→</i>
          <div><b>chunk</b><span>≈500 tokens + metadata</span></div>
          <i>→</i>
          <div><b>embed</b><span>meaning → vector</span></div>
          <i>→</i>
          <div className="vector-index"><b>vector index</b><span>Pinecone / pgvector / …</span></div>
        </div>
      </section>

      <section className="retrieval-runtime">
        <div className="panel-topline">
          <div className="card-label">ONLINE / EVERY CALL</div>
          <span>select context, then ask the LLM</span>
        </div>
        <div className="runtime-flow">
          <div className={`query-card ${step >= 1 ? 'is-active' : ''}`}>
            <span>1 · QUERY</span>
            “Write the Atlas status update.”
          </div>
          <div className={`pipeline-step ${step >= 2 ? 'is-active' : ''}`}>
            <span>2 · EMBED QUERY</span>
            <code>[0.12, −0.48, …]</code>
          </div>
          <div className={`pipeline-step ${step >= 3 ? 'is-active' : ''}`}>
            <span>3 · SEARCH</span>
            <b>nearest chunks</b>
            <small>semantic similarity + filters</small>
          </div>
          <div className={`pipeline-step rerank-step ${step >= 4 ? 'is-active' : ''}`}>
            <span>4 · TOP-K / RERANK</span>
            <b>#1 Atlas notes</b>
            <small>#2 release plan · #3 team log</small>
          </div>
          <div className={`retrieved-prompt ${step >= 5 ? 'is-active' : ''}`}>
            <span>5 · ASSEMBLED PROMPT</span>
            <b>instructions + retrieved chunks + query</b>
            <small>Only this selected slice reaches the LLM.</small>
          </div>
        </div>
        <div className="retrieval-results" aria-label="Example chunks returned by semantic retrieval">
          <article className={step >= 4 ? 'is-selected' : ''}>
            <span>0.91 · ATLAS NOTES · chunk 18/42</span>
            <p>“Status updates must not mention the dashboard while incident review is open.”</p>
            <b>selected</b>
          </article>
          <article>
            <span>0.84 · RELEASE PLAN · chunk 7/16</span>
            <p>“Atlas rollout remains on schedule; validation closes Friday.”</p>
          </article>
          <article className="false-friend">
            <span>0.79 · TEAM LOG · chunk 31/90</span>
            <p>“Dashboard migration checklist…”</p>
            <b>similar, not useful</b>
          </article>
        </div>
      </section>

      <div className="rag-caveats">
        <span>RETRIEVAL CAN MISS</span>
        <span>CHUNKS LOSE CONTEXT</span>
        <span>SIMILAR ≠ CORRECT</span>
        <span>PROMPT BUDGET STILL FINITE</span>
      </div>
      <div className="mechanism-caption span-all">
        <p>RAG does not expand the context window; it chooses a small, fallible slice of a much larger corpus.</p>
        <ReplayButton onClick={replay} />
      </div>
    </div>
  )
}
