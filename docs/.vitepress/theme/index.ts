import DefaultTheme from "vitepress/theme";
import posthog from "posthog-js";
import type { Theme } from "vitepress";
import Layout from "./Layout.vue";
import CustomHome from "./components/CustomHome.vue";
import "./custom.css";

export default <Theme>{
  ...DefaultTheme,
  Layout,

  enhanceApp({ app, router }) {
    app.component("CustomHome", CustomHome);
    // @ts-ignore
    if (import.meta.env.SSR) return;

    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const distinct_id = hashParams.get("distinct_id");
    const session_id = hashParams.get("session_id");

    posthog.init("phc_jK2vCDMVsX8YZaBH69w1ZbBaPhH2ED2LqyTbXsGSAPc", {
      api_host: "https://eu.i.posthog.com",
      capture_pageview: false,
      bootstrap: {
        sessionID: session_id ?? undefined,
        distinctID: distinct_id ?? undefined,
      },
      persistence: "localStorage",
    });

    posthog.capture("$pageview");

    router.onAfterRouteChange = () => {
      posthog.capture("$pageview", { $current_url: location.href });
    };
  },
};
