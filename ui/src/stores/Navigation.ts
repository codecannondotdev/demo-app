import { defineStore } from 'pinia'

export const useNavigationStore = defineStore('navigation', {
	state: () => ({
		overlayOpen: false as boolean,
	}),
	actions: {
		open() {
			this.overlayOpen = true
		},
		close() {
			this.overlayOpen = false
		},
		toggle() {
			this.overlayOpen = !this.overlayOpen
		},
	},
})
