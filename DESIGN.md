---
version: "0.2.0"
name: "Travel Landing"
description: "A travel landing page design system with dual theme support (travel / admin)"
themes:
  travel:
    primary: "#0EA5E9"
    secondary: "#075985"
    accent: "#38BDF8"
    background: "#F7FCFF"
    surface: "#FFFFFF"
    surface-card: "#EFF8FF"
    text-primary: "#0C4A6E"
    text-secondary: "#486581"
    text-on-surface: "#0C4A6E"
    text-on-surface-muted: "#6B8CA5"
    border: "#BAE6FD"
    border-light: "#D9F1FF"
  admin:
    primary: "#0284C7"
    secondary: "#0369A1"
    accent: "#7DD3FC"
    background: "#F0F9FF"
    surface: "#FFFFFF"
    surface-card: "#E0F2FE"
    text-primary: "#082F49"
    text-secondary: "#486581"
    text-on-surface: "#082F49"
    text-on-surface-muted: "#5B7C93"
    border: "#7DD3FC"
    border-light: "#BAE6FD"
typography:
  display-lg:
    fontFamily: "Inter"
    fontSize: "64px"
    fontWeight: 500
    lineHeight: "1.04"
    letterSpacing: "0"
  body-md:
    fontFamily: "Inter"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "1.6"
  label-md:
    fontFamily: "JetBrains Mono"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: "1.2"
spacing:
  base: "8px"
  gap: "16px"
  card-padding: "24px"
  section-padding: "80px"
rounded:
  card: "23px"
  control: "23px"
  pill: "9999px"
components:
  card:
    background: "Use surface-card token with subtle borders and HTML-matched shadow depth"
    radius: "Match the declared card radius token"
  button:
    background: "Use primary or accent colors for the main action"
    radius: "Use the control or pill radius based on the source HTML"
---

# Sylvan Testimonials Array

Source: Neuform Featured templates from top creators. Author: Meng To (@mengto). Views: 30; favorites: 8; remixes: 5.
Tags: testimonial, section, social-proof, animated, bento.

## Overview

Sylvan Testimonials UI Showcase Section is designed for demonstrating an application interface and hierarchy. Key features include dashboard-like visual hierarchy and dense but readable content organization. Built with custom CSS, it is suitable for product showcases and interface-first landing experiences.

This version ships with two selectable themes:

- **travel** — white and sky-blue palette for public-facing / marketing contexts.
- **admin** — crisp white and deeper sky-blue palette for dashboard / console contexts.

@field_ops @dr_aris A place to display your field milestones. "Sylvan completely revolutionized our data collection in deep forest sectors." Elara Vance "Integrating their packets into our mesh networks was entirely sea…

## Composition

Use the attached HTML reference as the source of truth. Preserve the visible hierarchy, first-screen composition, section rhythm, density, and interaction tone before adapting copy or content.
Key visible headings include: A place to display your field milestones.; Elara Vance; Dr. Aris; Jonah R. Fielding; Team Alpha; M. Chen.

## Colors

Two theme tokens are defined under `themes` in the frontmatter above — `travel` and `admin` — sharing the same role names (`primary`, `secondary`, `accent`, `background`, `surface`, `text-primary`, etc.) so components can switch themes without changing markup, only the active token set.

- **travel**: anchor in primary `#0EA5E9`, secondary `#075985`, accent `#38BDF8`, background `#F7FCFF`, surface `#FFFFFF`.
- **admin**: anchor in primary `#0284C7`, secondary `#0369A1`, accent `#7DD3FC`, background `#F0F9FF`, surface `#FFFFFF`.

Keep background, surface, text, and border roles distinct within each theme so generated layouts retain the same contrast pattern as the source, regardless of which theme is active.

## Typography

Use Inter for display moments and Inter for body copy unless the HTML clearly demands a compatible fallback. Labels and technical metadata should use JetBrains Mono or an equivalent mono face. Typography scale is shared across both themes — only color roles change.

## Layout

Keep spacing deliberate and stable. Favor the same grid direction, max-width behavior, card density, and responsive stacking seen in the HTML. Do not replace distinctive source structures with generic SaaS sections.

## Components

Cards, buttons, badges, navigation, and repeated blocks should preserve the source geometry, border treatment, and hover feel, using the active theme's token values for fills, borders, and text.

## Motion

Preserve existing motion cues such as masked reveals, staggered entrance, hover lift, scroll-triggered transitions, and ambient movement. Keep easing smooth and restrained. Theme switching itself should cross-fade background and text-color transitions rather than cut instantly.

## WebGL & Effects

If the source includes canvas, WebGL, Three.js, gradients, particles, or atmospheric effects, rebuild them as supporting layers behind the content. Keep effects performant, responsive, and secondary to the interface.

## Guardrails

- Do not flatten the source into a generic card grid.
- Do not mix theme tokens — a component should draw entirely from one active theme at a time.
- Preserve the first viewport signal, focal object, and visual density in both themes.
- Keep buttons, cards, and badges aligned to the same radius and border language across themes.
