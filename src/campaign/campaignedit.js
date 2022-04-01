import React, {Component} from 'react';
import store from 'store';
import axios from 'axios';
import Header from '../Header';
import { Redirect, Link } from 'react-router-dom';
import Auth from '../modules/Auth';


class Campaignedit extends Component { 


   constructor(props) {
      super(props);
      this.state = {
        fields: {
          cpassword :''
        },
        errors: {},
        errorMessage : '',
        status : '',
		userbyid : '',

      }
	  
	  //console.log(this.props.match.params.id);
	  
	  
      this.getuserbyid();
      this.handleChange = this.handleChange.bind(this);
      this.submituserRegistrationForm = this.submituserRegistrationForm.bind(this);

    };




	
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
	
	handleChange(e) {
      let fields = this.state.fields;
      fields[e.target.name] = e.target.value;
      this.setState({
        fields
      });

    }
	
	
	
	getuserbyid()
	{

const headers = {
  'Content-Type': 'application/json',
  'Authkey': Auth.Authkey(),
  'session': Auth.getToken()
}


  axios.post(`${Auth.getapiurl()}/getUsersbyid`,
  {
    userID: this.props.match.params.id
  },
  {
    headers: headers
  }).then(res => {

				
				const fields = res.data.responsedata.userdata;
                this.setState({ fields });
			  })
		
	}
	
	
  
	

    submituserRegistrationForm(e) {
      e.preventDefault();
      if (this.validateForm()) {


const headers = {
  'Content-Type': 'application/json',
  'Authkey': Auth.Authkey(),
  'session': Auth.getToken()
}
         
		 axios.post(`${Auth.getapiurl()}/UpdateUser`, {
    userID: this.props.match.params.id,
     opassword: this.state.fields.opassword,
     password: this.state.fields.password
  },
  {
    headers: headers
  })
		 
		 .then(res => {
        console.log(res);
        this.setState({ errorMessage: res.data.message,status:res.data.status});

          setTimeout(() => {
  this.setState({
    errorMessage:'',
    status:''
  });


 // this.props.history.push("/user"); 


}, 5000)


       



			 
		  })
		  
      }

    }

    validateForm() {

      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;
	  
		 
	 
	  
	 

       if (!fields["username"]) {
        formIsValid = false;
        errors["username"] = "*Please enter User Name.";
      }

      if (typeof fields["username"] !== "undefined") {
        if (!fields["username"].match(/^[a-zA-Z ]*$/)) {
          formIsValid = false;
          errors["username"] = "*Please enter alphabet characters only.";
        }
      }

       if (!fields["opassword"]) {
        formIsValid = false;
        errors["opassword"] = "*Please enter Old Password.";
      }else{

        if (!fields["password"]) {
          formIsValid = false;
          errors["password"] = "*Please enter Password.";
        }else{

          if (fields["password"]) {
            if (!fields["password"].match(/^.*(?=.{6,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/)) {
              formIsValid = false;
              errors["password"] = "*Please enter secure and strong password. Use Capital and small letter,special character and number";
            }else{
              if (fields["password"] !== fields["cpassword"]) {
            formIsValid = false;
            errors["password"] = "*Passwords don't match.";
            errors["cpassword"] = "*Please Enter Confirm Password Properly";
          }
            }



          }

    }

    }


      

	  
	  
	  
	  
	  /*if (!fields["password"]) {
        formIsValid = false;
        errors["password"] = "*Please enter password.";
      }

      if (typeof fields["password"] !== "undefined") {
        if (!fields["password"].match(/^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/)) {
          formIsValid = false;
          errors["password"] = "*Please enter secure and strong password. Use Capital and small letter,special character and number";
        }
      }
	  */
	  
    
	  

      
    

      this.setState({
        errors: errors
      });
      return formIsValid;


    }

	

  
  render() {
	  
	
	  
	  const fields = this.state.fields;
	



	 if (!Auth.getToken()) {
		 return <Redirect to="/login" />;
	 }   
	  
	  
    return (
      <div>
	   <div>
		<Header />
	  </div>
        <div className="content-wrapper">
           <section className="content">
           {this.renderAlert()}
			  <div className="row">
				<div className="col-md-12 text-center"> 
				</div>

      <div className="col-md-12">
          <div className="box box-info">
            <div className="box-header with-border">
              <h3 className="box-title">Campaign Edit</h3>
            </div>
           
           <form className="form-horizontal has-validation-callback" onSubmit= {this.submituserRegistrationForm}>
           
              <div className="box-body">

				
				
				
				
				
				<div className="form-group">
                  <label className="col-sm-2 control-label">User Name:</label>

                  <div className="col-sm-6">
                    <h4>{this.state.fields.username}</h4>
                          
                  </div>
                </div>
				
				
				  <div className="form-group">
                  <label className="col-sm-2 control-label">Old Password: <span className="red">*</span></label>

                  <div className={this.state.errors.password ?"col-sm-6 has-error":"col-sm-6" }>
                    <input type="password" className="form-control"  placeholder="Old Password" name="opassword" value={this.state.fields.opassword} onChange={this.handleChange} />
           <div className="errorMsg">{this.state.errors.opassword}</div>
                          
                  </div>
                </div>
				
				
				<div className="form-group">
                  <label className="col-sm-2 control-label">Password: <span className="red">*</span></label>

                  <div className={this.state.errors.password ?"col-sm-6 has-error":"col-sm-6" }>
                    <input type="password" className="form-control"  placeholder="Password" name="password" value={this.state.fields.password} onChange={this.handleChange} />
					 <div className="errorMsg">{this.state.errors.password}</div>
                          
                  </div>
                </div>


                <div className="form-group">
                  <label className="col-sm-2 control-label">Confirm Password: <span className="red">*</span></label>

                  <div className={this.state.errors.cpassword ?"col-sm-6 has-error":"col-sm-6" }>
                    <input type="password" className="form-control"  placeholder="Confirm Password" name="cpassword" value={this.state.fields.cpassword} onChange={this.handleChange} />
           <div className="errorMsg">{this.state.errors.cpassword}</div>
                          
                  </div>
                </div>
				
				
				
				
                <div className="box-footer text-center col-sm-8">
                <Link className="btn btn-primary" to="/campaign">Back</Link>
                <button type="submit" className="btn btn-info leftside">Save</button>
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

export default Campaignedit;