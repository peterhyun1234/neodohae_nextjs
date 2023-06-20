/**
 * isNumber()
 * : 숫자인지 확인
 * @returns true, false 
 */
export const isNumber = (number: string|number) => {
    return !isNaN(Number(number))
}

/**
 * isPositiveInteger()
 * : 정수인지 확인
 * @returns true, false 
 */
 export const isPositiveInteger = (number: string|number) => {
     const curNum = Number(number)
    return (!isNaN(curNum) && Number.isInteger(curNum) && curNum >= 0)
}