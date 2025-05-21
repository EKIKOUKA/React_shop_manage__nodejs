export default function request(url, data = {}) {
    return fetch(`/table_sample/api/${url}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(response => {
        console.log("response: ", response);
        if (response.status === 200) return response.json()
    }).catch(error => {
        console.log("Request error: ", error);
        throw error;
    });
}
