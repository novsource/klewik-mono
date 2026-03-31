export const getCardLayoutPositionByIndex = (cardIndex: number, fieldColumnsCount: number) => {
  const positionInColumn = cardIndex - (Math.floor(cardIndex / fieldColumnsCount) * fieldColumnsCount)
  const positionInRow = Math.floor(cardIndex / fieldColumnsCount)

  return { row: positionInRow, column: positionInColumn }
}
