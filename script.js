window.addEventListener('load', () => {
    const encryptButton = document.getElementById("encryptButton")
    const encryptInput = document.getElementById("encryptInput")
    const decryptButton = document.getElementById("decryptButton")
    const decryptInput = document.getElementById("decryptInput")
    const nInput = document.getElementById("n")
    const eInput = document.getElementById("e")
    const encryptAnswer = document.getElementById("encryptAnswer")
    const decryptAnswer = document.getElementById("decryptAnswer")

    const getModularReverse = (x, mod) => {
        let oldR = x
        let r = mod
        let oldS = 1
        let s = 0
        let oldT = 0
        let t = 1
        let q
        let temp

        while (r !== 0) {
            q = Math.floor(oldR/r)

            temp = r
            r = oldR - q*r
            oldR = temp

            temp = s
            s = oldS - q*s
            oldS = temp

            temp = t
            t = oldT - q*t
            oldT = temp
        }
        return oldS > 0 ? oldS : oldS + mod
    }

    const Alphabet = new Map()
    Alphabet.set("А", 0)
    Alphabet.set("Б", 1)
    Alphabet.set("В", 2)
    Alphabet.set("Г", 3)
    Alphabet.set("Д", 4)
    Alphabet.set("Е", 5)
    Alphabet.set("Ё", 6)
    Alphabet.set("Ж", 7)
    Alphabet.set("З", 8)
    Alphabet.set("И", 9)
    Alphabet.set("Й", 10)
    Alphabet.set("К", 11)
    Alphabet.set("Л", 12)
    Alphabet.set("М", 13)
    Alphabet.set("Н", 14)
    Alphabet.set("О", 15)
    Alphabet.set("П", 16)
    Alphabet.set("Р", 17)
    Alphabet.set("С", 18)
    Alphabet.set("Т", 19)
    Alphabet.set("У", 20)
    Alphabet.set("Ф", 21)
    Alphabet.set("Х", 22)
    Alphabet.set("Ц", 23)
    Alphabet.set("Ч", 24)
    Alphabet.set("Ш", 25)
    Alphabet.set("Щ", 26)
    Alphabet.set("Ъ", 27)
    Alphabet.set("Ы", 28)
    Alphabet.set("Ь", 29)
    Alphabet.set("Э", 30)
    Alphabet.set("Ю", 31)
    Alphabet.set("Я", 32)
    Alphabet.set(" ", 33)
    Alphabet.set(".", 34)
    Alphabet.set(",", 35)
    Alphabet.set("!", 36)

    const mod = Alphabet.size

    const getNumber = (letter) => {
        return Alphabet.get(letter)
    }

    const getLetter = (number) => {
        for (let [key, value] of Alphabet.entries()) {{
            if (value === number) {
                return key
            }
        }}
        return null
    }

    const getModularPow = (base, pow, mod) => {
        let result = 1
        for (let i = 0; i < pow; i++) {
            result = (result * base) % mod
        }
        return result
    }

    const getBlockFromNumber = (number) => {
        let result = ''
        let dividend = number
        let q = 1
        while (1) {
            q = Math.floor(dividend / mod)
            if (q !== 0) {
                result = getLetter(dividend % mod) + result
                dividend = q
            } else {
                result = getLetter(dividend) + result
                return result
            }
        }
    }

    const p = 31
    const q = 61
    const n = p * q
    const eulerFun = n - p - q + 1
    const e = 11
    const d = getModularReverse(e, eulerFun)
    console.log("eulerFun = " + eulerFun)
    console.log("d = " + d)

    console.log((getModularPow(63, e, n)))

    const onEncryptAction = (E, N) => {
        const text = encryptInput.value
        const blockSize = 2
        const splitText = []

        for (let i = 0; i < text.length; i += blockSize) {
            if (i + blockSize <= text.length) {
                let result = ''
                for (let j = i; j < i + blockSize; j++) {
                    result += text[j]
                }
                splitText.push(result)
            } else {
                let result = ''
                for (i; i < text.length; i++) {
                    result += text[i]
                }
                splitText.push(result)
            }
        }

        const splitNumbers = splitText.map((block) => {
            let sum = 0
            for (let i = 0; i < block.length; i++) {
                sum += getNumber(block[i]) * Math.pow(mod, blockSize - i - 1)
            }
            return sum
        })

        const splitEncryptNumbers = splitNumbers.map((number) => getModularPow(number, E, N))
        console.log(splitText)
        console.log(splitNumbers)
        console.log(splitEncryptNumbers)

        let encryptedText = ''
        splitEncryptNumbers.map((num) => {
            let block = getBlockFromNumber(num)
            if (block.length === 2) {
                block = 'А' + block
                
            } else if (block.length === 1) {
                block = 'АA' + block
            }
            encryptedText += block
        })
        return encryptedText
    }

    encryptButton.addEventListener("click", () => encryptAnswer.innerHTML = onEncryptAction(parseInt(eInput.value, 10), parseInt(nInput.value, 10)))

    const onDecryptAction = () => {
        const text = decryptInput.value
        const blockSize = 3
        const splitText = []

        for (let i = 0; i < text.length; i += blockSize) {
            if (i + blockSize <= text.length) {
                let result = ''
                for (let j = i; j < i + blockSize; j++) {
                    result += text[j]
                }
                splitText.push(result)
            } else {
                let result = ''
                for (i; i < text.length; i++) {
                    result += text[i]
                }
                splitText.push(result)
            }
        }

        const splitNumbers = splitText.map((block) => {
            let sum = 0
            for (let i = 0; i < block.length; i++) {
                sum += getNumber(block[i]) * Math.pow(mod, block.length - i - 1)
            }
            return sum
        })

        const splitEncryptNumbers = splitNumbers.map((number) => getModularPow(number, d, n))
        console.log(splitText)
        console.log(splitNumbers)
        console.log(splitEncryptNumbers)

        let decryptedText = ''
        splitEncryptNumbers.map((num) => {
            decryptedText += getBlockFromNumber(num)
        })
        return decryptedText
    }

    decryptButton.addEventListener("click",  () => decryptAnswer.innerHTML = onDecryptAction())
}, { once: true })


