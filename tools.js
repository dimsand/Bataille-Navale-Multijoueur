function logAction(message) {
    console.log('test log');
    var d = new Date(),
    var minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
    var hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
    var seconds = d.getSeconds();
    return hours+':'+minutes+':'+seconds+' - '+message+'\n';
}