# DDR-043-Profile Pills Open a New Tab

Status: Accepted

Date: 2026-09-19

**Supersedes in part DDR-010**: the bullet "Links open in the same tab", for the LinkedIn and
GitHub contact pills and for nothing else. Every other link on the page still opens in the same
tab. DDR-006's "nothing opens a new window unannounced", which DDR-010 carried forward, still holds:
these two links are announced.

Everything DDR-029 decides about the pills' labels, DDR-027 about their size, and DDR-035 about
their hover and focus states stands.

## Context

Epic #131 refines how the contents bar and the contact pills behave. Issue #134 is its third story.
A recruiter who checks the owner's LinkedIn or GitHub usually means to come back, and today the
profile replaces the page, so the visitor has to find their way back to it.

The story asks for six things. The LinkedIn and GitHub pills open a new tab, by mouse, touch and
keyboard, and leave the site open in its own. The email pill opens the mail client as it does today
and no tab. Each pill that opens a tab says so before it is chosen, to assistive technology and to a
sighted visitor, in a way this record decides. The new tab cannot control or redirect the site's.
The visible labels stay DDR-029's. And the printed CV is unchanged.

Why announce it at all: an unannounced new tab is a known accessibility fault, which is why DDR-006
ruled it out. A screen-reader user, or anyone who uses the back button to return, finds that back
does nothing in the new tab and may not know the site is still open. WCAG 3.2.5 (AAA) asks that a
change of context be initiated only by the user, and G201 is the technique that meets it: warn the
user in advance that a link opens a new window.

## Decision

**The LinkedIn and GitHub pills open their address in a new tab and say so with an arrow after the
label, which assistive technology reads as "opens in a new tab". The email pill, the footer's
addresses, the project links and the CV control are unchanged.**

* **The two profiles, and nothing else.** They are the page's two ways to leave for a site a visitor
  means to come back from. `mailto:` opens a mail client, which is not a tab, and a new tab around it
  would be left empty. The CV control downloads. The project links and the footer's addresses are
  out of the story's scope, and are discussed under Consequences.
* **The cue is an arrow after the label, pointing up and to the right**, drawn like every other mark
  in `components/icon.tsx`: in `currentColor`, 1em square, two strokes on the 24 unit grid, and one
  `--space-small` gap from the label. It is the conventional sign that a link leaves for somewhere
  else, and it sits after the label so the service's own mark, before the label, still names the
  service first.
* **The arrow is the announcement, not a decoration beside one.** It is the one mark on the page
  that is an image with a name, where every other mark is `aria-hidden`: `role="img"` and
  `aria-label` set to the content string "opens in a new tab". Measured in Chromium, the link's
  accessible name is "LinkedIn opens in a new tab". So the sighted cue and the spoken one are the
  same element, and cannot drift apart. The string lives in `content/introduction.ts`, per ADR-002,
  and which contacts open a tab is a `newTab` flag beside each contact rather than something worked
  out from the address, for the reason DDR-010 gives for the icon.
* **The visible label comes first**, so the name a speech-input user reads off the pill is still the
  start of its accessible name, per WCAG 2.5.3.
* **`rel="noopener"` is written out.** Browsers imply it for `target="_blank"` today, and it is
  written so the guarantee does not rest on that default: the new tab's `window.opener` is `null`,
  so it cannot redirect the site's tab. `noreferrer` is not added: which page sent the visitor is
  harmless to LinkedIn and GitHub and the story does not ask to hide it.
* **Hover and focus are DDR-035's.** The arrow is drawn in the pill's ink, so it changes with it.
* **Paper drops the arrow.** Nothing opens on paper, so there is nothing to warn of, and the printed
  CV is pixel-identical to the tree before, in Edge and Firefox, with background graphics on and
  off.

## Alternatives Considered

### Visually hidden text instead of a named arrow

Pros:
* The most widely used pattern, and the text is read in every screen reader regardless of how it
  computes an SVG's name.

Cons:
* The site has no visually hidden utility, so this adds one, and a sighted cue would still be
  needed beside it — two elements saying one thing, free to drift apart.
* Clipped text is still laid-out text, so it can reach a printed PDF's text layer and make the
  printed CV read "LinkedIn opens in a new tab" when copied, unless it is hidden in print too. This
  was not measured; the arrow avoids the question.

### `title` attribute, or a tooltip on hover

Cons:
* Not shown on touch or keyboard focus, and not reliably announced, so it fails the story's "before
  it is chosen" for most visitors.

### The words "(new tab)" in the label

Cons:
* Changes DDR-029's visible labels, which the story forbids, and widens each pill by far more than
  an arrow.

### No cue, as many sites do

Cons:
* Breaks DDR-006's rule, which DDR-010 carries and the story keeps.

### Open every external link in a new tab, including the footer's and the projects'

Pros:
* The same destination would behave the same wherever it is linked from.

Cons:
* Beyond the story, which scopes them out. The footer's addresses carry no mark, and an arrow in
  the footer is a change to DDR-028's design; the project links are underlined text links, where a
  visitor controls a new tab with the browser's own gestures.

## Consequences

Benefits:
* A visitor who checks a profile keeps the site open behind it.
* The new tab is announced to everyone, before the pill is chosen, by one element.

Tradeoffs:
* **The two pills are 21px wider**: LinkedIn 105.5px to 126.5px and GitHub 97.9px to 118.9px, one
  mark and one gap each. Their height is 37.1px as before. Swept every 10px from 300px to 900px and
  at 1280px and 1536px, at the default text size and at 200%, nothing scrolls sideways anywhere, and
  the controls row keeps its number of rows everywhere except:
  * at the default size, 490px to 520px, where the row is two rows rather than one, and the controls
    end 45px lower;
  * at 200%, 450px to 480px (four rows, was three) and 490px to 530px (three, was two).
  At 360px and 390px GitHub moves from the first row to the second, and the row's height does not
  change: at 390 by 844 the controls still end 842.5px down, above the fold.
* **The same address now behaves two ways.** LinkedIn and GitHub open a new tab from the pill and the
  same tab from the footer. The footer's links are addresses, not controls, and carry no arrow to say
  otherwise; extending the rule to them is a decision for another story.
* #135 replaces the pills' service marks and asks that no pill grow. It is measured against the
  pills as this record leaves them.

Risks:
* A screen reader that ignores an SVG's `role="img"` name would announce the link as "LinkedIn"
  only, without the warning. `role="img"` with `aria-label` on an inline SVG is the supported way to
  name one, and Chromium computes the name as intended, but no screen reader was run on this story.

## Related Documents

* Issue #134 and Epic #131
* DDR-010, the "Links open in the same tab" bullet this supersedes in part
* DDR-006, whose "nothing opens a new window unannounced" still holds
* DDR-029, the pills' labels; DDR-035, their hover states; DDR-015, print
* ADR-002, which keeps the announcement's words in `content/`
