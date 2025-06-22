const timestampFormat = (timestamp: number): string => {
    const date = new Date(timestamp * 1000); // 乘1000轉為毫秒
    const pad = (n: number): string => String(n).padStart(2, '0');

    const Y = date.getFullYear();
    const M = pad(date.getMonth() + 1);
    const D = pad(date.getDate());
    const h = pad(date.getHours());
    const m = pad(date.getMinutes());
    const s = pad(date.getSeconds());

    return `${Y}-${M}-${D} ${h}:${m}:${s}`;
}

export default timestampFormat;