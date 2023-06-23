import Axios from "axios";

/**
 * isMobile()
 * : 모바일 환경인지 확인
 * @returns true, false 
 */
export const isMobile = () => {
    if (typeof navigator !== 'undefined') {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    return false;
}

/**
 * isAppleDevice()
 * : 애플 모바일 환경인지 확인
 * @returns true, false 
 */
export const isAppleDevice = () => {
    if (typeof navigator !== 'undefined') {
        return [
            'iPad Simulator',
            'iPhone Simulator',
            'iPod Simulator',
            'iPad',
            'iPhone',
            'iPod'
        ].includes(navigator.platform)
            // iPad on iOS 13 detection
            || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    }
    return false;
}

/**
 * isPWA()
 * : PWA로 설치됐는지 확인
 * @returns true, false 
 */
export const isPWA = () => {
    if (typeof window !== 'undefined') {
        return ["fullscreen", "standalone", "minimal-ui"].some(
            (displayMode) => window.matchMedia('(display-mode: ' + displayMode + ')').matches
        );
    }

    return false;
};

/**
 * getPhaseStatus()
 * : 각 Phase에 대한 정보 겟 
 * @returns PhaseStatus 
 */
export const getPhaseStatus = () => {
    let curPhaseStatus = sessionStorage.getItem('PhaseStatus')
    return curPhaseStatus
}

/**
 * setPhaseStatus()
 * : 각 Phase에 대한 정보저장
 * @param {any} PhaseStatus
 * @returns X
 */
export const setPhaseStatus = (content: any) => {
    sessionStorage.removeItem('PhaseStatus');
    sessionStorage.setItem('PhaseStatus', content);
}

/**
 * removePhaseStatus()
 * : 각 Phase에 대한 정보저장 삭제
 * @returns X
 */
export const removePhaseStatus = () => {
    sessionStorage.removeItem('PhaseStatus');
}
