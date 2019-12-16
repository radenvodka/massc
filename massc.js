const fetch           = require('node-fetch');
const fs              = require('fs');
const readlineSync    = require('readline-sync');
const colors          = require('colors');
const CreateFiles     = fs.createWriteStream('massc.txt', {
      flags: 'a'
});

async function chechDomain(domain)
{
  let response  = await fetch(domain);
  return response;
} 

if(process.argv[2] == null){
	console.log("[+] Command : node massc domain.com");
	return false;
}
function wait(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}
function lanjutkan(respons)
{
	CreateFiles.write(respons.url+'\r\n');
 	console.log(colors.green(respons.url)  , (respons.status + " - " + respons.statusText)); 
}
function periksa(respons)
{
	console.log(colors.red(respons.message)); 
}
function shiftArray(arr , start_to , end_to) {
  return arr.splice(end_to, end_to); 
}
const fileName = 'database/subdomains.txt';
fs.readFile(fileName, async function(err, data) {
    const list_array    = data.toString().replace(/\r\n|\r|\n/g, " ").split(" ");
    
    var i         	= 0;
    var threads   	= 10;
    var delay 		= 2000;
    var start     	= 0;
    var idata     	= 0;
    var last      	= 0;

    for (; i < data.length; ) {
      
      if(i == threads){
        
        var  subdomain       = shiftArray(list_array , last , idata );
        
        subdomain.forEach(function(itemtext){ 
        	chechDomain("https://"+itemtext+"."+process.argv[2]).then(lanjutkan).catch(periksa);
        });

        await wait(delay);
        last = idata;
        i = 0;
      }
      i++;
      idata++;
    }
});
