let g = (<any>global);
let mask = g.mask || require('maskjs');
let io = g.io && g.io.File && g.io || require('atma-io');

mask.on('error', function(error) {
    console.error(error);
});
mask.on('warn', function(msg) {
    console.warn(msg);
});


export function setMask ($mask) {
    mask = $mask;
}
export function setIo ($io) {
    io = $io;
}

export { 
    mask,
    io    
}