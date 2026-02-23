import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/Auth'
import NotFound from '../views/NotFound.vue'
import authGuard from './guards/authGuard'

import Login from '../views/Auth/Login.vue'
import Register from '../views/Auth/Register.vue'
import VerifyEmail from '../views/Auth/VerifyEmail.vue'
import ForgotPassword from '../views/Auth/ForgotPassword.vue'
import ResetPassword from '../views/Auth/ResetPassword.vue'
import AdminApi from '@/helpers/api/AdminApi'
import AuthApi from '@/helpers/api/AuthApi'
import UserList from '../views/User/List.vue'
import UserEdit from '../views/User/Edit.vue'
import UserDetails from '../views/User/Details.vue'
import PatientList from '../views/Patient/List.vue'
import PatientEdit from '../views/Patient/Edit.vue'
import DoctorList from '../views/Doctor/List.vue'
import DoctorEdit from '../views/Doctor/Edit.vue'
import NurseList from '../views/Nurse/List.vue'
import NurseEdit from '../views/Nurse/Edit.vue'
import DepartmentList from '../views/Department/List.vue'
import DepartmentEdit from '../views/Department/Edit.vue'
import AppointmentList from '../views/Appointment/List.vue'
import AppointmentEdit from '../views/Appointment/Edit.vue'
import TreatmentList from '../views/Treatment/List.vue'
import TreatmentEdit from '../views/Treatment/Edit.vue'
import MedicationList from '../views/Medication/List.vue'
import MedicationEdit from '../views/Medication/Edit.vue'
import BillingList from '../views/Billing/List.vue'
import BillingEdit from '../views/Billing/Edit.vue'
import TagList from '../views/Tag/List.vue'
import TagEdit from '../views/Tag/Edit.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/verify-email',
			name: 'verify-email-notice',
			component: VerifyEmail,
			meta: {
				noNavigation: true,
			},
		},
		{
			path: '/email/verify/:id/:hash',
			name: 'email-verification',
			component: () => {},
			beforeEnter: async (to) => {
				const auth = useAuthStore()
				await auth.getUser()

				if (!auth.user) {
					return { name: 'login' }
				}

				await new AuthApi().verifyEmail({
					id: to.params.id as string,
					hash: to.params.hash as string,
					expires: to.query.expires as string,
					signature: to.query.signature as string,
				})

				await auth.getUser()

				return { name: 'root' }
			},
			meta: {
				unprotected: true,
				noNavigation: true,
			},
		},
		{
			path: '/forgot-password',
			name: 'forgot-password',
			component: ForgotPassword,
			meta: {
				unprotected: true,
				noNavigation: true,
			},
		},
		{
			path: '/reset-password',
			name: 'reset-password',
			component: ResetPassword,
			meta: {
				unprotected: true,
				noNavigation: true,
			},
		},
		{
			path: '/login',
			name: 'login',
			component: Login,
			meta: {
				avoidUser: true,
				noNavigation: true,
			},
		},
		{
			path: '/register',
			name: 'register',
			component: Register,
			meta: {
				avoidUser: true,
				noNavigation: true,
			},
		},
		{
			path: '/logout',
			name: 'logout',
			component: () => {},
			beforeEnter: async () => {
				const auth = useAuthStore()
				await auth.logout()
				return { name: 'login' }
			},
			meta: {
				unprotected: true,
				noNavigation: true,
			},
		},
		{
			path: '/clear-data',
			name: 'clear-data',
			component: () => {},
			beforeEnter: async () => {
				await AdminApi.clearData()
				window.location.reload()
				throw new Error('Clear data')
			},
		},
		{
			path: '/users',
			children: [
				{
					path: '',
					name: 'users-list',
					component: UserList,
					meta: {
						roles: ['admin'],
					},
				},
				{
					path: '/users/create',
					name: 'users-create',
					component: UserEdit,
					meta: {
						roles: ['admin'],
					},
				},
				{
					path: '/users/:id',
					name: 'users-edit',
					component: UserEdit,
					meta: {
						roles: ['admin'],
					},
				},
			],
		},
		{
			path: '/patients',
			children: [
				{
					path: '',
					name: 'patients-list',
					component: PatientList,
				},
				{
					path: '/patients/create',
					name: 'patients-create',
					component: PatientEdit,
				},
				{
					path: '/patients/:id',
					name: 'patients-edit',
					component: PatientEdit,
				},
			],
		},
		{
			path: '/doctors',
			children: [
				{
					path: '',
					name: 'doctors-list',
					component: DoctorList,
				},
				{
					path: '/doctors/create',
					name: 'doctors-create',
					component: DoctorEdit,
				},
				{
					path: '/doctors/:id',
					name: 'doctors-edit',
					component: DoctorEdit,
				},
			],
		},
		{
			path: '/nurses',
			children: [
				{
					path: '',
					name: 'nurses-list',
					component: NurseList,
				},
				{
					path: '/nurses/create',
					name: 'nurses-create',
					component: NurseEdit,
				},
				{
					path: '/nurses/:id',
					name: 'nurses-edit',
					component: NurseEdit,
				},
			],
		},
		{
			path: '/departments',
			children: [
				{
					path: '',
					name: 'departments-list',
					component: DepartmentList,
				},
				{
					path: '/departments/create',
					name: 'departments-create',
					component: DepartmentEdit,
				},
				{
					path: '/departments/:id',
					name: 'departments-edit',
					component: DepartmentEdit,
				},
			],
		},
		{
			path: '/appointments',
			children: [
				{
					path: '',
					name: 'appointments-list',
					component: AppointmentList,
				},
				{
					path: '/appointments/create',
					name: 'appointments-create',
					component: AppointmentEdit,
				},
				{
					path: '/appointments/:id',
					name: 'appointments-edit',
					component: AppointmentEdit,
				},
			],
		},
		{
			path: '/treatments',
			children: [
				{
					path: '',
					name: 'treatments-list',
					component: TreatmentList,
				},
				{
					path: '/treatments/create',
					name: 'treatments-create',
					component: TreatmentEdit,
				},
				{
					path: '/treatments/:id',
					name: 'treatments-edit',
					component: TreatmentEdit,
				},
			],
		},
		{
			path: '/medications',
			children: [
				{
					path: '',
					name: 'medications-list',
					component: MedicationList,
				},
				{
					path: '/medications/create',
					name: 'medications-create',
					component: MedicationEdit,
				},
				{
					path: '/medications/:id',
					name: 'medications-edit',
					component: MedicationEdit,
				},
			],
		},
		{
			path: '/billings',
			children: [
				{
					path: '',
					name: 'billings-list',
					component: BillingList,
				},
				{
					path: '/billings/create',
					name: 'billings-create',
					component: BillingEdit,
				},
				{
					path: '/billings/:id',
					name: 'billings-edit',
					component: BillingEdit,
				},
			],
		},
		{
			path: '/tags',
			children: [
				{
					path: '',
					name: 'tags-list',
					component: TagList,
				},
				{
					path: '/tags/create',
					name: 'tags-create',
					component: TagEdit,
				},
				{
					path: '/tags/:id',
					name: 'tags-edit',
					component: TagEdit,
				},
			],
		},
		{
			path: '/404-not-found',
			name: 'not-found',
			component: NotFound,
			meta: {
				unprotected: true,
			},
		},
		{
			path: '/account',
			children: [
				{
					path: '',
					name: 'account-details',
					component: UserDetails,
				},
			],
		},
		{
			name: 'root',
			path: '/:pathMatch(.*)*',
			redirect: '/patients',
		},
	],
})

router.beforeEach(authGuard)

export default router
