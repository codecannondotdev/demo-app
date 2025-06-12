import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import '@/assets/fontawesome-pro/css/all.min.css'
import axios from 'axios'
import * as Sentry from '@sentry/vue'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import ToastService from 'primevue/toastservice'
import DialogService from 'primevue/dialogservice'
import ConfirmationService from 'primevue/confirmationservice'
import Tooltip from 'primevue/tooltip'

const app = createApp(App)

axios.defaults.withCredentials = true
axios.defaults.withXSRFToken = true
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

app.use(createPinia())
app.use(router)

app.use(PrimeVue, {
	theme: {
		preset: Aura,
	},
})
app.directive('tooltip', Tooltip)
app.use(ToastService)
app.use(DialogService)
app.use(ConfirmationService)

// @ts-ignore-next-line
if (import.meta.env.MODE === 'production') {
	Sentry.init({
		app,
		dsn: 'https://de0f4335e11e40868178fde563081fc8@o4507205539135488.ingest.de.sentry.io/4507749691424848',
		integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
		// Performance Monitoring
		tracesSampleRate: 1.0, //  Capture 100% of the transactions
		// Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
		tracePropagationTargets: ['localhost'],
		// Session Replay
		replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
		replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
	})
}

app.mount('#app')
