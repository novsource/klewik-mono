export type LoginAdminStylesSlots = 'base' | 'inputsWrapper' | 'openEyeIcon' | 'closedEyeIcon' | 'keyIcon' | 'idIcon'

export type LoginAdminStyles = SlotsStyles<LoginAdminStylesSlots>

const loginAdminStyles: LoginAdminStyles = {
  base: /* tw */ 'flex flex-col w-full gap-y-6',
  inputsWrapper: /* tw */ 'gap-y-4',
  openEyeIcon: /* tw */ 'cursor-pointer text-gray transition-colors select-none hover:text-gray-light',
  closedEyeIcon: /* tw */ 'cursor-pointer text-gray transition-colors select-none hover:text-gray-light',
  keyIcon: /* tw */ 'text-gray-accent',
  idIcon: /* tw */ 'text-gray-accent',
}

export { loginAdminStyles }
