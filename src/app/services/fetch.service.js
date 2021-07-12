const axios = require('axios');

// 
exports.GetAllNotes = () => {
    return new Promise((resolve, reject) => {
        let headers = {
            'Content-Type': 'application/json'
        };

        axios.get('http://localhost:3000/notes', { headers: headers })
            .then((response) => {
                resolve({
                    status: 1,
                    data: response.data.data
                })
            })
            .catch((error) => {
                reject({
                    status: 0
                })
            }
        );
    })
}

// 
exports.PostNote = (data) => {
    return new Promise((resolve, reject) => {
        let headers = {
            'Content-Type': 'application/json'
        };

        axios.post('http://localhost:3000/note', data, { headers: headers })
            .then((response) => {
                resolve({
                    status: 1
                })
            })
            .catch((error) => {
                reject({
                    status: 0
                })
            }
        );
    })
}

// 
exports.SyncNotes = (data) => {
    return new Promise((resolve, reject) => {
        let headers = {
            'Content-Type': 'application/json'
        };

        axios.post('http://localhost:3000/sync/notes', data, { headers: headers })
            .then((response) => {
                resolve({
                    status: 1
                })
            })
            .catch((error) => {
                reject({
                    status: 0
                })
            }
        );
    })
}