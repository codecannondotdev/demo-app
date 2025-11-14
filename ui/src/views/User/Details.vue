<template>
	<Header title="Account Details" />
	<ProgressBar
		v-if="loaders.size > 0"
		mode="indeterminate"
		style="height: 6px" />
	<Container class="details">
		<FormDetails
			:id="authStore.user!.id"
			@start-loading="loaders.add('form')"
			@stop-loading="loaders.delete('form')" />
	</Container>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import Header from './components/Header.vue'
import ProgressBar from 'primevue/progressbar'
import Container from '@/components/Container.vue'
import { useAuthStore } from '@/stores/Auth'
import FormDetails from '@/views/User/components/FormDetails.vue'

const authStore = useAuthStore()
const loaders = reactive(new Set<string>())
</script>

<style lang="scss" scoped>
.details {
	display: grid;
	grid-template-columns: 1fr;
	gap: 11px;
	justify-items: center;
	align-items: start;
}
</style>
