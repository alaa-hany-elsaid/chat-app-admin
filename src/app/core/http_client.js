function get(url) {
    return fetch(url, {
        headers: {
            // 'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Accept': 'application/json',
        }
    })
        .then(response => response.json())
    // .then(data => console.log(data))
    // .catch(err => console.error(err));
}


function post(url, data, onSuccess = () => {
}, onError = () => {
}) {


    return fetch(url, {
        method: 'POST',
        headers: {
            // 'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(async (response) => {
        if (!response.ok) {
            return onError(await response.json());
        }
        return onSuccess(await response.json())
    });
}


export {post, get}