import axios from "axios";

const DOMAIN = 'http://localhost:8000'; // 도메인이 잘못되어 있을 수 있으니 확인해주세요

export const request = async (method, url, data) => {
    try {
        const response = await axios({
            method,
            url: `${DOMAIN}${url}`,
            data,
        });
        return response; // 전체 응답 반환
    } catch (error) {
        console.error(error);
        return null; // 에러 발생 시 null 반환
    }
};