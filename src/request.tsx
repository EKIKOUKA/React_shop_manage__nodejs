export default function request(url: string, data: object = {}): Promise<any> {
    return fetch(`/shop_sample/api/${url}`, {　// http://133.242.132.37/
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "token "
        },
        body: JSON.stringify(data)
    }).then((response: Response) => {
        console.log("response: ", response);
        if (response.status === 200) return response.json()
    }).catch((error: unknown) => {
        console.log("Request error: ", error);
        throw error;
    });
}
