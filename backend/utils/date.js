function getCurrentDateTime() {
    const now = new Date();

    const padZero = (num) => num.toString().padStart(2, '0');

    const year = now.getFullYear();
    const month = padZero(now.getMonth() + 1);
    const day = padZero(now.getDate());
    const hours = padZero(now.getHours());
    const minutes = padZero(now.getMinutes());
    const seconds = padZero(now.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

module.exports = { getCurrentDateTime };