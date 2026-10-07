<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import DocEyebrow from "./components/DocEyebrow.vue";

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #doc-before>
      <DocEyebrow />
    </template>
  </Layout>
</template>
