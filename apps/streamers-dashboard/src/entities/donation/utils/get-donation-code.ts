export const getDonationCodeFromMessage = (message: string) => {
  if (message.length < 8)
    return null

  const donationCodeRegex = /\[#([a-z0-9]{8})\]/gi
  const donationCodeFromMessageMatchArr = message.match(donationCodeRegex)

  if (
    !donationCodeFromMessageMatchArr
    || donationCodeFromMessageMatchArr.length === 0
  ) {
    return null
  }

  const donationCodeSignature = donationCodeFromMessageMatchArr[0].slice(
    2,
    donationCodeFromMessageMatchArr[0].length - 1,
  )
  return donationCodeSignature
}
