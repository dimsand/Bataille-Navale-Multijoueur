function logAction(message) {
    var d = new Date(),
    minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
    hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
    seconds = d.getSeconds();
    return hours+':'+minutes+':'+seconds+' - '+message+'\n';
}