import { modal } from '../modal'

// ==================== AUTH ===============================
import Logout from '@/components/modals/auth/logout.vue'

// ==================== CORE ===============================
import Confirmation from '@/components/modals/core/Confirmation.vue'
import LoadingVerification from '@/components/modals/core/loading.vue'

// ==================== DASHBOARD ===============================
import StartGoal from '@/components/modals/dashboard/StartGoal.vue'
import EditTodo from '@/components/modals/dashboard/EditTodo.vue'

// ==================== BOTTOMBAR ===============================
import BottomMenu from '@/components/layouts/bottomBar/modal/Main.vue'

// ==================== ASSISTANT ===============================
import CreateAgent from '@/components/modals/assistant/CreateAgent.vue'

// ==================== INTEGRATIONS ===============================
import ConnectWhatsapp from '@/components/modals/integrations/ConnectWhatsapp.vue'
import EditConfig from '@/components/modals/integrations/EditConfig.vue'




type AuthTypes = 'Logout'
type DashboardTypes = 'StartGoal' | 'EditTodo'
type CoreTypes = 'Confirmation' | 'LoadingVerification'
type BottombarTypes = 'BottomMenu'
type AssistantTypes = 'CreateAgent'
type IntegrationsTypes = 'ConnectWhatsapp' | 'EditConfig'

const AuthModals = { Logout } as Record<AuthTypes, any>
const DashboardModals = { StartGoal, EditTodo } as Record<DashboardTypes, any>
const CoreModals = { Confirmation, LoadingVerification } as Record<CoreTypes, any>
const BottombarModals = { BottomMenu } as Record<BottombarTypes, any>
const AssistantModals = { CreateAgent } as Record<AssistantTypes, any>
const IntegrationsModals = { ConnectWhatsapp, EditConfig } as Record<IntegrationsTypes, any>


const authModal = modal.register('Auth', AuthModals)
const dashboardModal = modal.register('Dashboard', DashboardModals)
const coreModal = modal.register('Core', CoreModals)
const bottombarModal = modal.register('Bottombar', BottombarModals)
const assistantModal = modal.register('Assistant', AssistantModals)
const integrationsModal = modal.register('Integrations', IntegrationsModals)



export const useAuthModal = () => authModal
export const useDashboardModal = () => dashboardModal
export const useCoreModal = () => coreModal
export const useBottombarModal = () => bottombarModal
export const useAssistantModal = () => assistantModal
export const useIntegrationsModal = () => integrationsModal


