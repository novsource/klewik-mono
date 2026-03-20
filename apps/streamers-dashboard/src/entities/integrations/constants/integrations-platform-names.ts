import type { IntegrationsPlatforms } from '../model'

export const INTEGRATIONS_PLATFORM_NAMES: Record<IntegrationsPlatforms, string> = {
  donatePay: 'Donate Pay',
  donationAlerts: 'Donation Alerts',
  twitch: 'Twitch',
  userInput: 'Custom',
}
