export const PERSONAL_RAG_BODY = `## Why this stayed on one VPS

This note is an outline of a personal retrieval setup that
lives on a single machine. The public facts are already on
the card: it is local-first, and it does not leave that VPS.

Deeper architecture, model names, and exact versions are
still being written. I am not filling those gaps with a
demo stack.

### What I wanted

- Search my own notes without sending them out
- Keep the moving parts few enough to understand
- Leave a trail I can read six months later

The rest of the runbook belongs in the finished draft.

## A calm ingest path

Ingest should be boring. A folder of notes goes in. Chunks
come out. Nothing here is a product announcement.

\`index.py\` is a placeholder for the real script:

\`\`\`py
def warm_cache(paths):
    for path in paths:
        prefetch(path)
\`\`\`

Until the full article is ready, treat that as a sketch
rather than a specification.

## What I still need to write

1. How documents are chunked
2. How I evaluate a hit
3. How I recover when the index is stale

> The useful version of this post will name the trade-offs.
> This version only keeps the shape of the room.

If you want the public summary, stay with the excerpt. The
longer technical walkthrough is still on the desk.

![Placeholder figure for the VPS notes](/images/articles/personal-rag-vps.webp)

See also the [projects workshop](/projects) for the related
build card.
`;

export const AI_AUTOMATIONS_BODY = `## After the demo glow

The lesson that survived is simple: a clever path that only
works on stage is not a system. This draft keeps that
sentence and leaves the case studies unwritten.

### What I am not claiming yet

I am not listing vendors, prompts, or private workflows
here. Those details will land when they are accurate.

- Prefer a boring log over a glowing UI
- Measure the second week, not the first evening
- Rewrite anything that needs a narrator

## A small rewrite

\`\`\`ts
const ready = jobs.filter((job) => job.stable);
\`\`\`

That line is a reminder, not a framework.

> Tools get loud. The work should not.
`;

export const FINDING_FOCUS_BODY = `## Attention is a room

This is a short note about keeping a desk usable when every
tool wants a badge. It is not a method, and it is not a
challenge.

### Habits that lasted

- One inbox for writing
- A walk before I open the noisy apps
- Closing the tab that is only performing curiosity

The longer list is still being edited.

> If a system needs constant cheering, it is probably
> stealing the hour I meant to spend on the work.

I will add the concrete week I tested this once the draft
is honest enough to publish in full.
`;

export const QUIET_DESK_BODY = `## A quieter automation desk

The public claim is small: scripts, clear logs, and fewer
notifications that shout. The wiring diagram is still on
paper.

### What belongs here later

1. The jobs that actually stayed
2. The alerts I deleted
3. The log format I can still read

\`\`\`bash
npm run build
\`\`\`

That command is only a stand-in for "know when the desk is
healthy." The real runbook is not written yet.

> Silence is a feature when the work is already done.
`;

export const SAME_PATH_BODY = `## Walking the same path twice

Repeating a familiar walk still changes how I write. This
draft keeps the observation and leaves the travelogue for
the finished piece.

The path itself does not need a map in this version. The
useful part is the return: same trees, slightly different
questions.

> I solve fewer imaginary problems after I have been
> outside.

I will add the route notes when they are more than
atmosphere.
`;

export const WEEK_WITHOUT_MAP_BODY = `## Moving slowly

These are travel notes about walking without a tight plan.
I am not turning a week into a productivity essay.

### What I noticed

- Transit systems explain a city faster than slogans
- A paper map still earns its pocket
- The best hour was usually the unscheduled one

The named places and dates are still being checked. I
would rather leave them blank than invent a route.

> Look at the systems, then look up.
`;
