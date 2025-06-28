export default function request(url: string, data: object = {}): Promise<any> {
    const token = localStorage.getItem("token") || '';

    return fetch(`/shop_sample/api/${url}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }).then((response: Response) => {
        console.log("response: ", response);
        if (response.status === 200 || response.status === 400) {
            return response.json();
        } else if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("userInfo");
            localStorage.removeItem("token");
            window.location.href = '#/login';
        } else if (response.status === 500) {
            alert("サーバーエラー");
        }
    }).catch((error: unknown) => {
        console.log("Request error: ", error);
        throw error;
    });
}
