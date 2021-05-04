const http = require ('http');
const fs =require('fs');
var requests= require('requests');
const port = process.env.PORT || 8000;
const homeFile=fs.readFileSync('main.html',"utf-8");

const replaceVal=(tempVal,orgVal)=>{
let temprature=tempVal.replace("{%tempVal%}",orgVal.main.temp);
 temprature=temprature.replace("{%tempMin%}",orgVal.main.temp_min);
 temprature=temprature.replace("{%tempMax%}",orgVal.main.temp_max);
 temprature=temprature.replace("{%location%}",orgVal.name);
 temprature=temprature.replace("{%country%}",orgVal.sys.country);
 return temprature;
};
const server=http.createServer((req,res)=>{
    if(req.url=="/"){
        requests(
            "http://api.openweathermap.org/data/2.5/weather?q=Guwahati&appid=38c5a3d4919fef7814445fc8833c84cc"
            )
        .on("data",function(chunk){
            const objData=JSON.parse(chunk);
            const arrData=[objData];
            //console.log(arrData[0].main.temp);
            const realTimeData =arrData.map((val)=> replaceVal(homeFile,val)).join("");
               

         res.write(realTimeData);
         //console.log(realTimeData);

        })
        .on("end",function(err){
            if(err)return console.log("connection closed due to error",err);
            console.log("EndOne");
            res.end();
        });
    }
});
server.listen(port,()=>{
    console.log('listing to the port no '+port);
});