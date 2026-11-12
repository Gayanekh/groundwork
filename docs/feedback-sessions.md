# Feedback sessions — kit

> **Independent Speculative Concept — Not Affiliated with Artemis.**
> This is a plan and a set of empty templates. **No sessions have been run yet.** Fill in only what real participants said and did. If you run fewer than three, say so.

**Goal:** learn whether the core idea and the main workflow make sense to people who coordinate work, and fix the biggest problem you find.

**Time:** about 20 minutes per person. **Format:** video call with screen share, or in person on a laptop and a phone.

**Prototype:** https://groundwork-concept.vercel.app/app?latency=0
Before each session, open the app → workspace menu (top left) → **Reset demo data**, so everyone starts from the same state.

---

## 1. Who to ask (3 people)

Best → acceptable:

1. Someone who works at a solar, roofing, HVAC or home-improvement company (operations, project coordination, permitting, customer service).
2. Someone who coordinates projects with outside parties: construction, property management, event planning, logistics, a medical office front desk.
3. Anyone who has had solar, a new roof or a big home renovation installed (good for the **homeowner message** part).

Try to get at least one person from group 1 or 2. Write down each person’s *role*, not their name.

## 2. What to say at the start (read it, about 1 minute)

> Thanks for helping. I’m testing a design, not you, so there are no wrong answers. If something is confusing, that’s exactly what I need to know.
> This is a concept I designed and built myself. It isn’t a real company product, and all the names in it are made up.
> Please think out loud as you go: say what you’re looking at, what you expect, and what surprises you.
> I’ll take notes. Is it OK if I write down what you say? I won’t use your name.

If they say no to notes, don’t take notes and don’t include that session.

## 3. Context to give (30 seconds)

> Imagine you’re a project coordinator at a company that installs solar panels. After a customer signs, each project goes through steps: a site visit, design, a city permit, installation, an inspection, and finally the utility’s approval to turn the system on. You manage about 20 of these at once.

## 4. Tasks (don’t help unless they’re stuck for more than a minute)

| # | Task (read it as written) | What you’re watching for |
| --- | --- | --- |
| T1 | “It’s Monday morning. Look at this screen for 10 seconds, then tell me what you think you should do first.” | Do they understand the ranked list and why Maria is first? |
| T2 | “Open the project that needs you most. Why is it stuck?” | Do they find and understand the blocker and the reasons? |
| T3 | “The city just received the engineer’s letter. Record that and move the project forward.” | Do they find **Resolve**, then the last checklist item, then **Move to Installation**? Do they read the disabled-button reason? |
| T4 | “Let Maria know what’s happening.” | Do they find the update composer? Is the drafted message clear? Do they notice the jargon check? |
| T5 | “Find all projects for Marcus that are blocked.” | Do filters make sense? |
| T6 *(optional, on a phone)* | Repeat T2 on a phone. | Anything that breaks or feels cramped on mobile. |

## 5. Questions at the end (5 minutes)

1. What was the most useful thing you saw? Why?
2. What was the most confusing moment?
3. How do you keep track of this kind of work today? *(only if they do similar work)*
4. Is anything missing that you would need on day one?
5. If you got the message to Maria as a homeowner, would it answer your questions? What would you still call about?

Ask “why?” and “can you show me?” more than “would you use this?” People are kind about hypothetical use; behavior is more honest.

## 6. Note template (copy once per participant)

```
Participant: P1    Role: ______________________    Date: ________   Device: desktop / phone

T1 first action: ________________   Correct? Y / N
   What they said:
T2 found reason in: ____ seconds    Understood the blocker? Y / partly / N
   What they said:
T3 completed without help? Y / with a hint / N
   Where they hesitated:
   Read the disabled-button reason? Y / N
T4 found composer? Y / N     Changed the draft? Y / N     Noticed jargon check? Y / N
   What they said about the message:
T5 completed? Y / N
   What they said:

Most useful (their words):
Most confusing (their words):
Missing:
Other quotes (exact words, in quotes):
```

## 7. After all sessions: decide what to fix

| Problem | How many of 3 hit it | How bad (blocked / slowed / annoyed) | Fix idea |
| --- | --- | --- | --- |
| | | | |
| | | | |

Pick **one** problem that most people hit and that blocked or slowed them. Fix it in the prototype, then write the case-study section below.

## 8. Case-study section to fill in (paste into `docs/case-study.md`)

```markdown
## What I learned from feedback

I ran [N] 20-minute sessions with [roles, e.g. “an operations coordinator at a roofing company, a property manager, and a homeowner who recently installed solar”]. I asked each person to complete [N] tasks while thinking out loud. These were informal sessions, not a formal study.

**What worked:** [1–2 findings, with a short quote]

**What didn’t:** [the main problem, how many people hit it, what they did]

**What I changed:** [the fix, with a before/after screenshot]

**What I’d test next:** [one open question]
```

Rules for this section: use exact quotes, give real counts (“2 of 3”), and don’t turn opinions into percentages.
