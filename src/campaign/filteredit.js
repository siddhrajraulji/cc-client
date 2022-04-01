import React, {Component} from 'react';
import store from 'store';
import axios from 'axios';
import Header from '../Header';
import { Redirect, Link } from 'react-router-dom';
import Auth from '../modules/Auth';

import { Multiselect } from 'multiselect-react-dropdown';


class Filteredit extends Component { 


   constructor(props) {
      super(props);
      this.state = {
        fields: [],
        errors: {},
        errorMessage : '',
        status : '',
        match_condition:[],
        body:[],
        load_spinner:false 
		

      }
	  
	  //console.log(this.props.match.params.id);
	  
	  
      this.getFilterbyid();
      this.handleChange = this.handleChange.bind(this);
      
      this.submituserRegistrationForm = this.submituserRegistrationForm.bind(this);
      this.multiselectRef = React.createRef();
       this.change = this.change.bind(this);
        this.resetValues = this.resetValues.bind(this);
        this.onSelect = this.onSelect.bind(this);
        
    };

resetValues() {
  
  // By calling the belowe method will reset the selected values programatically
  this.multiselectRef.current.resetSelectedValues();
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
	
	handleChange(e) {
      let fields = this.state.fields;
      fields[e.target.name] = e.target.value;
      this.setState({
        fields
      });

        console.log(this.state.fields)

    }
	
  change(e){
   
       let fields = this.state.fields;
      fields[e.target.name] = e.target.value;
       if(e.target.value){  
      if(this.state.body && this.state.fields.field_value){
       fields['field_value'] = "";
      this.resetValues();
      }
    }else{
      fields['field_value'] = "";
    }
      this.setState({
        fields
      });
       //  this.multiselectRef.current.resetSelectedValues();
      
        //console.log(this.state.body)

          
     }


onRemove(selectedList, removedItem) {
       // console.log(selectedList)
}
	onSelect(selectedList, selectedItem) {
   // console.log(selectedList)
     let fields = this.state.fields;
    fields['field_value'] = selectedList;  
    this.setState({
        fields
      });   
}
	
	getFilterbyid()
	{

const headers = {
  'Content-Type': 'application/json',
  'Authkey': Auth.Authkey(),
  'session': Auth.getToken()
}


  axios.post(`${Auth.getapiurl()}/getFilterbyid`,
  {
    itemID: this.props.match.params.id,
    campID: this.props.match.params.main
  },
  {
    headers: headers
  }).then(res => {

				
				const fields = res.data.responsedata.results;
                this.setState({ fields });
        const match_condition = res.data.responsedata.match_condition_new;                
                this.setState({ match_condition });
        const body = res.data.responsedata.body;                
                this.setState({ body });      
        const Campaign_code = res.data.responsedata.Campaign_code;
                this.setState({Campaign_code})                    
                
			  })
		
	}
	
	
  
	

    submituserRegistrationForm(e) {
      e.preventDefault();
      if (this.validateForm()) {

this.setState({load_spinner:true});

const headers = {
  'Content-Type': 'application/json',
  'Authkey': Auth.Authkey(),
  'session': Auth.getToken()
}
let selecteditem={};

if(this.state.body){
  selecteditem = this.multiselectRef.current.getSelectedItems();
    let itemarray = [];
  selecteditem.map(item => (
       itemarray.push(item.name)
      ));
selecteditem=itemarray.join();
//console.log(itemarray);

 
}else{
   selecteditem = this.state.fields.field_value;
}
         
		 axios.post(`${Auth.getapiurl()}/UpdateFilter`, {
    itemID: this.props.match.params.id,
     field_condition: this.state.fields.field_condition,
     field_value: selecteditem
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


         


 this.props.history.push("/filter/"+this.props.match.params.main); 




       



			 
		  })
		  
      }

    }

    validateForm() {

      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;
	  
		 
	 
	  
	 

       if (!fields["field_condition"]) {
        formIsValid = false;
        errors["field_condition"] = "*Please Select condition.";
      }

       if (!fields["field_value"]) {
        formIsValid = false;
        errors["field_value"] = "*Please fill Value.";
      }


         
    

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
	     let select;

   
            select = <select className="form-control"  onChange={this.change} name="field_condition">
                    <option value="">-Select Condition-</option>
                {this.state.match_condition.map(item => 
                  <option key={item.key} value={item.key} selected={item.key == this.state.fields.field_condition}>{item.display_name}</option>
                  )}

            </select>;
          
        let body_select;  
          {this.state.body && ( this.state.fields.field_condition === "anyof" || this.state.fields.field_condition === "notanyof") ?

         body_select = <Multiselect
         ref={this.multiselectRef}
options={this.state.body} // Options to display in the dropdown
selectedValues={this.state.fields.field_value} // Preselected value to persist in dropdown
onSelect={this.onSelect} // Function will trigger on select event
onRemove={this.onRemove} // Function will trigger on remove event
displayValue="name" // Property name to display in the dropdown options
/> 
: (this.state.body && ( this.state.fields.field_condition === "=" || this.state.fields.field_condition === "!="))  ?


 body_select = <Multiselect
 ref={this.multiselectRef}
options={this.state.body} // Options to display in the dropdown
selectedValues={this.state.fields.field_value} // Preselected value to persist in dropdown
onSelect={this.onSelect} // Function will trigger on select event
onRemove={this.onRemove} // Function will trigger on remove event
displayValue="name"
singleSelect={true} // Property name to display in the dropdown options

/> 


: (this.state.fields.field_condition && ( this.state.fields.field_condition === "=" || this.state.fields.field_condition === "!="))  ?

body_select=<input type="text" className="form-control"  placeholder="field value"  defaultValue={this.state.fields.field_value} onChange={this.handleChange} onKeyUp={this.handleChange} name="field_value" /> 

: body_select=<textarea className="form-control"  placeholder="field value"  defaultValue={this.state.fields.field_value} onChange={this.handleChange} onKeyUp={this.handleChange} name="field_value"/> 

}

	     
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
              <h3 className="box-title">Update Filter</h3>
              <div className="pull-right">
                    <h2 className="box-title">[ Campaign : {this.state.Campaign_code} ]</h2>
                     
                    </div>
            </div>
           
           <form className="form-horizontal has-validation-callback" onSubmit= {this.submituserRegistrationForm}>
           
              <div className="box-body">

				
				
				
				
				
				<div className="form-group">
                  <label className="col-sm-2 control-label">Filter:</label>

                  <div className="col-sm-6">
                    <h4>{this.state.fields.display_name}</h4>
                          
                  </div>
                </div>
				
				
				  <div className="form-group">
                  <label className="col-sm-2 control-label">Filter Condition: <span className="red">*</span></label>

                  <div className={this.state.errors.field_condition ?"col-sm-6 has-error":"col-sm-6" }>
                      
                      {select}
                     
                    
           <div className="errorMsg">{this.state.errors.field_condition}</div>
                          
                  </div>
                </div>
				
				
				<div className="form-group">
                  <label className="col-sm-2 control-label">Filter Value: <span className="red">*</span></label>

                  <div className={this.state.errors.password ?"col-sm-6 has-error":"col-sm-6" }>

                      {body_select}


                    
					 <div className="errorMsg">{this.state.errors.field_value}</div>
                          
                  </div>
                </div>


              
				
				
				
                <div className="box-footer text-center col-sm-8">
                <Link className="btn btn-primary" to={"/filter/"+this.props.match.params.main}>Back</Link>
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

export default Filteredit;