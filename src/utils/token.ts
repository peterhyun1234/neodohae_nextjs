const isDev = process.env.REACT_APP_DEPLOY_MODE === 'development'
export const NHT = isDev ? 'NHT_Beta' : 'NHT'

/**
 * getToken()
 * : 토큰 저장한것 가져오는 
 * @returns 토큰값 
 */
 export const getToken = () => {
    let tokenFromLS = localStorage.getItem(NHT)
    let tokenFromSS = sessionStorage.getItem(NHT)
    let returnToken = ""

    if (tokenFromLS !== null) {
        returnToken = tokenFromLS
    } else {
        if (tokenFromSS !== null) {
            returnToken = tokenFromSS
        } else {
            returnToken = ""
        }
    }

    return returnToken;
}

/**
 * setToken()
 * : 토큰 저장하는 함수
 * @param {string} tokenFromSS 토큰값
 * @returns X
 */
export const setToken = (tokenFromSS: any, isSignMaintain?: boolean) => {
    removeToken()
    if (isSignMaintain !== undefined && isSignMaintain === true) {
        localStorage.setItem(NHT, tokenFromSS);
    } else {
        sessionStorage.setItem(NHT, tokenFromSS);
    }
}

/**
 * removeToken()
 * : 토큰을 삭제하는 함수
 * @returns X
 */
export const removeToken = () => {
    localStorage.removeItem(NHT);
    sessionStorage.removeItem(NHT);
}
