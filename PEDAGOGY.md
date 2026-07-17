# Pedagogical plan for the new memory slides

Core pacing rule: **one sentence, one mental move**.

## Teaching style

- Start from the simplest historical mechanism before introducing agentic memory.
- Prefer spoken, readable sentences over dense diagrams.
- Use examples that can be narrated: a support bot, a 20M-token documentation set, a coding assistant, and a user preference.
- Keep the engineering vocabulary, but define it by function: “a place to search,” “a place to update,” “a packet sent to the model.”
- Repeatedly separate the stateless model from the stateful harness.

## Slide sequence

### 1. Why manage context at all?

Sentence moves:

1. Context management is not only about avoiding overflow.
2. Bigger prompts can dilute the useful signal.
3. Models may under-weight information buried in the middle.
4. Irrelevant context becomes pollution.

Demonstration: compare a clean desk with one sticky note versus a desk covered with unrelated sticky notes.

### 2. Summarization is better than dropping, but not free

Sentence moves:

1. Chatbots often compact history invisibly.
2. Coding harnesses expose this more directly through auto-compact or manual summarize commands.
3. Summarization preserves more than a rolling window.
4. But compressing 200k tokens into 10k tokens at 200 output tokens/sec still takes about 50 seconds.
5. The summary is also lossy, because there is always more detail than the new window can hold.

Demonstration: “You can ask someone to summarize a book, but you cannot then quote every page from the summary.”

### 3. Memory versus knowledge base

Sentence moves:

1. Humans distinguish memory from reference material.
2. Software often treats both as stored text that can be retrieved.
3. The difference is mostly a product label and attribution choice.
4. For the model, both become context if the harness injects them.

Demonstration: “A personal preference note and a product manual page both become text in the prompt.”

### 4. Classic RAG: retrieve once, then answer

Sentence moves:

1. A documentation set might be 20M tokens.
2. You cannot paste the whole thing into one prompt.
3. Classic RAG chunks the docs, embeds the chunks, searches the vector index, and injects the top matches.
4. Vector databases rose because they made this retrieval pattern operational.
5. This is useful, but it is still a one-shot guess about what the user meant.

Demonstration: a librarian hears one question, grabs three pages, and leaves the room.

### 5. Agentic tool calling changes the shape

Sentence moves:

1. Models became better at producing structured JSON.
2. That JSON can conform to a schema that software can safely parse.
3. The harness can expose tools such as `search_memory`, `get_note`, or `set_preference`.
4. The model can decide when to call those tools.
5. The answer can now take multiple agent-loop turns before replying.

Demonstration: instead of one librarian trip, the model can ask follow-up searches internally.

### 6. Agentic RAG: the model explores

Sentence moves:

1. In classic RAG, the user query drives retrieval.
2. In agentic RAG, the model writes the retrieval query.
3. It can search, inspect results, refine the query, and search again.
4. The retrieval process becomes part of reasoning.

Demonstration: “Search docs for billing webhook,” then “open the migration note,” then “check the API reference.”

### 7. Memory sources are design choices

Sentence moves:

1. A memory source is any external place the harness lets the model query or update.
2. A vector database is good for semantic similarity.
3. A key-value store is simple and powerful for stable facts.
4. A temporal graph helps when facts change over time.
5. A filesystem can act as memory for coding agents.
6. A subagent can retrieve information and return a digest.

Demonstration: map each storage shape to a human analogy: bookshelf, sticky note drawer, timeline, project folder, research assistant.

### 8. Human memory words are useful metaphors

Sentence moves:

1. Short-term memory is the immediate conversation window.
2. Semantic memory is general facts and concepts.
3. Episodic memory is past interactions and preferences.
4. Procedural memory is repeatable workflows.
5. These are metaphors for storage and retrieval policies.

Demonstration: the same assistant remembers “you like Python,” “the API has webhooks,” and “run tests before summarizing a PR.”

### 9. The hard problems remain

Sentence moves:

1. The system still must decide what to store.
2. It must decide what to retrieve.
3. It must handle privacy, cost, scale, conflicts, and stale facts.
4. That is why products such as memory-as-a-service exist.

Demonstration: a bad memory is worse than no memory if it confidently retrieves outdated information.

### 10. Recursive language model idea

Sentence moves:

1. Compaction can feel slow because it generates a summary.
2. RLM-style systems move old context out of the prompt instead of summarizing it immediately.
3. The model can later inspect that old context through a tool or REPL-like environment.
4. This makes the current turn snappier.
5. Later turns may spend extra inference-time compute to reload the pieces they need.

Demonstration: archive the old chat in a box under the desk, then open the box only when the question requires it.
