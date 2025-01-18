function isBelowMinimumAge(birthDate) {
    const minimumAge = 18

    const birthday = new Date(birthDate)
    birthday.setFullYear(birthDate.getFullYear() + minimumAge)

    const minimumDate = new Date()
    minimumDate.setHours(0, 0, 0, 0)

    return birthday < minimumDate
}

const teste = new Date('2000-12-25T12:00:00Z');

console.log(isBelowMinimumAge(teste));