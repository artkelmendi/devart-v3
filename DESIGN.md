---
name: Devart
description: A white-first engineering portfolio with technical typography and small blue signals.
colors:
  blue: "#9cdef4"
  ink: "#111"
  muted: "#5e6266"
  line: "#d9dcdf"
  white: "#fff"
  surface: "#f7f8f9"
  focus: "#087495"
typography:
  display:
    fontFamily: "Chakra Petch, sans-serif"
    fontSize: "clamp(64px,7.7vw,132px)"
    fontWeight: 600
    lineHeight: 0.97
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Chakra Petch, sans-serif"
    fontSize: "clamp(32px,4.2vw,64px)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Chakra Petch, sans-serif"
    fontSize: "26px"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Space Mono, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.9
  label:
    fontFamily: "Space Mono, monospace"
    fontSize: "11px"
    fontWeight: 400
rounded:
  pill: "99px"
spacing:
  gutter: "clamp(24px, 5vw, 88px)"
components:
  contact-button:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "23px 30px"
  contact-button-hover:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.ink}"
  work-arrow:
    backgroundColor: "{colors.blue}"
    width: "38px"
    height: "38px"
  nav-link:
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "9px 17px"
  nav-link-current:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.ink}"
  tag:
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "5px 11px"
  code-console:
    backgroundColor: "{colors.white}"
---

# Design System: Devart

## Overview

**Creative North Star: "The Engineer’s Working Portfolio"**

Mostly white, sharply framed and visibly technical. Squared display lettering, monospaced copy, real website previews and decorative code express the engineer’s work without overpowering it.

Motion carries this language through heading reveals, small interactive transformations and slow ambient loops. The original Devart symbol retains its supplied geometry.

**Key Characteristics:**
- White surfaces and near-black type.
- Small light-blue signals and controls.
- Robotic headlines, monospaced interface text and code.
- Sharp frames, pill controls and responsive motion.

## Colors

### Primary
Light blue (`blue`) marks brackets, small squares, progress, selected navigation, code controls and interaction states. Darker blue details support code syntax and visible focus.

### Neutral
White (`white`) dominates the page. Near-black (`ink`) carries headings and primary actions; `muted` supports prose; `line` separates content. The pale `surface` distinguishes the service area.

**The Small Signal Rule.** Keep blue on small objects and controls; retain white as the dominant surface.

## Typography

Chakra Petch provides uppercase headings at weight 600; Space Mono provides body copy, labels and code at weight 400. Both are locally hosted with sans-serif and monospace fallbacks respectively. The frontmatter captures desktop roles, not a mathematical type scale.

Hero display uses the largest solid type; section headlines step down; project titles remain compact. Body copy uses generous leading. Labels are compact and often uppercase. The contact heading combines solid and outlined lettering. At smaller widths the hero uses viewport sizing, section headings step down, and body copy generally becomes 12px.

**The Two Voices Rule.** Use Chakra Petch for expressive headings and Space Mono for reading, code and controls.

## Layout

Fluid shared gutters frame broad white sections. Desktop hero columns use a 1.7:1 ratio; projects use two columns with a 38px horizontal gap, 65px vertical gap and a 75px offset on even items. About content uses two equal columns. Section spacing is generous rather than a fabricated uniform scale.

At 1100px, the hero tightens, service bodies stack and footer controls wrap. At 760px, the hero and about stack, navigation moves below the header, contact becomes one column, and projects retain two tighter columns. At 480px, projects become one column without offsets and the code scene stacks. At 1600px and above, the hero gains height. These are the implemented breakpoints.

## Elevation & Depth

No box shadows. Depth comes from fine borders, subtle neutral surfaces, screenshot cropping and motion. Decorative code remains visually recessive; white frames contain the functional content.

## Shapes

Project previews, console and contact frame have sharp corners and fine borders. Navigation, contact action and service tags use pills. Small squares, line arrows and code brackets supply the technical geometry; the work arrow becomes circular on hover.

## Components

- **Navigation:** fixed white pill with a gray border; current section receives blue fill, hover receives pale gray. Mobile placement moves below the header.
- **Actions:** black contact pill becomes blue and gently scales on hover. The work link pairs a small blue arrow square with a mono label. Interactive elements use a visible focus outline with a 6px offset.
- **Projects:** four real site previews in browser-like frames. Hover or keyboard focus scales the image and reveals a blue visit action; on mobile that overlay is hidden while the whole project remains linked. Titles and descriptions sit below the frame.
- **Services:** native disclosure rows separated by rules, large headings and outlined descriptive tags. Opening rotates the arrow and reveals explanatory copy with an email link.
- **Code console:** white bordered frame, filename header, illustrative code and three selectable example buttons. Selected buttons turn blue; content changes with a short entrance.
- **Motion:** shared easing is recorded in the sidecar. Heading reveals run for 850ms; content entrances for 700ms. Ambient loops pause offscreen and when the document is hidden. The persistent motion control disables nonessential motion; device reduced-motion preferences take precedence.

## Do's and Don'ts

### Do:
- **Do** keep the interface predominantly white with small blue signals.
- **Do** preserve the supplied Devart symbol geometry and use real project previews.
- **Do** retain keyboard focus, native disclosure behavior and both motion controls.

### Don't:
- **Don't** replace the technical font pairing with plain sans-serif typography.
- **Don't** expand blue accents into dominant section backgrounds.
- **Don't** make content visibility depend on an animation completing.
