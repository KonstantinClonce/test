let express = require('express');
let mongoose = require('mongoose');
let {spawn} = require("child_process");
let pic = require("./picture");

let url = "mongodb+srv://hackathonTake1:ErHGLz7lEifUguIL@cluster0.bpf6r7j.mongodb.net/Photos?retryWrites=true&w=majority"

try{
    mongoose.connect(url);
    
    let server = express();

    server.use(express.json());

    server.listen(80);

    server.post("/addImage", function(request, response){
        let res = {status: false}
        let firstname = request.body.firstname;
        let lastname = request.body.lastname;
        let picture = request.body.picture;

        pic.findOne({firstname: firstname, lastname: lastname}, function(error, data){
            if(error){
                throw error;
            }
            else{
                if(data == null){
                    let data2 = new pic({
                        firstname: firstname,
                        lastname: lastname,
                        picture: picture
                    });

                    res.status = true;

                    data2.save();
                }

                response.send(res);
            }
        });
    });

    server.post("/updateImage", function(request, response){
        let firstname = request.body.firstname;
        let lastname = request.body.lastname;
        let picture = request.body.picture;
        let res = {status: false};

        pic.findOneAndUpdate({firstname: firstname, lastname: lastname}, {picture: picture}, function(error, data){ //vs find.
            if(error){
                throw error;
            }
            else{
                if(data != null){//worst case, delete from the database, and re insert it.
                    res.status = true;
                }

                response.send(res);
            }
        });
    });

    server.delete("/deleteImage", function(request, response){
        let res = {status: false};
        let firstname = request.body.firstname;
        let lastname = request.body.lastname;

        pic.findOneAndDelete({firstname: firstname, lastname: lastname}, function(error, data){
            if(error){
                throw error;
            }
            else{
                if(data != null){
                    res.status = true;
                }

                response.send(res);
            }
        });
    });

    server.get("/verifyImage", function(request, response){
        let res = {status: ""};
        let picture = request.body.picture;

        let childProcess = spawn("python3", ["ai.py", picture]);

        childProcess.stdout.on("data", function(data){
            res.status = data.toString();
        });

        response.send(res);
    });
}
catch(error){
    console.log(error);
}