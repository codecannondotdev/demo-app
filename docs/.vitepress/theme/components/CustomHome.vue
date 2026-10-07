<script setup lang="ts">
/**
 * Documentation landing page.
 *
 * Reads as a continuation of the marketing site: hero on the blueprint dot
 * grid, hairline-divided section rows, a cream quick-start strip, and the
 * yellow closing band with the cannon watermark. The hero and section grid
 * follow the docs colour scheme; the cream strip, yellow band and black
 * footer are fixed, as they are on the website.
 */
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useData } from "vitepress";

interface SidebarItem {
  text?: string;
  link?: string;
  items?: SidebarItem[];
}

const { theme } = useData();

const sectionMeta: Record<string, { description: string; href: string }> = {
  "Getting Started": {
    description:
      "Create an account, generate your first app and run it locally with a single command.",
    href: "/getting-started/generating-applications",
  },
  Essentials: {
    description:
      "Architecture, authentication, user management, testing, CI/CD, Docker and Kubernetes.",
    href: "/essentials/architecture-overview",
  },
  Frontend: {
    description:
      "The Model, Api and States trinity, form utilities, the query builder and shared components.",
    href: "/frontend/model",
  },
  Backend: {
    description:
      "CRUD controllers and the helpers behind filtering, relations, seeding and search.",
    href: "/backend/crud-controllers",
  },
  "Generated Files": {
    description:
      "A file-by-file tour of everything Codecannon writes into your repository.",
    href: "/generated-files/frontend/views/list",
  },
  API: {
    description:
      "Signatures, options and return types for every composable, component and helper.",
    href: "/api/frontend/api",
  },
};

function countLinks(items: SidebarItem[] = []): number {
  return items.reduce(
    (n, item) => n + (item.link ? 1 : 0) + countLinks(item.items),
    0,
  );
}

function firstLink(item: SidebarItem): string | undefined {
  if (item.link) return item.link;
  for (const child of item.items ?? []) {
    const link = firstLink(child);
    if (link) return link;
  }
  return undefined;
}

const sections = computed(() => {
  const sidebar = theme.value.sidebar;
  const groups: SidebarItem[] = Array.isArray(sidebar)
    ? sidebar
    : (Object.values(sidebar ?? {}).flat() as SidebarItem[]);

  return groups
    .filter((group) => group.text)
    .map((group, i) => {
      const meta = sectionMeta[group.text!];
      return {
        index: String(i + 1).padStart(2, "0"),
        title: group.text!,
        count: countLinks(group.items),
        description: meta?.description ?? "",
        href: meta?.href ?? firstLink(group) ?? "/",
      };
    });
});

const totalPages = computed(() =>
  sections.value.reduce((n, section) => n + section.count, 0),
);

type MapLine =
  | { kind: "dir"; text: string; meta: string; href: string }
  | { kind: "file"; text: string; note: string; href: string };

const fileMap: MapLine[] = [
  {
    kind: "dir",
    text: "api/",
    meta: "Laravel",
    href: "/backend/crud-controllers",
  },
  {
    kind: "file",
    text: "app/Http/Controllers/",
    note: "CRUD controllers",
    href: "/generated-files/backend/controllers",
  },
  {
    kind: "file",
    text: "app/Helpers/",
    note: "Filter · Relation · Seeder",
    href: "/backend/filter-helper",
  },
  {
    kind: "file",
    text: "database/migrations/",
    note: "Migrations",
    href: "/generated-files/backend/migrations",
  },
  {
    kind: "file",
    text: "routes/api.php",
    note: "Routes",
    href: "/generated-files/backend/routes",
  },
  {
    kind: "dir",
    text: "ui/",
    meta: "Vue · TypeScript",
    href: "/frontend/model",
  },
  {
    kind: "file",
    text: "src/models/",
    note: "Model · Api · States",
    href: "/generated-files/frontend/business-logic/model",
  },
  {
    kind: "file",
    text: "src/views/",
    note: "List · Edit",
    href: "/generated-files/frontend/views/list",
  },
  {
    kind: "file",
    text: "src/components/",
    note: "Forms · Relation widgets",
    href: "/generated-files/frontend/components/form",
  },
  {
    kind: "dir",
    text: "infrastructure",
    meta: "Ship it",
    href: "/essentials/docker",
  },
  {
    kind: "file",
    text: "docker-compose.yml",
    note: "Docker",
    href: "/essentials/docker",
  },
  {
    kind: "file",
    text: "deliverables/k8s/",
    note: "Kubernetes",
    href: "/essentials/kubernetes",
  },
  {
    kind: "file",
    text: ".github/workflows/",
    note: "CI/CD",
    href: "/essentials/ci-cd",
  },
];

const steps = [
  {
    index: "01",
    title: "Define",
    description:
      "Describe your app to the assistant or model it by hand in the builder: modules, columns, relations.",
    linkText: "Generating applications",
    href: "/getting-started/generating-applications",
  },
  {
    index: "02",
    title: "Generate",
    description:
      "Codecannon writes the Laravel API, the Vue UI, tests, Docker and CI/CD. Same schema, same code, every time.",
    linkText: "Architecture overview",
    href: "/essentials/architecture-overview",
  },
  {
    index: "03",
    title: "Run",
    description:
      "Clone the delivered repository, copy the example env files and bring the whole stack up locally.",
    code: "docker compose up",
    linkText: "Local setup",
    href: "/getting-started/local-setup",
  },
];

const year = new Date().getFullYear();

/* Scroll reveal, mirroring the website's v-reveal directive. Elements
   already on screen at mount are shown immediately. */
const root = ref<HTMLElement>();
let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer?.unobserve(entry.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );

  const elements = root.value?.querySelectorAll<HTMLElement>("[data-reveal]");
  elements?.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;
    if (el.dataset.reveal) {
      el.style.setProperty("--reveal-delay", `${el.dataset.reveal}ms`);
    }
    el.classList.add("reveal");
    observer?.observe(el);
  });
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <div ref="root" class="cc-home">
    <!-- ============================ HERO ============================ -->
    <section class="cc-hero cc-grid-bg">
      <div class="cc-container cc-hero__inner">
        <div class="cc-hero__copy">
          <p class="cc-eyebrow cc-hero__eyebrow">Developer documentation</p>
          <h1 class="cc-hero__title">
            Your app is generated.<br />
            <span class="cc-hero__accent">Here's how it works.</span>
          </h1>
          <p class="cc-hero__sub">
            Guides and reference for every file Codecannon writes: the Laravel
            API, the Vue UI, Docker and CI/CD. Read it, extend it, ship it.
          </p>
          <div class="cc-hero__actions">
            <a
              class="cc-btn cc-btn--yellow"
              href="/getting-started/generating-applications"
            >
              Get started
            </a>
            <a
              class="cc-btn cc-btn--outline"
              href="/essentials/architecture-overview"
            >
              Architecture overview
            </a>
          </div>
          <p class="cc-hero__note">
            <kbd>Ctrl</kbd><kbd>K</kbd>
            <span>searches all {{ totalPages }} pages</span>
          </p>
        </div>

        <div class="cc-hero__visual">
          <div class="cc-map" aria-label="Map of a generated application">
            <div class="cc-map__bar">
              <span class="cc-map__marker"></span>
              <span class="cc-map__title">your-app · generated files</span>
              <span class="cc-map__status">
                <span class="cc-map__dot"></span>
                documented
              </span>
            </div>
            <div class="cc-map__body">
              <template v-for="(line, i) in fileMap" :key="i">
                <a
                  v-if="line.kind === 'dir'"
                  class="cc-map__line cc-map__line--dir"
                  :href="line.href"
                  :style="{ '--i': i }"
                >
                  <span class="cc-map__square"></span>
                  <span class="cc-map__text">{{ line.text }}</span>
                  <span class="cc-map__meta">{{ line.meta }}</span>
                </a>
                <a
                  v-else
                  class="cc-map__line cc-map__line--file"
                  :href="line.href"
                  :style="{ '--i': i }"
                >
                  <span class="cc-map__check">✓</span>
                  <span class="cc-map__text">{{ line.text }}</span>
                  <span class="cc-map__note">
                    {{ line.note }}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </span>
                </a>
              </template>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================== SECTIONS ========================== -->
    <section class="cc-sections">
      <div class="cc-container">
        <div class="cc-head" data-reveal>
          <p class="cc-eyebrow cc-sections__eyebrow">Browse by topic</p>
          <h2 class="cc-h2 cc-h2--scheme">Pick your starting point.</h2>
        </div>

        <div class="cc-sections__grid">
          <a
            v-for="(section, i) in sections"
            :key="section.title"
            class="cc-section"
            :href="section.href"
            :data-reveal="i * 70"
          >
            <span class="cc-section__index">{{ section.index }}</span>
            <span class="cc-section__title">{{ section.title }}</span>
            <span class="cc-section__desc">{{ section.description }}</span>
            <span class="cc-section__meta">
              {{ section.count }} {{ section.count === 1 ? "page" : "pages" }}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>

    <!-- =========================== STEPS ============================ -->
    <section class="cc-steps">
      <div class="cc-container">
        <div class="cc-head" data-reveal>
          <p class="cc-eyebrow">The short version</p>
          <h2 class="cc-h2 cc-h2--dark">
            Schema in. App out. Then it's yours.
          </h2>
        </div>

        <div class="cc-steps__grid">
          <a
            v-for="(step, i) in steps"
            :key="step.index"
            class="cc-step"
            :href="step.href"
            :data-reveal="i * 90"
          >
            <span class="cc-step__index">{{ step.index }}</span>
            <span class="cc-step__title">{{ step.title }}</span>
            <span class="cc-step__desc">{{ step.description }}</span>
            <code v-if="step.code" class="cc-step__code">
              <span class="cc-step__prompt">$</span>{{ step.code }}
            </code>
            <span class="cc-step__link">{{ step.linkText }}</span>
          </a>
        </div>
      </div>
    </section>

    <!-- =========================== CLOSE ============================ -->
    <section class="cc-close">
      <svg
        class="cc-close__mark"
        viewBox="0 0 79.6 57"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M74.5,37.9h-23.5l20.2-30.7c.6-1.1.3-2.2-.4-2.9-.7-.7-1.8-1-2.9-.4l-31.4,19.5L24.3,4.7c-1.3-2-4.4-1.1-4.4,1.3v31.9H3.2v16.7h16.7v-16.7h16.7v16.7h16.7l22.4-12.2c2.2-1.2,1.3-4.5-1.1-4.5h-.1Z"
        />
      </svg>
      <div class="cc-container cc-close__content" data-reveal>
        <h2 class="cc-h2 cc-h2--dark">Ready to build?</h2>
        <p class="cc-close__sub">Your first app is one schema away.</p>
        <div class="cc-close__actions">
          <a class="cc-btn cc-btn--black" href="https://app.codecannon.dev">
            Start building free
          </a>
          <a
            class="cc-btn cc-btn--outline-dark"
            href="/getting-started/generating-applications"
          >
            Read the guide
          </a>
        </div>
      </div>
    </section>

    <!-- ========================== FOOTER ============================ -->
    <footer class="cc-footer">
      <div class="cc-container cc-footer__inner">
        <a class="cc-footer__brand" href="https://codecannon.dev">
          <img src="/logo.svg" alt="codecannon" />
        </a>
        <nav class="cc-footer__links" aria-label="Codecannon">
          <a href="https://codecannon.dev">Website</a>
          <a href="https://codecannon.dev/blog">Blog</a>
          <a href="https://codecannon.dev/pricing">Pricing</a>
          <a href="https://discord.gg/BKrcjeaBdv">Discord</a>
          <a href="mailto:support@codecannon.dev">Support</a>
        </nav>
        <div class="cc-footer__legal">
          <span>© {{ year }} Codecannon</span>
          <a href="https://app.codecannon.dev/privacy-policy">Privacy policy</a>
          <a href="https://app.codecannon.dev/terms-of-service">
            Terms of service
          </a>
          <a href="https://app.codecannon.dev/cookie-notice">Cookie notice</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* ------------------------------------------------------------------
   Shared
   ------------------------------------------------------------------ */
.cc-home {
  --home-ease: cubic-bezier(0.22, 1, 0.36, 1);

  /* Light scheme */
  --home-hero-bg: var(--cc-cream);
  --home-sections-bg: #ffffff;
  --home-text: #1a171c;
  --home-muted: rgba(26, 23, 28, 0.7);
  --home-faint: rgba(26, 23, 28, 0.45);
  --home-eyebrow: rgba(26, 23, 28, 0.6);
  --home-eyebrow-accent: rgba(26, 23, 28, 0.6);
  --home-dots: rgba(26, 23, 28, 0.18);
  --home-divider: rgba(26, 23, 28, 0.1);
  --home-hairline: rgba(26, 23, 28, 0.22);
  --home-hover-title: #1a171c;
  --home-outline-hover-bg: #1a171c;
  --home-outline-hover-text: var(--cc-yellow);
  --home-kbd-border: rgba(26, 23, 28, 0.25);
  --home-kbd-text: rgba(26, 23, 28, 0.8);

  width: 100%;
  overflow-x: hidden;
  font-family: var(--vp-font-family-base);
}

.dark .cc-home {
  --home-hero-bg: var(--cc-dark);
  --home-sections-bg: var(--cc-dark);
  --home-text: #ffffff;
  --home-muted: rgba(255, 255, 255, 0.72);
  --home-faint: rgba(255, 255, 255, 0.4);
  --home-eyebrow: rgba(255, 255, 255, 0.55);
  --home-eyebrow-accent: var(--cc-yellow);
  --home-dots: rgba(255, 255, 255, 0.09);
  --home-divider: rgba(255, 255, 255, 0.08);
  --home-hairline: rgba(255, 255, 255, 0.18);
  --home-hover-title: var(--cc-yellow);
  --home-outline-hover-bg: rgba(255, 255, 255, 0.1);
  --home-outline-hover-text: #ffffff;
  --home-kbd-border: rgba(255, 255, 255, 0.18);
  --home-kbd-text: rgba(255, 255, 255, 0.8);
}

.cc-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
}

.cc-h2 {
  margin: 0;
  font-family: var(--cc-font-display);
  font-weight: 300;
  font-size: clamp(36px, 4.8vw, 64px);
  line-height: 1.02;
  letter-spacing: -0.025em;
}

.cc-h2--scheme {
  color: var(--home-text);
}

.cc-h2--dark {
  color: #000000;
}

.cc-head {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 56px;
}

.cc-hero__eyebrow {
  color: var(--home-eyebrow);
}

.cc-sections__eyebrow {
  color: var(--home-eyebrow-accent);
}

.cc-steps .cc-eyebrow {
  color: rgba(26, 23, 28, 0.6);
}

/* Buttons follow website/components/Button.vue */
.cc-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 6px 24px;
  border-radius: 6.5px;
  border: 1px solid transparent;
  font-family: var(--cc-font-display);
  font-size: 18px;
  line-height: 1.2;
  font-weight: 400;
  text-decoration: none;
  cursor: pointer;
  transition:
    background-color 0.18s ease,
    color 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.cc-btn:focus-visible {
  outline: 2px solid var(--cc-yellow);
  outline-offset: 3px;
}

.cc-btn--yellow {
  background: var(--cc-yellow);
  color: #000000;
}

.cc-btn--yellow:hover {
  box-shadow: 0 8px 28px rgba(238, 255, 1, 0.28);
}

.cc-btn--outline {
  border-color: var(--home-text);
  color: var(--home-text);
}

.cc-btn--outline:hover {
  background: var(--home-outline-hover-bg);
  color: var(--home-outline-hover-text);
}

.cc-btn--black {
  background: #000000;
  color: #ffffff;
}

.cc-btn--black:hover {
  background: var(--cc-slate);
}

.cc-btn--outline-dark {
  border-color: #000000;
  color: #000000;
}

.cc-btn--outline-dark:hover {
  background: #000000;
  color: var(--cc-yellow);
}

/* Blueprint dot grid from the website's .bg-grid utility */
.cc-grid-bg {
  position: relative;
  isolation: isolate;
}

.cc-grid-bg::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-image: radial-gradient(var(--home-dots) 1px, transparent 1px);
  background-size: 28px 28px;
  background-position: center top;
  -webkit-mask-image: radial-gradient(
    ellipse 60% 70% at 72% 50%,
    #000 20%,
    transparent 100%
  );
  mask-image: radial-gradient(
    ellipse 60% 70% at 72% 50%,
    #000 20%,
    transparent 100%
  );
}

/* Scroll reveal */
.reveal {
  opacity: 0;
  transform: translateY(18px);
  transition:
    opacity 0.7s var(--home-ease),
    transform 0.7s var(--home-ease);
  transition-delay: var(--reveal-delay, 0ms);
  will-change: opacity, transform;
}

.reveal.is-visible {
  opacity: 1;
  transform: none;
}

@keyframes hero-rise {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* ------------------------------------------------------------------
   Hero
   ------------------------------------------------------------------ */
.cc-hero {
  background: var(--home-hero-bg);
  padding: 112px 0 104px;
  overflow: hidden;
}

.cc-hero__inner {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: 72px;
  align-items: center;
}

.cc-hero__copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
}

.cc-hero__eyebrow {
  margin-bottom: 28px;
  animation: hero-rise 0.8s var(--home-ease) both;
}

.cc-hero__title {
  margin: 0 0 28px;
  font-family: var(--cc-font-display);
  font-weight: 300;
  font-size: clamp(42px, 4.9vw, 72px);
  line-height: 0.98;
  letter-spacing: -0.028em;
  color: var(--home-text);
  animation: hero-rise 0.9s var(--home-ease) 0.08s both;
}

/* Yellow type on the dark hero; a yellow rule under black type on the
   light one, where yellow text would not be readable. */
.cc-hero__accent {
  color: var(--home-text);
  text-decoration: underline;
  text-decoration-color: var(--cc-yellow);
  text-decoration-thickness: 0.07em;
  text-underline-offset: 0.08em;
  text-decoration-skip-ink: none;
}

.dark .cc-hero__accent {
  color: var(--cc-yellow);
  text-decoration: none;
}

.cc-hero__sub {
  max-width: 520px;
  margin: 0;
  font-size: 19px;
  line-height: 1.55;
  color: var(--home-muted);
  animation: hero-rise 0.9s var(--home-ease) 0.18s both;
}

.cc-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 36px;
  animation: hero-rise 0.9s var(--home-ease) 0.28s both;
}

.cc-hero__note {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 20px 0 0;
  font-size: 14px;
  color: var(--home-faint);
  animation: hero-rise 0.9s var(--home-ease) 0.38s both;
}

.cc-hero__note kbd {
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  line-height: 1;
  padding: 5px 7px;
  border-radius: 4px;
  border: 1px solid var(--home-kbd-border);
  border-bottom-width: 2px;
  color: var(--home-kbd-text);
}

.cc-hero__note kbd + kbd {
  margin-left: -4px;
}

.cc-hero__visual {
  min-width: 0;
  animation: hero-rise 1s var(--home-ease) 0.3s both;
}

/* The generated-files map: styled like the website's generation log */
.cc-map {
  border-radius: 16px;
  background: var(--cc-darkest);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow:
    0 40px 80px -40px rgba(0, 0, 0, 0.9),
    0 0 0 1px rgba(238, 255, 1, 0.04);
  overflow: hidden;
}

.cc-map__bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.cc-map__marker {
  width: 6px;
  height: 6px;
  background: var(--cc-red);
  flex: 0 0 auto;
}

.cc-map__title {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
}

.cc-map__status {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--vp-font-family-mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
}

.cc-map__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--cc-yellow);
  box-shadow: 0 0 10px rgba(238, 255, 1, 0.8);
}

.cc-map__body {
  padding: 14px 12px 18px;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.5;
}

.cc-map__line {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 10px;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  animation: hero-rise 0.5s var(--home-ease) both;
  animation-delay: calc(0.55s + var(--i) * 60ms);
  transition:
    background-color 0.18s ease,
    color 0.18s ease;
}

.cc-map__line:hover {
  background: rgba(255, 255, 255, 0.05);
}

.cc-map__line--dir {
  margin-top: 12px;
  font-weight: 700;
  color: #ffffff;
}

.cc-map__line--dir:first-child {
  margin-top: 0;
}

.cc-map__line--file {
  padding-left: 26px;
}

.cc-map__square {
  width: 6px;
  height: 6px;
  background: var(--cc-yellow);
  flex: 0 0 auto;
}

.cc-map__check {
  color: var(--cc-yellow);
  font-weight: 700;
}

.cc-map__text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cc-map__line--file:hover .cc-map__text {
  color: var(--cc-yellow);
}

.cc-map__meta,
.cc-map__note {
  margin-left: auto;
  flex: 0 0 auto;
  font-family: var(--vp-font-family-base);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
  transition: color 0.18s ease;
}

.cc-map__note {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.cc-map__note svg {
  opacity: 0;
  transition: opacity 0.18s ease;
}

.cc-map__line:hover .cc-map__meta,
.cc-map__line:hover .cc-map__note {
  color: #ffffff;
}

.cc-map__line:hover .cc-map__note svg {
  opacity: 1;
}

/* ------------------------------------------------------------------
   Sections
   ------------------------------------------------------------------ */
.cc-sections {
  background: var(--home-sections-bg);
  padding: 112px 0 128px;
  border-top: 1px solid var(--home-divider);
}

.cc-sections__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: 40px;
  row-gap: 48px;
}

.cc-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 22px 0 4px;
  border-top: 1px solid var(--home-hairline);
  color: var(--home-text);
  text-decoration: none;
  transition: border-color 0.25s ease;
}

.cc-section:hover {
  border-top-color: var(--cc-yellow);
}

.cc-section__index {
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  color: var(--home-faint);
}

.cc-section__title {
  font-family: var(--cc-font-display);
  font-weight: 300;
  font-size: 34px;
  line-height: 1.05;
  letter-spacing: -0.02em;
  transition: color 0.18s ease;
}

.cc-section:hover .cc-section__title {
  color: var(--home-hover-title);
}

.cc-section__desc {
  font-size: 15px;
  line-height: 1.55;
  color: var(--home-muted);
}

.cc-section__meta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--home-text);
}

/* ------------------------------------------------------------------
   Steps
   ------------------------------------------------------------------ */
.cc-steps {
  background: var(--cc-cream);
  padding: 112px 0 120px;
}

.cc-steps__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 40px;
}

.cc-step {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-top: 22px;
  border-top: 1px solid rgba(26, 23, 28, 0.22);
  color: #1a171c;
  text-decoration: none;
  transition: border-color 0.25s ease;
}

.cc-step:hover {
  border-top-color: #1a171c;
}

.cc-step__index {
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  color: rgba(26, 23, 28, 0.5);
}

.cc-step__title {
  font-family: var(--cc-font-display);
  font-weight: 300;
  font-size: 40px;
  line-height: 1;
  letter-spacing: -0.02em;
}

.cc-step__desc {
  font-size: 15.5px;
  line-height: 1.55;
  color: rgba(26, 23, 28, 0.7);
}

.cc-step__code {
  align-self: flex-start;
  margin-top: 4px;
  padding: 9px 14px;
  border-radius: 8px;
  background: var(--cc-darkest);
  color: #ffffff;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
}

.cc-step__prompt {
  color: var(--cc-yellow);
  margin-right: 8px;
}

.cc-step__link {
  display: inline-flex;
  align-items: center;
  gap: 0;
  margin-top: auto;
  padding-top: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #1a171c;
  text-decoration: underline;
  text-decoration-color: transparent;
  text-underline-offset: 4px;
  transition: text-decoration-color 0.18s ease;
}

.cc-step__link::before {
  content: "";
  width: 6px;
  height: 6px;
  margin-right: 10px;
  background: var(--cc-red);
}

.cc-step:hover .cc-step__link {
  text-decoration-color: #1a171c;
}

/* ------------------------------------------------------------------
   Close
   ------------------------------------------------------------------ */
.cc-close {
  position: relative;
  background: var(--cc-yellow);
  padding: 150px 0;
  overflow: hidden;
}

.cc-close__mark {
  position: absolute;
  right: -6%;
  bottom: -18%;
  width: 46%;
  min-width: 420px;
  height: auto;
  fill: rgba(0, 0, 0, 0.07);
  pointer-events: none;
}

.cc-close__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  text-align: center;
}

.cc-close__sub {
  margin: -12px 0 0;
  font-family: var(--cc-font-display);
  font-weight: 300;
  font-size: 28px;
  line-height: 1.2;
  color: rgba(0, 0, 0, 0.6);
}

.cc-close__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
}

/* ------------------------------------------------------------------
   Footer
   ------------------------------------------------------------------ */
.cc-footer {
  background: #000000;
  padding: 56px 0 40px;
}

.cc-footer__inner {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-areas:
    "brand links"
    "legal legal";
  row-gap: 40px;
  column-gap: 48px;
  align-items: center;
}

.cc-footer__brand {
  grid-area: brand;
  display: inline-flex;
}

.cc-footer__brand img {
  height: 28px;
  filter: invert(1);
  opacity: 0.9;
  transition: opacity 0.18s ease;
}

.cc-footer__brand:hover img {
  opacity: 1;
}

.cc-footer__links {
  grid-area: links;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px 32px;
}

.cc-footer__links a {
  position: relative;
  font-family: var(--cc-font-display);
  font-weight: 300;
  font-size: 20px;
  color: #ffffff;
  text-decoration: none;
  transition: color 0.18s ease;
}

.cc-footer__links a::before {
  content: "";
  position: absolute;
  left: -16px;
  top: 50%;
  margin-top: -3px;
  width: 6px;
  height: 6px;
  background: var(--cc-red);
  opacity: 0;
  transition: opacity 0.18s ease;
}

.cc-footer__links a:hover {
  color: var(--cc-yellow);
}

.cc-footer__links a:hover::before {
  opacity: 1;
}

.cc-footer__legal {
  grid-area: legal;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 28px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 13px;
  color: #6a6a6a;
}

.cc-footer__legal a {
  color: #6a6a6a;
  text-decoration: none;
  transition: color 0.18s ease;
}

.cc-footer__legal a:hover {
  color: #ffffff;
}

/* ------------------------------------------------------------------
   Responsive
   ------------------------------------------------------------------ */
@media (max-width: 1000px) {
  .cc-hero {
    padding: 80px 0 72px;
  }

  .cc-hero__inner {
    grid-template-columns: minmax(0, 1fr);
    gap: 48px;
  }

  .cc-grid-bg::before {
    -webkit-mask-image: radial-gradient(
      ellipse 90% 50% at 50% 70%,
      #000 20%,
      transparent 100%
    );
    mask-image: radial-gradient(
      ellipse 90% 50% at 50% 70%,
      #000 20%,
      transparent 100%
    );
  }

  .cc-sections,
  .cc-steps {
    padding: 80px 0 88px;
  }

  .cc-sections__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .cc-steps__grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
  }

  .cc-close {
    padding: 96px 0;
  }
}

@media (max-width: 640px) {
  .cc-container {
    padding: 0 20px;
  }

  .cc-hero {
    padding: 56px 0 56px;
  }

  .cc-hero__eyebrow {
    margin-bottom: 22px;
    font-size: 11px;
    letter-spacing: 0.14em;
  }

  .cc-hero__sub {
    font-size: 17px;
  }

  .cc-hero__actions {
    width: 100%;
    flex-direction: column;
  }

  .cc-hero__actions .cc-btn {
    width: 100%;
  }

  .cc-map__body {
    font-size: 12px;
  }

  .cc-map__note {
    display: none;
  }

  .cc-head {
    margin-bottom: 36px;
    gap: 14px;
  }

  .cc-sections,
  .cc-steps {
    padding: 56px 0 64px;
  }

  .cc-sections__grid {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 28px;
  }

  .cc-section__title {
    font-size: 28px;
  }

  .cc-step__title {
    font-size: 32px;
  }

  .cc-close {
    padding: 64px 0;
  }

  .cc-close__mark {
    width: 70%;
    min-width: 320px;
    right: -20%;
    bottom: -12%;
  }

  .cc-close__content {
    align-items: flex-start;
    text-align: left;
  }

  .cc-close__sub {
    font-size: 20px;
    margin-top: -8px;
  }

  .cc-close__actions {
    width: 100%;
    flex-direction: column;
    justify-content: flex-start;
  }

  .cc-close__actions .cc-btn {
    width: 100%;
  }

  .cc-footer__inner {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      "brand"
      "links"
      "legal";
    row-gap: 28px;
  }

  .cc-footer__links {
    justify-content: flex-start;
    flex-direction: column;
    gap: 6px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cc-hero__eyebrow,
  .cc-hero__title,
  .cc-hero__sub,
  .cc-hero__actions,
  .cc-hero__note,
  .cc-hero__visual,
  .cc-map__line {
    animation: none;
  }
}
</style>
