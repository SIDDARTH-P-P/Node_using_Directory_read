const http = require("http");
const url = require("url")
const fs = require("fs")

const server = http.createServer((req,res)=>{
    const path = url.parse(req.url,true)
    if(path.pathname === "/"){
        fs.readFile("./index.html","utf-8",(error,data)=>{
            if(error){
                console.log(error);
                return;
            }
            res.writeHead(200,{"Content-Type":"text/html"})
            res.write(data)
            res.end()
        })
    }
    if(path.pathname ==="/api-data"){
        let query = path.query
        fs.writeFile("./datas/"+query.username+".json",JSON.stringify(query),(error)=>{
            if(error){
                console.log(error);
                return;
            }
            console.log("data successfully added");
        })
    }
    if(path.pathname ==="/get-data"){
        let {username} = path.query
        fs.readFile("./datas/"+username+".json","utf-8" , (error,data)=>{
            if(error){
                console.log(error);
                return;
            }
            res.write(data)
            res.end()
        })
    }
    if(path.pathname === "/directory-read"){
        fs.readdir("./datas","utf-8", (error,data)=>{
            if(error){
                console.log(error);
                return;
            }
            let filepromise = data.map(item =>readFile("./datas/" + item))
            Promise.all(filepromise)
            .then(result =>{
                res.write(JSON.stringify(result))
                res.end()
            })

        })
        let readFile = (file)=>{
            return new Promise((res,rej)=>{
                fs.readFile(file,"utf-8",(error,data)=>{
                    if(error){
                        rej(error)
                    }
                    res(JSON.parse(data));
                })
            })
        }
    }
})




server.listen(3000,(error)=>{
    if(error){
        console.log(error);
        return;
    }
    console.log("server started");
})