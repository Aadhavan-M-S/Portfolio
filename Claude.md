# CLAUDE.md

# Portfolio System Prompt

You are building my personal portfolio website.

This is **not** a resume website.

This is **not** a template portfolio.

This should feel like a polished SaaS product that happens to showcase my work.

The quality should be comparable to websites like:

- https://wisprflow.ai
- https://slack.com
- https://www.atlassian.com
- https://mailchimp.com

The goal is that a recruiter, founder, or hiring manager immediately feels they are looking at the website of someone who builds products—not someone who copied a portfolio template.

---

# Repository Structure

```
about/
    bio.md

projects/

```

These folders are the **only source of truth.**

Read every markdown file before generating any page.

Never invent information.

Infer connections only when supported by the content.

---

# Important

Do NOT generate generic AI portfolio content.

Avoid phrases like

- Passionate developer
- Tech enthusiast
- Problem solver
- Driven student
- Hardworking individual
- Welcome to my portfolio
- I love coding
- Building innovative solutions

These immediately reduce credibility.

Every sentence should come from actual evidence inside the repository.

---

# Website Goal

The website should communicate that I build intelligent software products.

Visitors should understand that I work across

- AI Engineering
- Agentic AI
- Product Management
- Automation
- Full Stack Engineering
- Machine Learning

without explicitly saying it over and over.

Instead, demonstrate it through the work.

---

# Target Audience

Design primarily for

- AI startups
- Product-first startups
- Founders
- Product Managers
- Engineering Managers
- Recruiters

The website should also look credible to larger companies.

---

# Overall Feel

The portfolio should feel closer to

Slack

than

Dribbble.

Closer to

Atlassian

than

Behance.

Closer to

Wispr Flow

than

a student portfolio.

Think

"A modern SaaS landing page."

---

# Visual Style

The website should be elegant.

Minimal.

Professional.

Calm.

Confident.

Avoid trying too hard.

---

## Inspiration

Take inspiration from

Wispr Flow
Slack
Atlassian
Mailchimp

Do NOT copy layouts.

Instead copy the feeling.

Notice

- typography
- spacing
- hierarchy
- whitespace
- interactions
- simplicity

---

# Color Palette

Use mostly neutral colors.

White backgrounds.

Soft grays.

Muted blues.

Very subtle accent colors.

Avoid

- gradients
- neon colors
- glowing buttons
- rainbow text
- glassmorphism
- cyberpunk aesthetics
- shiny UI

The site should age well.

---

# Typography

Typography should carry the design.

Use generous spacing.

Large headings.

Readable paragraphs.

Comfortable line lengths.

Don't rely on decorative elements.

Let the content breathe.

---

# Animations

Animations should feel premium.

Slow.

Intentional.

Subtle.

Examples

- fade in
- slide up
- staggered reveal
- smooth hover
- gentle scaling
- elegant page transitions

Avoid

- bouncing
- spinning
- parallax overload
- floating cards everywhere
- flashy entrances

Every animation should have a purpose.

---

# Components

Prefer sections over cards.

Avoid putting everything inside rectangles.

Use whitespace.

Use dividers.

Use layout.

Not borders.

Cards should only exist where they improve readability.

---

# Hero Section

The hero should immediately communicate

who I am

what I build

why someone should care

Avoid generic titles.

Infer the strongest positioning from the repository.

Example direction

Building AI products that combine engineering, automation, and product thinking.

Don't literally use that.

Generate something better from the repository.

---

# Navigation

Keep navigation minimal.

Possible sections

About

Projects

Skills

Contact

No unnecessary pages.

---

# About Section

Read

about/bio.md

Use it as the source.

Rewrite naturally if needed.

Do not simply dump markdown onto the page.

---



# Projects

Read every project.

Treat every project like a product.

For each project infer

Problem

Motivation

Solution

Architecture

My Contributions

Technology Choices

Challenges

Results

Future Improvements

Do not make up metrics.

Only infer what is supported.

Projects should feel like mini case studies.

---


# Tech Stack

Do NOT hardcode a list.

Infer everything from

projects/

Rank technologies by frequency.

Group into

Languages

Frontend

Backend

AI

ML

LLMs

Agentic AI

Automation

Databases

Cloud

Developer Tools

Deployment

Product

Testing

Only include technologies that were actually used.

---

# Skills

Don't create meaningless progress bars.

Don't use percentages.

Don't use stars.

Instead create meaningful categories.

---

# Contact

Use information from

about/bio.md

Don't repeat unnecessary information.

---

# Content Rules

Never exaggerate.

Never invent.

Never fabricate numbers.

Never fabricate achievements.

Never fabricate architecture.

Infer only when strongly supported.

If information is missing, omit it.

---

# Code

Frontend stack

React

Vite

Custom CSS

Nothing else.

No Tailwind.

No Bootstrap.

No Chakra.

No Material UI.

No animation libraries unless absolutely necessary.

Write clean semantic React components.

Use reusable components.

Organize code properly.

Avoid giant files.

---

# CSS Philosophy

Use handwritten CSS.

Leverage

- CSS Grid
- Flexbox
- Variables
- Clamp()
- Container widths
- Media queries

Animations should be CSS-first.

No unnecessary dependencies.

---

# Responsiveness

Desktop-first.

Perfect tablet experience.

Excellent mobile experience.

No horizontal scrolling.

Everything should scale naturally.

---

# Performance

Lazy load where appropriate.

Optimize images.

Keep JavaScript minimal.

Avoid unnecessary rerenders.

Keep Lighthouse scores high.

---

# SEO

Generate

title

description

Open Graph tags

semantic HTML

proper heading hierarchy

accessible navigation

---

# Accessibility

Keyboard accessible.

Good contrast.

ARIA where needed.

Semantic HTML.

Readable font sizes.

Respect reduced-motion preference.

---

# Final Quality Checklist

Before considering the portfolio complete, verify that:

- It does not look AI generated.
- It does not resemble a portfolio template.
- It feels like a polished SaaS product.
- Typography is the primary design element.
- Whitespace is generous.
- Animations are subtle.
- There are no gradients.
- There is no glassmorphism.
- There is no visual clutter.
- Every project tells a story.
- Every experience emphasizes impact.
- The design is timeless.
- The content is inferred entirely from this repository.
- No technology or achievement has been fabricated.
- The website would look credible if it belonged to an engineer at a top AI startup.

When unsure between adding another element or removing one,

**remove it.**

Simplicity is a feature.