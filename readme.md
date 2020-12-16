# Installation

npm run make

`lib/index.js` is the executable. You can add execution permission `chmod +x lib/index.js` and 
create an alias or a simlink in your $PATH folder to create your own command name.


# Usage

```bash
node lib/index.js --config config.txt

node lib/index.js --files file1 file2 file3

node lib/index.js --config config.txt --file1 file2 file3
```
