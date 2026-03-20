export const integrationsPlatforms = ['donationAlerts', 'donatePay', 'twitch', 'userInput'] as const

export enum FORMATTED_INTEGRATIONS_PLATFORMS_NAMES {
  donationAlerts = 'DonationAlerts',
  donatePay = 'Donate Pay',
  twitch = 'Twitch',
  userInput = 'Custom',
}
