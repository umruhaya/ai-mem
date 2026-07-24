import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import spoilerCat from '../assets/spolier-alert-cat.jpg'
import stairSkipping from '../assets/stair-skipping.jpg'
import thankYou from '../assets/thank-you-chatgpt.jpeg'
import thankYouSaves from '../assets/thank-you-saves-from-terminator.jpeg'
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
    section: 'THE CLAIM',
    railTitle: 'Scope the answer',
    trace: [{ label: 'current input only', tone: 'alert' }],
    content: (
      <section className="slide centered-slide quote-slide">
        <p className="eyebrow">THE SHORT ANSWER · WITH ONE IMPORTANT BOUNDARY</p>
        <blockquote>
          “A model call does not carry
          <span> the conversation forward.”</span>
        </blockquote>
        <p className="definition-note">
          Between independent calls, continuity must be stored and supplied by software around the model.
        </p>
      </section>
    ),
  },
  {
    section: 'LANGUAGE',
    railTitle: 'Why words matter',
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
            Before we inspect the machinery, we need to separate a useful metaphor from a technical mechanism.
          </p>
          <p className="literary-aside">First: what do we imply when we say “remember”?</p>
        </div>
      </section>
    ),
  },
  {
    section: 'LANGUAGE',
    railTitle: 'Metaphor is not mechanism',
    trace: [
      { label: '“the AI remembers…”', tone: 'alert', crossed: true },
      { label: 'show the mechanism', tone: 'context' },
    ],
    content: (
      <section className="slide jargon-slide">
        <header className="slide-heading slide-heading--split">
          <div>
            <p className="eyebrow">THE LANGUAGE LAYER</p>
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
    section: 'SYSTEM MAP',
    railTitle: 'Four layers, one experience',
    trace: [
      { label: 'stored state', tone: 'context' },
      { label: '+' },
      { label: 'current request', tone: 'plain' },
      { label: 'assembled packet', tone: 'signal' },
    ],
    content: (
      <section className="slide system-map-slide">
        <header className="slide-heading slide-heading--inline">
          <div>
            <p className="eyebrow">KEEP THESE BOUNDARIES VISIBLE</p>
            <h1>“The AI” is several layers working together.</h1>
          </div>
          <p>We will zoom into each layer, then rebuild the full system.</p>
        </header>
        <div className="system-stack" aria-label="The four layers of an AI product">
          <article className="system-layer system-layer--product">
            <span>04 · EXPERIENCE</span>
            <strong>PRODUCT</strong>
            <p>The chat screen, thread, account, and controls a person sees.</p>
          </article>
          <article className="system-layer system-layer--harness">
            <span>03 · CONTINUITY</span>
            <strong>HARNESS / AGENT</strong>
            <p>Stores state, assembles prompts, runs tools, and repeats calls.</p>
          </article>
          <article className="system-layer system-layer--provider">
            <span>02 · SERVING</span>
            <strong>PROVIDER / ENGINE</strong>
            <p>Runs generation and returns a message or token stream.</p>
          </article>
          <article className="system-layer system-layer--model">
            <span>01 · COMPUTATION</span>
            <strong>LANGUAGE MODEL</strong>
            <p>Maps the tokens in this call to a prediction for the next token.</p>
          </article>
        </div>
        <div className="system-map-takeaway">
          <span>OUR QUESTION BECOMES</span>
          <strong>Which layer kept the information—and how did it reach this call?</strong>
        </div>
      </section>
    ),
  },
  {
    section: 'MODEL CORE',
    railTitle: 'Zoom in: one model call',
    trace: [
      { label: 'input tokens', tone: 'plain' },
      { label: 'model', tone: 'signal' },
      { label: 'next token', tone: 'signal' },
    ],
    content: (
      <section className="slide stateless-slide">
        <header className="slide-heading">
          <p className="eyebrow">LAYER 01 · LANGUAGE MODEL</p>
          <h1>The model answers the input in front of it.</h1>
          <p>Tokens are small text units. Weights are learned parameters fixed during this inference call.</p>
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
    section: 'MODEL CORE',
    railTitle: 'How one answer is generated',
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
            <p className="eyebrow">LAYER 01 · AUTOREGRESSION</p>
            <h1>Predict. Attach. Continue.</h1>
          </div>
          <p>The growing sequence lasts during generation; it is not a diary for the next independent call.</p>
        </header>
        <AutoregressionVisual />
      </section>
    ),
  },
  {
    section: 'SERVING LAYER',
    railTitle: 'Zoom out: generation is served',
    trace: [
      { label: 'prompt', tone: 'plain' },
      { label: 'inference engine', tone: 'signal' },
      { label: 'message', tone: 'signal' },
    ],
    content: (
      <section className="slide provider-slide">
        <header className="slide-heading">
          <p className="eyebrow">LAYER 02 · PROVIDER / INFERENCE ENGINE</p>
          <h1>You usually never touch that loop.</h1>
          <p>The serving layer runs generation and exposes it through a higher-level API.</p>
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
    section: 'MODEL LIMITS',
    railTitle: 'The active sequence is finite',
    trace: [
      { label: 'input tokens', tone: 'plain' },
      { label: 'generated so far', tone: 'signal' },
      { label: 'finite active sequence', tone: 'alert' },
    ],
    content: (
      <section className="slide context-principle-slide">
        <header className="slide-heading slide-heading--inline">
          <div>
            <p className="eyebrow">FIRST PRINCIPLE · THE CONTEXT WINDOW</p>
            <h1>Every next token has a bounded working surface.</h1>
          </div>
          <p>The context window is the maximum active sequence a model can use during one call.</p>
        </header>

        <div className="context-principle-board">
          <article className="active-sequence-card">
            <div className="card-label">ONE CALL · ACTIVE TOKEN SEQUENCE</div>
            <div className="active-sequence-track">
              <div className="sequence-input">
                <span>INPUT</span>
                <strong>tokens supplied to this call</strong>
              </div>
              <div className="sequence-output">
                <span>OUTPUT SO FAR</span>
                <strong>generated tokens</strong>
              </div>
              <div className="sequence-next">
                <span>NEXT</span>
                <strong>?</strong>
              </div>
            </div>
            <div className="sequence-brace">
              <span>←</span>
              <b>finite context window</b>
              <span>→</span>
            </div>
          </article>

          <aside className="context-limit-reasons">
            <article>
              <span>01 · CONDITION</span>
              <p>Each next-token prediction uses the tokens available in the active sequence.</p>
            </article>
            <article>
              <span>02 · COST</span>
              <p>Longer sequences require more computation and working memory to process.</p>
            </article>
            <article>
              <span>03 · LIMIT</span>
              <p>Model architectures and serving systems therefore expose a maximum context length.</p>
            </article>
          </aside>
        </div>

        <div className="context-principle-takeaway">
          <strong>INPUT AND OUTPUT SHARE THE BUDGET</strong>
          <span>More input leaves less room for generation—and no call can use an unlimited history.</span>
        </div>
      </section>
    ),
  },
  {
    section: 'MODEL BEHAVIOR',
    railTitle: 'The memory illusion inside one prompt',
    trace: [
      { label: 'earlier fact + instruction + example', tone: 'context' },
      { label: 'fixed weights', tone: 'signal' },
      { label: 'adapted answer', tone: 'plain' },
    ],
    content: (
      <section className="slide learning-boundary-slide">
        <header className="slide-heading slide-heading--inline">
          <div>
            <p className="eyebrow">FIRST PRINCIPLE · IN-CONTEXT LEARNING</p>
            <h1>It looks like memory. It happens inside the prompt.</h1>
          </div>
          <p>At inference time, the model uses facts, instructions, and examples in the current context while its weights stay frozen.</p>
        </header>

        <div className="icl-example-board">
          <article className="icl-chat">
            <div className="icl-panel-heading">
              <span>CHAT THE USER SEES</span>
              <small>earlier messages are still in the current prompt</small>
            </div>

            <div className="icl-chat-thread">
              <div className="icl-turn icl-turn--user">
                <span>EARLIER · USER</span>
                <p>
                  New fact: <b>Atlas validation closes Friday</b>. I prefer calm updates in three bullets.
                  Example: <b>• State: on track · • Risk: testing · • Next: close checks.</b>
                </p>
              </div>
              <div className="icl-turn icl-turn--assistant">
                <span>ASSISTANT</span>
                <p>Understood.</p>
              </div>
              <div className="icl-turn icl-turn--user icl-turn--later">
                <span>LATER · USER</span>
                <p>Write today’s Atlas update.</p>
              </div>
              <div className="icl-turn icl-turn--assistant icl-turn--answer">
                <span>ASSISTANT</span>
                <p>
                  • <b>State:</b> rollout remains on track.<br />
                  • <b>Risk:</b> validation is still open.<br />
                  • <b>Next:</b> close checks Friday.
                </p>
              </div>
            </div>
          </article>

          <aside className="icl-explanation">
            <div className="icl-panel-heading">
              <span>WHAT THE MODEL USED</span>
              <small>all at inference time</small>
            </div>

            <div className="icl-use-list">
              <article>
                <span>01 · NEW FACT</span>
                <p>It can use “validation closes Friday” even if that fact was never in training.</p>
              </article>
              <article>
                <span>02 · INSTRUCTION</span>
                <p>It follows the preference for calm, three-bullet updates.</p>
              </article>
              <article>
                <span>03 · EXAMPLE / FEW-SHOT</span>
                <p>The demonstrated State / Risk / Next output teaches the requested format.</p>
              </article>
            </div>

            <div className="icl-fixed-weights">
              <span>MODEL AT INFERENCE</span>
              <strong>same frozen weights</strong>
              <p>No optimizer. No training job. No fine-tuning.</p>
            </div>
          </aside>
        </div>

        <div className="learning-boundary-takeaway">
          <span>THE EXPERIENCE FEELS LIKE “IT REMEMBERED” OR “IT LEARNED”</span>
          <strong>but remove the earlier messages and that temporary adaptation is no longer carried forward.</strong>
        </div>
      </section>
    ),
  },
  {
    section: 'HARNESS',
    railTitle: 'Structure one request',
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
            <p className="eyebrow">NOW: HOW SOFTWARE FILLS THAT TEMPORARY WINDOW</p>
            <h1>The harness packages context as messages.</h1>
          </div>
          <p>Chat APIs represent instructions and conversation as role-and-content messages.</p>
        </header>
        <div className="roles-layout">
          <div className="role-ledger">
            {[
              ['system', 'rules and framing', 'context'],
              ['user', 'what the person said', 'plain'],
              ['assistant', 'what the model previously returned', 'signal'],
              ['tool', 'a result returned by external software', 'muted'],
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
            <div className="prompt-message prompt-message--assistant"><b>assistant</b> I’ll check the project status.</div>
            <div className="prompt-message prompt-message--tool"><b>tool</b> {`{ "project": "Atlas", "status": "on_track" }`}</div>
          </div>
        </div>
      </section>
    ),
  },
  {
    section: 'HARNESS',
    railTitle: 'Repeat requests with state',
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
            <p className="eyebrow">LAYER 03 · THE AGENT LOOP</p>
            <h1>History is resent, turn after turn.</h1>
          </div>
          <p>An agent wraps the model with tools, stored state, and a loop.</p>
        </header>
        <AgentLoopVisual />
      </section>
    ),
  },
  {
    section: 'CONTEXT PROBLEM',
    railTitle: 'Conversation reaches the limit',
    trace: [
      { label: 'old history', tone: 'context' },
      { label: 'recent history', tone: 'plain' },
      { label: 'overflow', tone: 'alert' },
    ],
    content: (
      <section className="slide mechanism-slide">
        <header className="slide-heading slide-heading--inline">
          <div>
            <p className="eyebrow">NOW APPLY THE SAME LIMIT ACROSS TURNS</p>
            <h1>Conversation history fills the working surface.</h1>
          </div>
          <p>Every resent message consumes the same shared input-and-output token budget.</p>
        </header>
        <ContextWindowVisual />
      </section>
    ),
  },
  {
    section: 'CONTEXT PROBLEM',
    railTitle: 'The first fix loses constraints',
    trace: [
      { label: 'old constraint', tone: 'alert', crossed: true },
      { label: 'recent turn', tone: 'plain' },
      { label: 'wrong answer', tone: 'alert' },
    ],
    content: (
      <section className="slide mechanism-slide">
        <header className="slide-heading slide-heading--inline">
          <div>
            <p className="eyebrow">OPTION A · KEEP ONLY THE LAST N</p>
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
    railTitle: 'Compress what no longer fits',
    trace: [
      { label: 'compacted summary', tone: 'context' },
      { label: 'recent turns', tone: 'plain' },
      { label: 'new input', tone: 'plain' },
    ],
    content: (
      <section className="slide mechanism-slide">
        <header className="slide-heading slide-heading--inline">
          <div>
            <p className="eyebrow">OPTION B · ROLLING SUMMARIZATION</p>
            <h1>Compress, carry forward, repeat.</h1>
          </div>
          <p>A second model call turns old chat into the next prompt’s summary.</p>
        </header>
        <CompactionVisual />
      </section>
    ),
  },

  {
    section: 'MEMORY PRIMITIVE 01',
    railTitle: 'Capacity is not relevance',
    trace: [
      { label: 'relevant signal', tone: 'context' },
      { label: 'irrelevant haystack', tone: 'alert' },
      { label: 'current input', tone: 'plain' },
    ],
    content: (
      <section className="slide readable-slide readable-slide--compact">
        <header className="slide-heading">
          <p className="eyebrow">COMPRESSION SOLVES ONLY ONE PROBLEM</p>
          <h1>A prompt can fit and still be noisy.</h1>
        </header>
        <div className="sentence-ladder">
          <p>Summarization helps the packet fit.</p>
          <p>But a larger packet can still dilute the useful signal.</p>
          <p>Important information can be harder to use when buried among unrelated material.</p>
          <p>So the next primitive must select what matters now.</p>
        </div>
        <aside className="speaker-example">Narration: one sticky note on a clean desk is helpful; one sticky note under a pile of unrelated notes is a search problem.</aside>
      </section>
    ),
  },
  {
    section: 'MEMORY PRIMITIVE 01',
    railTitle: 'Compression has a price',
    trace: [
      { label: '200k old tokens', tone: 'alert' },
      { label: '→ 10k summary', tone: 'context' },
      { label: '~50s', tone: 'alert' },
    ],
    content: (
      <section className="slide readable-slide readable-slide--compact summary-cost-slide">
        <header className="slide-heading">
          <p className="eyebrow">OPTION B · THE TRADE-OFF</p>
          <h1>Summaries are better than dropping history, but they are not magic.</h1>
        </header>
        <div className="math-callout">
          <span>200,000 tokens</span>
          <b>compressed to 5%</b>
          <span>10,000 output tokens</span>
          <strong>≈ 50 seconds at 200 output tok/s*</strong>
        </div>
        <div className="sentence-ladder sentence-ladder--compact">
          <p>Some products compact history automatically; others expose a manual or visible summarize step.</p>
          <p>The trade-off is latency and loss: a summary cannot preserve every detail.</p>
          <p>*Illustrative generation time only; actual latency also depends on input processing, caching, limits, and network overhead.</p>
        </div>
      </section>
    ),
  },
  {
    section: 'MEMORY PRIMITIVE 02',
    railTitle: 'Define what we retrieve',
    trace: [
      { label: 'user preference', tone: 'context' },
      { label: 'docs chunk', tone: 'context' },
      { label: 'prompt', tone: 'plain' },
    ],
    content: (
      <section className="slide comparison-slide">
        <header className="slide-heading">
          <p className="eyebrow">PERSONAL HISTORY IS NOT REFERENCE MATERIAL</p>
          <h1>Different sources can enter the same packet.</h1>
        </header>
        <div className="compare-cards">
          <article>
            <span>MEMORY</span>
            <p>“The user prefers Python examples and short summaries.”</p>
          </article>
          <article>
            <span>KNOWLEDGE BASE</span>
            <p>“The billing webhook sends a signed retry event.”</p>
          </article>
          <article className="compare-cards__result">
            <span>TO THE MODEL</span>
            <p>Both become context—but the harness should preserve their source, trust, permissions, and lifetime.</p>
          </article>
        </div>
      </section>
    ),
  },
  {
    section: 'MEMORY PRIMITIVE 02',
    railTitle: 'Index, search, then answer',
    trace: [
      { label: 'new query', tone: 'plain' },
      { label: 'relevant notes', tone: 'context' },
      { label: 'current call', tone: 'signal' },
    ],
    content: (
      <section className="slide mechanism-slide">
        <header className="slide-heading slide-heading--inline">
          <div>
            <p className="eyebrow">CLASSIC RAG · RETRIEVAL-AUGMENTED GENERATION</p>
            <h1>Retrieve once, then answer.</h1>
          </div>
          <p>Split a large corpus into chunks, represent their meaning as vectors, and retrieve a small—fallible—set.</p>
        </header>
        <RetrievalVisual />
      </section>
    ),
  },

  {
    section: 'ACTIVE MEMORY',
    railTitle: 'Let the model request actions',
    trace: [
      { label: 'JSON tool call', tone: 'signal' },
      { label: 'search_memory()', tone: 'context' },
      { label: 'set_preference()', tone: 'context' },
    ],
    content: (
      <section className="slide readable-slide readable-slide--compact tool-calling-slide">
        <header className="slide-heading">
          <p className="eyebrow">FROM PASSIVE CONTEXT TO TOOL REQUESTS</p>
          <h1>Models request actions. Software executes them.</h1>
        </header>
        <div className="tool-script">
          <code>{`{ "tool": "search_memory", "query": "billing webhook retries" }`}</code>
          <code>{`{ "tool": "get_note", "id": "doc_184" }`}</code>
          <code>{`{ "tool": "set_preference", "key": "style", "value": "concise" }`}</code>
        </div>
        <div className="sentence-ladder sentence-ladder--compact">
          <p>The harness exposes named tools with input schemas and permissions.</p>
          <p>The model emits a structured request; it does not execute the tool itself.</p>
          <p>The harness validates, runs, and returns the result before the loop continues.</p>
          <p>The agent can search, inspect, update, and only then answer.</p>
        </div>
      </section>
    ),
  },
  {
    section: 'ACTIVE MEMORY',
    railTitle: 'Retrieval becomes a loop',
    trace: [
      { label: 'model query 1', tone: 'signal' },
      { label: 'results', tone: 'context' },
      { label: 'model query 2', tone: 'signal' },
      { label: 'answer', tone: 'plain' },
    ],
    content: (
      <section className="slide timeline-slide timeline-slide--compact">
        <header className="slide-heading">
          <p className="eyebrow">FROM ONE-SHOT RAG TO AGENTIC RAG</p>
          <h1>The retrieval process becomes part of reasoning.</h1>
        </header>
        <ol className="walkthrough">
          <li><b>Classic RAG:</b> embed the user query, retrieve top chunks, answer.</li>
          <li><b>Agentic RAG:</b> the model writes the search query itself.</li>
          <li><b>Then it can refine:</b> search docs, open a result, search again, compare evidence.</li>
          <li><b>Example:</b> “billing webhook” → “retry policy” → “migration note” → final answer.</li>
          <li><b>The price:</b> more calls, more latency, and more chances to retrieve or trust the wrong thing.</li>
        </ol>
      </section>
    ),
  },
  {
    section: 'STORAGE & POLICY',
    railTitle: 'Choose storage by question',
    trace: [
      { label: 'vector db', tone: 'context' },
      { label: 'key-value', tone: 'context' },
      { label: 'temporal graph', tone: 'context' },
      { label: 'filesystem', tone: 'context' },
    ],
    content: (
      <section className="slide source-slide">
        <header className="slide-heading">
          <p className="eyebrow">WHERE DOES THE INFORMATION PHYSICALLY LIVE?</p>
          <h1>Choose a store by the question it must answer.</h1>
        </header>
        <div className="source-grid">
          <article><b>Vector database</b><span>“What text is similar?” Flexible retrieval; similarity is not authority.</span></article>
          <article><b>Key-value store</b><span>“What is this known field?” Fast and exact; the schema must be known.</span></article>
          <article><b>Temporal graph</b><span>“What was related, and when?” Preserves change; costs more to model.</span></article>
          <article><b>Filesystem / AST</b><span>“Where is this file or symbol?” Keeps native structure; needs search and permissions.</span></article>
          <article><b>Relational database</b><span>“Which trusted records match?” Strong filters and constraints; less fuzzy by default.</span></article>
        </div>
      </section>
    ),
  },
  {
    section: 'STORAGE & POLICY',
    railTitle: 'Human labels become policies',
    trace: [
      { label: 'short-term', tone: 'plain' },
      { label: 'semantic', tone: 'context' },
      { label: 'episodic', tone: 'context' },
      { label: 'procedural', tone: 'context' },
    ],
    content: (
      <section className="slide source-slide">
        <header className="slide-heading">
          <p className="eyebrow">SAME STORES · A DIFFERENT DESIGN AXIS</p>
          <h1>Memory types are useful metaphors for storage policy.</h1>
        </header>
        <div className="source-grid source-grid--four">
          <article><b>Short-term</b><span>The immediate conversation or task window.</span></article>
          <article><b>Semantic</b><span>Facts and concepts: “the API supports webhooks.”</span></article>
          <article><b>Episodic</b><span>Events and interactions: “the user rejected that draft.”</span></article>
          <article><b>Procedural</b><span>Repeatable workflows: “run tests before the PR summary.”</span></article>
        </div>
      </section>
    ),
  },
  {
    section: 'STORAGE & POLICY',
    railTitle: 'Memory is governed infrastructure',
    trace: [
      { label: 'consent?', tone: 'alert' },
      { label: 'trust?', tone: 'alert' },
      { label: 'current?', tone: 'alert' },
      { label: 'delete?', tone: 'alert' },
    ],
    content: (
      <section className="slide readable-slide">
        <header className="slide-heading">
          <p className="eyebrow">RETRIEVAL IS ONLY HALF THE SYSTEM</p>
          <h1>A remembered fact needs a lifecycle.</h1>
        </header>
        <div className="sentence-ladder">
          <p><b>Write:</b> What is worth storing, and did the person consent?</p>
          <p><b>Read:</b> Is it relevant, trustworthy, current, and allowed for this user?</p>
          <p><b>Correct:</b> What wins when sources conflict or a fact becomes stale?</p>
          <p><b>Delete:</b> Can a person inspect, correct, expire, and remove it everywhere?</p>
        </div>
      </section>
    ),
  },
  {
    section: 'STORAGE & POLICY',
    railTitle: 'Example: facts that change',
    trace: [
      { label: 'entity', tone: 'plain' },
      { label: 'relationship', tone: 'signal' },
      { label: 'valid_from → valid_to', tone: 'context' },
      { label: 'query at time t', tone: 'plain' },
    ],
    content: (
      <section className="slide temporal-graph-slide">
        <header className="slide-heading slide-heading--inline">
          <div>
            <p className="eyebrow">ZOOM IN · TEMPORAL GRAPH–BASED MEMORY</p>
            <h1>A fact can be true—and then stop being true.</h1>
          </div>
          <p>An entity is a thing; an edge is a relationship. Time-stamped edges preserve change instead of overwriting it.</p>
        </header>

        <div className="temporal-board">
          <article className="temporal-canvas">
            <div className="temporal-panel-heading">
              <span>KNOWLEDGE GRAPH / RELATIONSHIPS WITH VALIDITY WINDOWS</span>
              <small>example memory</small>
            </div>

            <div className="temporal-edge-list">
              <div className="temporal-edge-row temporal-edge-row--expired">
                <div className="graph-node graph-node--person"><small>PERSON</small><strong>Osama</strong></div>
                <div className="graph-edge">
                  <b>WORKS_AT</b>
                  <span>valid · JAN 2022 → MAR 2025</span>
                </div>
                <div className="graph-node"><small>COMPANY</small><strong>Devsinc</strong></div>
              </div>

              <div className="temporal-edge-row temporal-edge-row--current">
                <div className="graph-node graph-node--person"><small>PERSON</small><strong>Osama</strong></div>
                <div className="graph-edge">
                  <b>WORKS_AT</b>
                  <span>valid · MAR 2025 → NOW</span>
                </div>
                <div className="graph-node"><small>COMPANY</small><strong>Carbonteq</strong></div>
              </div>

              <div className="temporal-edge-row">
                <div className="graph-node graph-node--person"><small>PERSON</small><strong>Osama</strong></div>
                <div className="graph-edge">
                  <b>PREFERS</b>
                  <span>valid · NOV 2024 → NOW</span>
                </div>
                <div className="graph-node"><small>UPDATE STYLE</small><strong>Async notes</strong></div>
              </div>
            </div>

            <div className="temporal-axis" aria-label="Timeline from January 2022 to now">
              <i></i>
              <span>JAN 2022</span>
              <b>MAR 2025 · change observed</b>
              <span>NOW</span>
            </div>
          </article>

          <aside className="temporal-query-panel">
            <div className="temporal-panel-heading">
              <span>ASK THE GRAPH</span>
              <small>time changes the answer</small>
            </div>

            <div className="temporal-query">
              <code>works_at(Osama, FEB 2025)?</code>
              <span>→</span>
              <strong>Devsinc</strong>
            </div>
            <div className="temporal-query temporal-query--now">
              <code>works_at(Osama, NOW)?</code>
              <span>→</span>
              <strong>Carbonteq</strong>
            </div>

            <div className="temporal-edge-record">
              <span>EVERY EDGE CAN CARRY</span>
              <dl>
                <div><dt>valid_from</dt><dd>when it became true</dd></div>
                <div><dt>valid_to</dt><dd>when it stopped</dd></div>
                <div><dt>observed_at</dt><dd>when memory learned it</dd></div>
                <div><dt>source</dt><dd>where the claim came from</dd></div>
              </dl>
            </div>
          </aside>
        </div>

        <div className="temporal-takeaway">
          <div><span>FLAT RECORD</span><s>works_at = Devsinc</s><strong>works_at = Carbonteq</strong></div>
          <b>→</b>
          <p><strong>TEMPORAL GRAPH:</strong> preserve both facts, their order, and the evidence behind each change.</p>
        </div>
      </section>
    ),
  },
  {
    section: 'ADVANCED PATTERN',
    railTitle: 'Archive instead of summarize',
    trace: [
      { label: 'old chat archived', tone: 'context' },
      { label: 'tool access', tone: 'signal' },
      { label: 'reload pieces', tone: 'plain' },
    ],
    content: (
      <section className="slide timeline-slide">
        <header className="slide-heading">
          <p className="eyebrow">A DIFFERENT STORAGE PROBLEM · LONG CONVERSATIONS</p>
          <h1>Move old context out, then let the model inspect it later.</h1>
        </header>
        <ol className="walkthrough">
          <li>When the threshold is reached, old messages leave the active prompt.</li>
          <li>They live in storage, a variable, or a code environment outside the active prompt.</li>
          <li>The model can call tools or write code to pull back the pieces it needs.</li>
          <li>The current turn feels snappier than generating a giant summary.</li>
          <li>The cost moves to later turns that spend compute recursively reloading context.</li>
        </ol>
      </section>
    ),
  },
  {
    section: 'ADVANCED PATTERN',
    railTitle: 'The archive stays outside the model',
    trace: [
      { label: 'small active prompt', tone: 'plain' },
      { label: 'inspect archive', tone: 'signal' },
      { label: 'selected block', tone: 'context' },
      { label: 'next call', tone: 'plain' },
    ],
    content: (
      <section className="slide rlm-block-slide">
        <header className="slide-heading slide-heading--inline">
          <div>
            <p className="eyebrow">RLM-STYLE RETRIEVAL, AS PHYSICAL BLOCKS</p>
            <h1>Keep a small desk. Retrieve from the archive.</h1>
          </div>
          <p>The model trades one enormous prompt for a sequence of focused calls.</p>
        </header>

        <div className="rlm-block-board" aria-label="Recursive language model context flow">
          <article className="rlm-zone rlm-zone--desk">
            <div className="rlm-zone-label"><b>01</b><span>ACTIVE DESK</span><small>small prompt</small></div>
            <div className="rlm-stack">
              <div className="rlm-context-block rlm-context-block--plain">current question</div>
              <div className="rlm-context-block rlm-context-block--plain">recent turns</div>
              <div className="rlm-context-block rlm-context-block--pointer">pointer → chat_archive</div>
            </div>
            <div className="rlm-model-block"><span>MODEL</span><strong>What should I inspect?</strong></div>
          </article>

          <div className="rlm-transport" aria-hidden="true">
            <span>→</span>
            <small>tool / code</small>
          </div>

          <article className="rlm-zone rlm-zone--archive">
            <div className="rlm-zone-label"><b>02</b><span>CONTEXT ARCHIVE</span><small>outside the prompt</small></div>
            <div className="rlm-archive-grid">
              <div>block 01</div><div>block 02</div><div>block 03</div>
              <div>block 18</div><div className="is-selected">block 19<br /><strong>relevant</strong></div><div>block 20</div>
              <div>block 37</div><div>block 38</div><div>block 39</div>
            </div>
            <code>read(chat_archive, block_19)</code>
          </article>

          <div className="rlm-transport rlm-transport--return" aria-hidden="true">
            <span>→</span>
            <small>reload slice</small>
          </div>

          <article className="rlm-zone rlm-zone--next">
            <div className="rlm-zone-label"><b>03</b><span>NEXT CALL</span><small>fresh packet</small></div>
            <div className="rlm-stack">
              <div className="rlm-context-block rlm-context-block--plain">current question</div>
              <div className="rlm-context-block rlm-context-block--selected">retrieved · block 19</div>
            </div>
            <div className="rlm-model-block"><span>MODEL</span><strong>Answer—or inspect again</strong></div>
          </article>
        </div>

        <div className="rlm-loop-note">
          <span>NOT ENOUGH EVIDENCE?</span>
          <strong>↺ inspect another block</strong>
          <small>The recursion is across model calls. The weights did not remember the archive.</small>
        </div>
      </section>
    ),
  },
  {
    section: 'SYNTHESIS',
    railTitle: 'Reassemble the layers',
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
            <p className="eyebrow">RETURN TO THE SYSTEM MAP</p>
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
    section: 'SYNTHESIS',
    railTitle: 'Answer with the boundary intact',
    trace: [
      { label: 'stateful harness', tone: 'context' },
      { label: '+' },
      { label: 'stateless model', tone: 'signal' },
      { label: '=' },
      { label: 'perceived memory', tone: 'plain' },
    ],
    content: (
      <section className="slide answer-slide">
        <p className="eyebrow">SO, HOW DOES AN AI PRODUCT REMEMBER?</p>
        <h1>The product keeps state—<span>the model uses the packet.</span></h1>
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
        <p className="answer-note">Store with policy · select for this task · assemble the prompt · call the model</p>
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
          <p>Just ask which layer kept the notes—and how they reached this call.</p>
          <div className="closing-takeaway">STATE LIVES AROUND THE MODEL &nbsp;·&nbsp; CONTEXT CREATES CONTINUITY</div>
        </div>
        <div className="closing-media-stack">
          <div className="projected-photo projected-photo--square closing-photo closing-photo--first">
            <img src={thankYou} alt="A man saying thank you to ChatGPT in case AI takes over the world" />
            <span className="photo-index">JUST IN CASE · 01</span>
          </div>
          <div className="projected-photo projected-photo--square closing-photo closing-photo--second">
            <img src={thankYouSaves} alt="Robots spare a man because he always thanked ChatGPT" />
            <span className="photo-index">END OF TAPE · 02</span>
          </div>
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
