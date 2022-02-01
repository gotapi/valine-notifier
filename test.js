const axios = require( 'axios' )
let comment = {
	nick:"黄滚",
	comment:"这是一条评论",
	url:"/gws"
}
let server = "http://localhost:6000"
//https://404.ms
try{
                   axios.post(server + "/api/newComment" ,comment).then((data)=>{
					   console.log("response")
                       console.log(data);
                   });
               }catch (e){
                   console.log("unknown error while spread comment to gotapi")
                   console.log(e);
               }