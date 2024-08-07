function path(link, sublink) {
    return `${link}${sublink}`
}

// const ROOT_AUTH = '/root'
const ROOT_MAIN = '/mainpage'

export const PATH_MAIN = {
    welcome: '/welcome',
    mainpage: ROOT_MAIN,
    datalist: path(ROOT_MAIN, '/datalist'),
    notification: path(ROOT_MAIN, '/notification'),
}