export function isBelowMinimumAge(birthDate) {
    const minimumAge = 18;

    const birthday = new Date(birthDate);
    birthday.setFullYear(birthDate.getFullYear() + minimumAge);

    const minimumDate = new Date();
    minimumDate.setHours(0, 0, 0, 0);

    return birthday < minimumDate;
}

export function isCpfValid(document){
    const regexCpf = /^[0-9]{11}$/;
    const regexCnpj = /^[0-9]{14}$/;

    if(!regexCpf.test(document) && !regexCnpj.test(document)){
        return false;
    }

    return true;
}