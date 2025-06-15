export default function request(url: string, data: object = {}): Promise<any> {
    const token = localStorage.getItem("token") || '';

    return fetch(`/shop_sample/api/${url}`, {　// http://133.242.132.37/
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }).then((response: Response) => {
        console.log("response: ", response);
        if (response.status === 200) {
            return response.json();
        } else if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("userInfo");
            localStorage.removeItem("token");
            window.location.href = '#/login';
        }
    }).catch((error: unknown) => {
        console.log("Request error: ", error);
        throw error;
    });
}
