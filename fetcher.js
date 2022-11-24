const request = require('request');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//extract URL and Filepath from command line input
const urlCLI = process.argv[2];
const filepathCLI = process.argv[3];

//fs writefile helper function
const writeFile = (fp, c) => {
  fs.writeFile(fp, c, err => {
    
    if (err) return console.log(`Write File Error: ${err}`);

    //log filesize and file path to console after download
    fs.stat(fp, (err, stats) => {
      if (err) return console.log(`FS stat error: ${err}`);
      
      console.log(`Downloaded and saved ${stats.size} bytes to ${fp}`);
      rl.close();
      return;
    });
  });
};

const fetcher = (url, filepath) => {

  if (filepath === undefined) {
    console.error('Error: Invalid filepath!');
    rl.close();
    return;
  }

  //request to make http calls
  request(url, (error, response, body) => {

    //checks if url is valid
    if (error) {
      console.log('statusCode:', response && response.statusCode);
      console.error('Error: Invalid URL!');
      rl.close();
      return;
    }

    //checks if file already exist
    if (fs.existsSync(filepath)) {
      rl.question('File already exist. Do you want to overwrite? (Y/N) ', (answer) => {

        if (answer.toUpperCase() === 'Y') {
          writeFile(filepath, body);
          return;
        }
        
        console.log('No file downloaded');
        rl.close();
        return;
      });
        
      //execute function if file does not exist yet
    } else return writeFile(filepath, body);
    
  });
};

fetcher(urlCLI, filepathCLI);