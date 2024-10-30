export function getDate(dateString : string) {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth()는 0부터 시작하므로 1을 더해줌
    const day = date.getDate().toString().padStart(2, '0'); // 일자를 추출

    return `${month}-${day}`;
}