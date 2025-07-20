export default function request(url: string, data: object = {}): Promise<any> {
    const token = localStorage.getItem("token") || '';

    return fetch(`/shop_sample/java_api/${url}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }).then((response: Response) => {
        console.log("response: ", response);
        if (response.status === 200 || response.status === 400 || response.status === 401) {
            return response.json();
        } else if (response.status === 403) {
            localStorage.removeItem("userInfo");
            localStorage.removeItem("token");
            window.location.href = '#/login';
        } else if (response.status === 500 || response.status === 502) {
            // alert("サーバーエラー");
        }
    }).catch((error: unknown) => {
        console.log("Request error: ", error);
        throw error;
    });
}
