import fs from 'node:fs';
const output={};
for(const area of ['Taramani','Alwarpet','Kizhakottaiyur','Puzhuthivakkam','Mugalivakkam','IIT Madras']){
 const url='https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=in&q='+encodeURIComponent(area+', Chennai, Tamil Nadu');
 try{const response=await fetch(url,{headers:{'User-Agent':'NammaStartupDirectory/1.0 (+https://github.com/Madan94/nammastartup)'},signal:AbortSignal.timeout(12000)});if(!response.ok)throw new Error('HTTP '+response.status);const [place]=await response.json();if(place){const latitude=Number(place.lat),longitude=Number(place.lon);if(latitude>12.5&&latitude<13.6&&longitude>79.8&&longitude<80.5)output[area]={latitude,longitude,label:place.display_name,sourceUrl:'https://www.openstreetmap.org/'+place.osm_type+'/'+place.osm_id,checkedAt:new Date().toISOString()};}console.log(area,output[area]??'No verified result');}catch(error){console.log(area,error.message)}await new Promise(resolve=>setTimeout(resolve,1200));
}
fs.writeFileSync('src/data/area-locations.json',JSON.stringify(output,null,2)+'\n');
