import React, {Component} from 'react';
import store from 'store';
import axios from 'axios';
import Header from '../Header';
import { Redirect, Link } from 'react-router-dom';
import Auth from '../modules/Auth';


      let weekday = [
               'Monday',
               'Tuesday',
               'Wednesday',
               'Thursday',
               'Friday',
               'Saturday','Sunday'];


class Daywisecap extends Component { 


   constructor(props) {
      super(props);
      this.state = {
        fields: [],
        errors: {},
        errorMessage : '',
        status : '',
    Campaign_code:'',
    selectedOption:'None',
    load_spinner:false 

      }
	  
	  //console.log(this.props.match.params.id);
	  
	  
      this.getDaywisecap();
        this.handleChange = this.handleChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
         this.onValueChange = this.onValueChange.bind(this);
    this.applyValueChange = this.applyValueChange.bind(this);

   
    };

    applyValueChange(){

  let selectedOption = this.state.selectedOption;
  let fields = this.state.fields;
   
   

    if(selectedOption=="AllWeekdays"){

     for (var i = 1; i <= 4; i++) {
       var cap = fields[0].cap; 
     
        fields[i]['cap'] = cap; 
        fields[i]['weekdays'] = i; 
      
     }

      fields[5]['cap'] = ''; 
        fields[5]['weekdays'] = 5; 

        fields[6]['cap'] = ''; 
        fields[6]['weekdays'] = 6; 


  }else if(selectedOption=="AllDays"){
      
       for (var i = 1; i <= 6; i++) {
       var cap = fields[0].cap; 
     
        fields[i]['cap'] = cap; 
        fields[i]['weekdays'] = i; 
      
     }

  }else{

   
     for (var i = 1; i <= 6; i++) {
       var cap = ""; 
     
        fields[i]['cap'] = cap; 
        fields[i]['weekdays'] = i; 
      
     }

 
  }
    this.setState({
        fields
      });
} 

onValueChange(event) {

   this.setState({
      selectedOption: event.target.value
    });

  }

    submitForm(e) {
      e.preventDefault();

     this.setState({load_spinner:true});
      
      const headers = {
  'Content-Type': 'application/json',
  'Authkey': Auth.Authkey(),
  'session': Auth.getToken()
}
         
     axios.post(`${Auth.getapiurl()}/Updatedaywisecap`, {
    leadID: this.props.match.params.id,
     data: this.state.fields,
  
  },
  {
    headers: headers
  })
     
     .then(res => {
        //console.log(res);
        this.setState({ errorMessage: res.data.message,status:res.data.status});
         this.setState({load_spinner:false});
if(res.data.status==1){     
   Auth.toastmsg(res.data.message,'S')  
 }else{
  Auth.toastmsg(res.data.message,'E') 
 }
          setTimeout(() => {
  this.setState({
    errorMessage:'',
    status:''
  });

  this.setState({fields:[]})

   this.getDaywisecap();
 // this.props.history.push("/daywisecap/"+this.props.match.params.id); 


}, 2000)


       



       
      })




    }
	
	renderAlert() {

    if (this.state.errorMessage && this.state.status == '0') {



      return (
        <div className="row">
        <div className="col-md-12">
        <div className="alert alert-danger">
          <strong>!Opps, </strong>{ this.state.errorMessage }
        </div></div></div>

      );
    }else if(this.state.status == '1'){
      return (
        <div className="row">
        <div className="col-md-12">
        <div className="alert alert-success">
          <strong>Success, </strong>{ this.state.errorMessage }
        </div></div></div>
      );
    }





  }
	

	
	
	
	getDaywisecap()
	{

const headers = {
  'Content-Type': 'application/json',
  'Authkey': Auth.Authkey(),
  'session': Auth.getToken()
}


  axios.post(`${Auth.getapiurl()}/getDaywisecap`,
  {
    leadID: this.props.match.params.id
  },
  {
    headers: headers
  }).then(res => {

        const status = res.data.status;
        const Campaign_code = res.data.responsedata.Campaign_code;
        this.setState({Campaign_code})

        if(status == 1){
            const data = res.data.responsedata.results;

            var fields = this.state.fields;

            data.map(function(map){
            fields.push({"id": map.id,
            "cap": map.cap,
            "weekdays":map.weekdays,
            });
            })
            this.setState({fields: fields})

        }else{
          var fields = this.state.fields;
          weekday.map(function(map,i){
            fields.push({"id": '',
            "cap": '',
            "weekdays":i,
            });
            })
          this.setState({fields: fields})
        }

			  })
		
	}
	
	
  
	handleChange(e) {
      let fields = this.state.fields;
      fields[e.target.name] = e.target.value;
      this.setState({
        fields
      });

    }


  
  
	

  
  render() {
	  
	
	  
	  const fields = this.state.fields;
	

    //console.log()

	 if (!Auth.getToken()) {
		 return <Redirect to="/login" />;
	 }   


  
   var questionNodes = this.state.fields.map((question,i) => {

      var updateTextBox = (e) => {
      
      var stateCopy = Object.assign({}, this.state);
      stateCopy.fields[i].cap = e.target.value;
      this.setState(stateCopy);  

      //this.setState({"cap": e.target.value});

      console.log(this.state.fields);
      }

      return (

        <div className="form-group" key={question.id}>
                  <label className="col-sm-2 control-label">{weekday[question.weekdays]} : <span className="red">*</span></label>

                  <div className="col-sm-9">
                    <input type="text" className="form-control"  placeholder="" defaultValue={question.cap} onChange={updateTextBox} onKeyUp={updateTextBox} />
           <div className="errorMsg"></div>
                          
                  </div>



                </div>


        
      );
    }); 
	  
	  
    return (
      <div>
	   <div>
		<Header />
	  </div>
        <div className="content-wrapper">
           <section className="content">
          
			  <div className="row">
				<div className="col-md-12 text-center"> 
				</div>

      <div className="col-md-12">
          <div className="box box-info">
            <div className="box-header with-border">
              <h3 className="box-title">Day of Week Cap Budget</h3>
              <div class="pull-right">
              <h2 className="box-title">[ Campaign : {this.state.Campaign_code} ]</h2>
               
               
              </div>
            </div>
           
           
           <form className="form-horizontal has-validation-callback" onSubmit= {this.submitForm}>
           
              <div className="box-body">

				
				<div className="col-md-9">
				
				
				  {questionNodes}
				
        </div>

        <div className="col-md-3">
<div class="panel panel-default">
    <div class="panel-body">
        <div className="radio">
          <label>
            <input
              type="radio"
              value="AllWeekdays"
              checked={this.state.selectedOption === "AllWeekdays"}
              onChange={this.onValueChange}
            />
            Copy to All Weekdays
          </label>
        </div>
        <div className="radio">
          <label>
            <input
              type="radio"
              value="AllDays"
              checked={this.state.selectedOption === "AllDays"}
              onChange={this.onValueChange}
            />
            Copy to All Days
          </label>
        </div>
        <div className="radio">
          <label>
            <input
              type="radio"
              value="None"
              checked={this.state.selectedOption === "None"}
              onChange={this.onValueChange}
            />
            None
          </label>
        </div>
       
        <div className="btn btn-info" onClick={this.applyValueChange}>Apply</div>
</div>
        </div>
  </div>
        
			
				
				
				
				
                <div className="box-footer text-center col-sm-8">
                <Link className="btn btn-primary" to="/campaign">Back</Link>
                 { this.state.load_spinner ?
                    <button className="btn btn-info leftside">
          <i className="fa fa-spinner fa-spin"></i>
        </button>
                   :
                <button type="submit" className="btn btn-info leftside">Save</button>
              }
              </div>
              </div>
             
           </form>
          </div>
        </div>


       
      </div>


      
    </section>
            </div>
      </div>
    );
  }


}

export default Daywisecap;