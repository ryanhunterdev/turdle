const keyboard = [
    "q w e r t y u i o p".split(" "), 
    "a s d f g h j k l".split(" "),
    "enter z x c v b n m <".split(" ")
]

const guessgrid = []

  for (let index = 0; index < 6; index++) {
    const row = []

    for (let index = 0; index < 4; index++) {
      row.push({char: null, color: null},)
    }
    guessgrid.push(row)
}

export {
    keyboard,
    guessgrid
}