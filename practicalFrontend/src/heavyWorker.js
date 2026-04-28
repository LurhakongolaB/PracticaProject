self.onmessage = function() {
    console.log('Worker: starting the heavy counting.. ');
    let i = 0;
    while (i < 999999999) {
        i++
    }
    self.postMessage('end');
};