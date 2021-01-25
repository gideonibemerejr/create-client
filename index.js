require('colors')
const fs = require('fs')
const path = require('path')

const structure = {
    "01_Assets": {
        Photos: {},
        Typography: {},
        Copy: {},
        Misc: {}
    },
    "02_Design": {},
    "03_Code": {},
    "04_Proofs": {},
    "05_Deliverables": {},
};

const create = (dir, structure, cb=null) => {
    cb = (cb => (...a) => setTimeout(() => cb.apply(null, a)))(cb);
    const subdirs = Reflect.ownKeys(structure);
  
    if(subdirs.length){
      const sub = subdirs[0];
      const pth = path.join(dir, sub);
      const subsub = structure[sub];
      const copy = Object.assign({}, structure);
      delete copy[sub];
  
      fs.mkdir(pth, err => {
        if(err) return cb(err);
        create(pth, subsub, err => {
          if(err) return cb(err);
          create(dir, copy, cb);
        });
      });
    }else{
      cb(null);
    }
  };

const clientName = process.argv[3]

if (!clientName) {
    console.error("🚨  Please supply a valid client name  🚨".red )
    process.exit(1)
}

const clientsDirectory = process.argv[2]

console.log(`🕵️‍♂️  Checking for destination folder ${clientsDirectory}  🕵️‍♂️ \n`.cyan)

if(!fs.existsSync(clientsDirectory)) {
    console.error( `\n\n\n🚨  No such path available: ${clientsDirectory}  🚨`.red);
    process.exit(1)
} else {
    console.log(`🛠  ⚙️  Creating a Client folder with the name: ${clientName}  ⚙️  🛠\n`.cyan)
    fs.mkdirSync(`${clientsDirectory}/${clientName}`)
}

const destinationDir = `${clientsDirectory}/${clientName}`
  
  create(destinationDir, structure, err => {
    if(err) console.log(err);
    else console.log(`🎉  Successfully created the ${clientName} client folder and subfolders! 🎉`.green);
  });
  
  process.chdir(destinationDir)

  