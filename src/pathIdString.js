export function pathIdString(path){
    return path.map(p => p.id).join('>')
}