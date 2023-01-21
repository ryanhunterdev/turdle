// export const createDate = () => {
//     const date = new Date()
//     const day = date.getDate()
//     const month = date.getMonth()
//     const year = date.getFullYear()

//     return `${day}/${month + 1}/${year}`
// }

export const createResultString = (guessState, secretWord, row) => {

    let resultString = `🐢TURDLE💩 ${row + 1}/6\nWord: ${secretWord.toUpperCase()}\n`
    guessState.forEach(row => {
      let rowString = ''
      for (let index = 0; index < row.length; index++) {
        const {char} =  row[index]
        if (char === null) return
        if (char === '🐢' || char === '💩') {
          rowString += char
        } else {
          rowString += "🟡"        
        }
      }
      rowString += '\n'
      resultString += rowString 
    })
    return resultString
}