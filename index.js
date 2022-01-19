import { data } from './constructorData';
let newData;

export async function config(nameConfig, fn, nameEnv) {
    if (!nameConfig && !newData.baseUrl && !newData.nameProject && !newData.secretKey) return null;
    return await getConfig(nameConfig, nameEnv).then((data) => fn(data));
}

export function initConfig(baseUrl, nameProject, secretKey) {
    newData = new data(baseUrl, nameProject, secretKey);
}

async function getConfig(nameConfig, nameEnv) {
    const response = await fetch(newData.baseUrl + nameConfig, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ project_name: newData.nameProject, secret_key: newData.secretKey })
    })
        .then(response => response)
    if (response.ok) {
        return response.json();
    } else if (!response.ok && process.env[nameEnv]) {
        return process.env[nameEnv]
    } else {
        return 'no such configuration exists'
    }
}