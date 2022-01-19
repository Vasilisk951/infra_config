/* 
    Библиотека для внтренних ресурсов.
    Она позволяет получать настройки конфигураций из сервиса конфигов.

    Для работы библиотеки необходимо скачать в проект npm пакет env-cmd и изменить команду npm run build в package.json
        "build": "react-scripts build"  -->  "build": "env-cmd -f .env.development react-scripts build"
        указывать имя env файла не из примера, а исходя из своих наименований 
    
    
    Для инициализации проекта необходимо вызвать функцию initConfig - она принимает:
     - baseUrl - адрес без query параметра (type = 'string')
     - nameProject - имя проекта (type = 'string') 
     - secretKey - секретный ключ, который был выдан при создании проекта в сервисе конфигов (type = 'string')

     
     initConfig следует вызвать где нибудь на самом верху проета, в компоненте, которая 100% будет отрендерена(ну или в месте получения конфига вызвать эту функцию)


     config - возвращает object с именем и значением конфигурации {name: 'nameConfig', value: 'valueConfig'}
     config принимает:
      - nameConfig - имя конфигурации, query параметр для baseUrl (type = 'string')
      - fn - принмает функцию обновления состояния (hook - React.useState)
      - nameEnv - запасной вариант если конфигурации в сервисе не окажется. с этим параметром функция вернет значение из локального .env файла (type = 'string')
        в React имена переменных окружения должны начинаться с REACT_APP
*/

class data {
    constructor(baseUrl, nameProject, secretKey) {
        this.baseUrl = baseUrl;
        this.nameProject = nameProject;
        this.secretKey = secretKey;
    }
}

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