<script setup lang="ts">
/**
 * Section breadcrumb rendered above every page title, in the website's
 * eyebrow style (small caps with the red square). The trail is derived
 * from the sidebar config, so it stays correct as pages move.
 */
import { computed } from "vue";
import { useData } from "vitepress";

interface SidebarItem {
  text?: string;
  link?: string;
  items?: SidebarItem[];
}

const { theme, page, frontmatter } = useData();

function normalize(link: string): string {
  return link.replace(/\.(md|html)$/, "").replace(/\/index$/, "/");
}

function findTrail(
  items: SidebarItem[],
  path: string,
  trail: string[],
): string[] | null {
  for (const item of items) {
    if (item.link && normalize(item.link) === path) return trail;
    if (item.items?.length) {
      const found = findTrail(
        item.items,
        path,
        item.text ? [...trail, item.text] : trail,
      );
      if (found) return found;
    }
  }
  return null;
}

const trail = computed<string[]>(() => {
  const layout = frontmatter.value.layout;
  if (layout === "page" || layout === "home") return [];

  const sidebar = theme.value.sidebar;
  const groups: SidebarItem[] = Array.isArray(sidebar)
    ? sidebar
    : (Object.values(sidebar ?? {}).flat() as SidebarItem[]);

  const path =
    "/" +
    page.value.relativePath.replace(/\.md$/, "").replace(/(^|\/)index$/, "$1");

  return findTrail(groups, path, []) ?? [];
});
</script>

<template>
  <p v-if="trail.length" class="cc-eyebrow cc-doc-eyebrow">
    <template v-for="(crumb, i) in trail" :key="crumb + i">
      <span v-if="i > 0" class="cc-doc-eyebrow__sep" aria-hidden="true">/</span>
      <span>{{ crumb }}</span>
    </template>
  </p>
</template>

<style scoped>
.cc-doc-eyebrow {
  margin-bottom: 20px;
  gap: 10px;
}

.cc-doc-eyebrow__sep {
  opacity: 0.4;
}
</style>
