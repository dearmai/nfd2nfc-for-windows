const chokidar = require('chokidar');
const path = require("path");
const fs = require("fs");
const { Stats } = fs;

let pathes = [process.env.USERPROFILE + "\\iCloudDrive", process.env.USERPROFILE + "\\Downloads", process.env.USERPROFILE + "\\Documents"];

pathes.forEach( (item) => {
    console.log(path.normalize(item));
});


var watcher = chokidar.watch(pathes, {ignored: /^\./, persistent: true, awaitWriteFinish: true, ignorePermissionErrors: true});

watcher
  .on('add', function(path) {
      nameProcess(path);
    })
  .on('change', function(path) {
      nameProcess(path);
    })
  .on('unlink', function(path) {
    })
  .on('error', function(error) {
    })

function nameProcess(item) {
    let nfd_name = item;
    let nfc_name = item.normalize('NFC');

    if(nfd_name != nfc_name) {
        try {
            fs.renameSync(nfd_name, nfc_name);
            console.log("\x1b[32m[Renamed] " + nfd_name + " -> " + nfc_name + "'\x1b[1m");
        } catch (e) {
            let stat = new Stats(item);

            if(stat.isFile) {
                let dir = path.dirname(item);
                let dirNfd = dir.normalize('NFC');
                fs.renameSync(dir, dirNfd);
                console.log("\x1b[32m[Renamed] " + dir + " -> " + dirNfd + "'\x1b[1m");

                nameProcess(item);
            } else {
                console.log("\x1b[33m[Ignore] " + nfd_name + "'\x1b[1m");
            }
        }        
    }
}