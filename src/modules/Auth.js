import store from 'store';
import axios from 'axios';
import { toast,Slide, Zoom, Flip, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();


class Auth {

  /**
   * Authenticate a user. Save a token string in Local Storage
   *
   * @param {string} token
   */
  static authenticateUser(token) {
    localStorage.setItem('token', token);
  }

  /**
   * Check if a user is authenticated - check if a token is saved in Local Storage
   *
   * @returns {boolean}
   */
  static isUserAuthenticated() {
    return localStorage.getItem('token') !== null;
  }
  
  
  static isnotUserAuthenticated() {
    return localStorage.getItem('token') == null;
  }
  
  static siteMail() {
    return process.env.REACT_SITE_EMAIL;
  }
  
  static siteName() {
    return process.env.REACT_APP_SITE_NAME;
  }

  static Authkey() {
    return process.env.REACT_APP_Authkey;
  }



  /**
   * Deauthenticate a user. Remove a token from Local Storage.
   *
   */
  static getapiurl() {
    //return 'http://38.110.122.134:5000';
    //console.log(process.env);
	return process.env.REACT_APP_API_URL;
  }
  
  
  static getSiteUrl() {
    //return 'http://localhost:3000';
    return process.env.REACT_APP_SITE_URL;
  }

  static getBasename() {
    return '/';
    //return '/onecart/frontend';
    
  }
static getLastMonday(d) 
{
  var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}
  static fielddatechange(timeframe){

      var fromdate;
     var todate;

   if(timeframe == 'today')
    {
      var d = new Date();
      
      fromdate = d;
      todate = d;
          
    }else if(timeframe == 'yesterday')
    {
      var d = new Date();
      d.setDate(d.getDate() - 1);
      fromdate = d;
      todate = d;
      
      
    }else if(timeframe == 'day_bef_yest')
    {
      var d = new Date();
      d.setDate(d.getDate() - 2);
      fromdate = d;
      todate = d;
      
      
    }
    else if(timeframe == 'last_week')
    {
      var d = new Date();
      d.setDate(d.getDate() - 7);

      var mon = this.getLastMonday(d);

      fromdate = mon;

      var sun = new Date(mon);
      sun.setDate(mon.getDate()+6);

      todate = sun;
    }
    
    else if(timeframe == 'this_week')
    {
      var d = new Date();
      d.setDate(d.getDate());
      var mon = this.getLastMonday(d);
      fromdate = mon;
      
      var sun = new Date();
      sun.setDate(mon.getDate()+6);
      todate = sun;
    }
    else if(timeframe == 'this_month')
    {
      fromdate = new Date();
      fromdate.setDate(1);
      var todate= new Date();
       todate= new Date( (new Date(todate.getFullYear(), todate.getMonth()+1,1))-1 );
      
    }
    else if(timeframe == 'last_month')
    {
      todate= new Date();
      todate= new Date( (new Date(todate.getFullYear(), todate.getMonth(),1))-1 );
      
      fromdate= new Date();
      fromdate = new Date( (new Date(fromdate.getFullYear(), fromdate.getMonth(),1))-1 );
      fromdate.setDate(1);
    }
    else if(timeframe == 'this_year')
    {
      fromdate = new Date();
      fromdate= new Date(new Date(fromdate.getFullYear(), 0,1));
      todate= new Date();
      todate= new Date(new Date(todate.getFullYear(), 11,31));
      
    }



    store.set("fromdate",fromdate);
    store.set("todate",todate);

  }

  
  
  static Itemperpagecount() {
    return 20;
  }
  
  
  
static imageCheck(src)
{
    	
	 if(src == null)
	 {
		 return this.getSiteUrl()+'/noimage.png';
		 
	 }else{		 
    	const http_array = src.split('http');	


    	if(http_array.length > 1){

    		return src;
    	}else{
    		
    		return this.getSiteUrl()+'/'+src;
    	}
		
	 }
}	
  

  /**
   * Get a token value.
   *
   * @returns {string}
   */

  static getToken() {
    return store.get('id_token');
  }
  
  
  static check_auth(){
  
  const headers = {
  'Content-Type': 'application/json',
  'Authkey': Auth.Authkey(),
  'session': Auth.getToken()
}


  axios.post(`${Auth.getapiurl()}/getUsersbyid`,
  {},
  {
    headers: headers
  }).then(res => {

        
        const status = res.data.status;
         
          if(status == 22){
            this.toastmsg(res.data.message,'E');
            localStorage.clear(); 
             window.location.href = this.getSiteUrl()+'/';
          }     


        }).catch(error => {
                localStorage.clear(); 
             window.location.href = this.getSiteUrl()+'/';
  })




  }
  
  
  
  static Mailsend(json_array)
  {
	  
	  const http = require("https");
	  const options = {
			  "method": "POST",
			  "hostname": "api.sendgrid.com",
			  "port": null,
			  "path": "/v3/mail/send",
			  "headers": {
				"authorization": "Bearer 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",
				"content-type": "application/json"
			  }
			};

	  const req = http.request(options, function (res) {
				  
				  const chunks = [];
				  res.on("data", function (chunk) {
					chunks.push(chunk);
				  });

				  res.on("end", function () {
					const body = Buffer.concat(chunks);
					console.log(body.toString());
				  });
			});
			
			req.write(JSON.stringify(json_array));
			req.end();
	 
  }
  
  static toastmsg(message,type) {

    var position;
    if(type=='E'){
     position=toast.POSITION.BOTTOM_RIGHT 
     toast.error(message, {position: position, autoClose: 3000, transition: Flip,hideProgressBar:true });
    }else if(type=='S'){
      position=toast.POSITION.BOTTOM_RIGHT
      toast.success(message, {position: position, autoClose: 3000, transition: Flip,hideProgressBar:true  });
    }else if(type=='I'){
      position=toast.POSITION.BOTTOM_RIGHT
      toast.info(message, {position: position, autoClose: 3000, transition: Flip,hideProgressBar:true  });
    }
  
  }
  
}

export default Auth;
