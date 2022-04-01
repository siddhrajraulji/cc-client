import React, {Component} from 'react';
import store from 'store';

import axios from 'axios';
import Header from '../Header';
import { Redirect, Link, withRouter  } from 'react-router-dom';
//import Pagination from '../component/Pagination';
import Auth from '../modules/Auth';
import Loader from 'react-loader';

import Datamap from '../datamap';
import DatePicker from "react-datepicker";
import moment from 'moment';
import DataTable from 'pure-react-datatable';
import theme from '../theme';

import "react-datepicker/dist/react-datepicker.css";
import './custom.css';

class Reportstate extends Component { 
  


  constructor(props) {
        super(props);
 
        this.state = {
         fields: [],
         errors: {}, 
         campaign:[],
         data:[],
         newdata:[],
         campaign_name:'',
         startDate:new Date(),
         endDate:new Date(),
         message:'Record not found',
         status:0,
         loaded: true ,
         totalCount:0,
         sort:'asc',
         sortr:'asc',
         totalRevenue:0

        };
   
    
    this.fieldchange = this.fieldchange.bind(this);
    this.handleChangestart = this.handleChangestart.bind(this);
    this.handleChangeend = this.handleChangeend.bind(this);
   this.getGeoActivityMap = this.getGeoActivityMap.bind(this);
    this.fielddatechange = this.fielddatechange.bind(this);

     this.sortByPriceAsc = this.sortByPriceAsc.bind(this);
        this.sortByPriceDesc = this.sortByPriceDesc.bind(this);
        

    }

fielddatechange(e){
      
  var timeframe = e.target.value
  
  Auth.fielddatechange(timeframe);
  
  var formdate = store.get('fromdate');
  var todate = store.get('todate');
  formdate = new Date(formdate);
  todate = new Date(todate);

  this.setState({
      startDate:formdate,
      endDate:todate
    });

}


 sortByPriceAsc(type) {

        let sortedProductsAsc;

        if(type == "C"){
          sortedProductsAsc= this.state.newdata.sort((a,b)=>{
             return parseInt(a.count)  - parseInt(b.count);
          });
          this.setState({sort:'asc'}); 
        }else{
          sortedProductsAsc= this.state.newdata.sort((a,b)=>{
            return parseInt(a.Revenue)  - parseInt(b.Revenue);
         });
         this.setState({sortr:'asc'}); 
        }

          this.setState({
              newdata:sortedProductsAsc
          });

           

      }

  sortByPriceDesc(type){

          let sortedProductsDsc;
          if(type=="C"){
          sortedProductsDsc= this.state.newdata.sort((a,b)=>{
             return parseInt(b.count)  - parseInt(a.count);
          });
          this.setState({sort:'desc'});
        }else{
          sortedProductsDsc= this.state.newdata.sort((a,b)=>{
            return parseInt(b.Revenue)  - parseInt(a.Revenue);
         });
         this.setState({sortr:'desc'});
        }

          this.setState({
              newdata:sortedProductsDsc
          });

         
      }    


componentDidMount(){
 
  this.getCampaign();
}

getCampaign()
  {

const headers = {
  'Content-Type': 'application/json',
  'Authkey': Auth.Authkey(),
  'session': Auth.getToken()
}


  axios.post(`${Auth.getapiurl()}/getCampaign`,
  {
    type:"Active"
  },
  {
    headers: headers
  }).then(res => {

        if(res.data.status == 1){
        const campaign = res.data.responsedata.results;
                this.setState({ campaign });
                   } 
                
        })
    
  }

  handleChangestart = date => {

    this.setState({
      startDate: date
    });

     

  };
  handleChangeend = date => {
    this.setState({
      endDate: date
    });

   
  };



getGeoActivityMap()
  {

       this.setState({ data:[] });

    if (this.validateForm()) {
this.setState({ loaded: false }); 
const headers = {
  'Content-Type': 'application/json',
  'Authkey': Auth.Authkey(),
  'session': Auth.getToken()
}


  axios.post(`${Auth.getapiurl()}/getGeoActivityMap`,
  {
    campaign_id:this.state.campaign_name,
    from_date:moment(new Date(this.state.startDate)).format("YYYY-MM-DD"),
    to_date:moment(new Date(this.state.endDate)).format("YYYY-MM-DD")

  },
  {
    headers: headers
  }).then(res => {
this.setState({ loaded: true }); 
    const status=res.data.status;
    this.setState({ status });
        if(res.data.status == 1){
        const data = res.data.responsedata;

        const newdata = res.data.newresponsedata;
          this.setState({ newdata });
          
          this.sortByPriceAsc('C');

        const totalCount = res.data.totalCount;
        const totalRevenue = res.data.totalRevenue;
        
                this.setState({ data });
                this.setState({ totalCount });
                this.setState({ totalRevenue });
                
                   }else{
                    Auth.toastmsg(res.data.message,'E') 
                    const message = res.data.message;
                     this.setState({ message });
                   } 
                
        })
    
  }  
 }


    validateForm() {

      let fields = this.state;
      let errors = {};
      let formIsValid = true;
    
   
       
    
      

       if (!fields["startDate"]) {
        formIsValid = false;
        errors["startDate"] = "*Please Select Start Date.";
      }

      if (!fields["endDate"]) {
        formIsValid = false;
        errors["endDate"] = "*Please Select End Date.";
      }

      this.setState({
        errors: errors
      });
      return formIsValid;


    }
fieldchange(e){
      this.setState({
        campaign_name:e.target.value
      });

      
      
     }


  render() {
    


    
    
    
    
   if (!Auth.getToken()) {
     
     return <Redirect to="/login" />;
     }   

    let data=this.state.data;
   



let select_campaign;

        select_campaign = <select className="form-control"  onChange={this.fieldchange} name="campaign_name">
                    <option value="">-All Campaigns-</option>
                 { this.state.campaign.length > 0 ?  
                 this.state.campaign.map(item => 
                  <option key={item.campaign_name} value={item.buyer_lead_type_id} >{item.display_name}</option>
                  )
                  : '' }

            </select>;


    return (
      <div>
      <Loader loaded={this.state.loaded}>
    </Loader>
     <div>
    <Header />
    </div>
        <div className="content-wrapper">
                <section className="content-header">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="box box-info">
                                <div className="box-header with-border">
                                   
                                    <h3 className="box-title">Geo Activity Map</h3>
                                       
                                    </div>
                  
               
                                
                                <div className="box-body">

                                <div className="row">
                                    <div className="col-md-4">    
                                        <div className="form-group">
                 
                            <label>Campaign: </label>
                      { select_campaign }

                      <div className="errorMsg">{this.state.errors.campaign_name}</div>
                      </div>
                      </div>
                     

                     <div className="col-md-2">
          <div className="form-group">
                 
 <label>Time Frame: </label>
                 
    <select name="timeframe" className="form-control" onChange={this.fielddatechange}>
      <option value="today">Select</option>
         <option value="today">Today</option>
        <option value="yesterday">Yesterday</option>
        <option value="day_bef_yest">Day Before Yesterday</option>
        <option value="last_week">Last Week</option>
        <option value="this_week">This Week</option>
        <option value="this_month">This Month</option>
        <option value="last_month">Last month</option>
        <option value="this_year">YTD</option>
    </select>
                     
                    
          
                          
                
                </div>
            </div> 
         


        <div className="col-md-3">
          <div className="form-group">
                 
 <label>From Date: <span className="red">*</span></label>
                 
                      
                      <DatePicker
        selected={this.state.startDate}
        onChange={this.handleChangestart}
        startDate={this.state.startDate}
        endDate={this.state.endDate}
        
        showMonthDropdown
      useShortMonthInDropdown
      className="form-control"
      placeholderText="Click to select a From date"
      
        dateFormat="MM-dd-yyyy"
        showYearDropdown
      />
                     
                    
           <div className="errorMsg">{this.state.errors.startDate}</div>
                          
                
                </div>
            </div>
        
         <div className="col-md-3">
        <div className="form-group">
                 
 <label>To Date: <span className="red">*</span></label>
                 

                      <DatePicker
        selected={this.state.endDate}
        onChange={this.handleChangeend}
        startDate={this.state.startDate}
        endDate={this.state.endDate}
        minDate={this.state.startDate}
        
        showMonthDropdown
      useShortMonthInDropdown
      className="form-control"
       placeholderText="Click to select a To date"
       
        dateFormat="MM-dd-yyyy"
        showYearDropdown
      />


                    
           <div className="errorMsg">{this.state.errors.endDate}</div>
                          
                  </div>
                </div>  
          
                
          </div>

           <div className="box-footer col-md-12 text-center">
                    <button type="submit" className="btn btn-info"  onClick={this.getGeoActivityMap}><i className="fa fa-send"></i> Generate</button>
                    </div>  
                                    
                                    { this.state.status == 1 ?
                                    <div className="row ">
                                    <div className="col-md-9 fullsize">
                                        
                                        <Datamap
          scope="usa"
          geographyConfig={{
            highlightBorderColor: '#bada55',
            popupTemplate: (geography, data) =>
              `<div class='hoverinfo'>${geography.properties.name}\ : ${data.count}`,
            highlightBorderWidth: 3
          }}
          fills={{
            'Republican': '#CC4731',
             
          'defaultFill': '#EDDC4E'
          }}
          data={data}
          labels

        /></div>

                                     <div className="col-md-3">
                                     <table className="table table-striped table-responsive">
                                      <thead>
                                      <tr>
                                      <th>State</th>
                                      <th>Count 
                                      { this.state.sort == 'asc' ?
                                      ''
                                      : <i className="btn fa fa-sort-asc" onClick={() => this.sortByPriceAsc('C')} ></i> }

                                      { this.state.sort == 'desc' ?
                                      ''
                                      : <i className="btn fa fa-sort-desc" onClick={() => this.sortByPriceDesc('C')} ></i> }
                                      </th>
                                      <th>Avg Price 
                                      { this.state.sortr == 'asc' ?
                                      ''
                                      : <i className="btn fa fa-sort-asc" onClick={() => this.sortByPriceAsc('A')} ></i> }

                                      { this.state.sortr == 'desc' ?
                                      ''
                                      : <i className="btn fa fa-sort-desc" onClick={() => this.sortByPriceDesc('A')} ></i> }


                                      </th>

                                      </tr>
                                      </thead>
                                      
                                      <tbody>
                                          {this.state.newdata.map(item => 
      <tr><td>{item.state}</td><td>{item.count}</td><td>${item.Revenue}</td></tr>
    )}
                                      </tbody>
                                      <tfoot>
                                      <tr>
                                        <td><b>Total :</b></td>
                                        <td><b>{this.state.totalCount}</b></td>
                                        <td><b>{this.state.totalRevenue}</b></td>
                                      </tr>
                                      </tfoot>
                                      

                                     </table>
                                     </div>

                                   
                                     </div> 
                                     :
                                      <div className="row ">
                                     <div className="col-md-12">{this.state.message}
                                     
                                     </div>


                                     </div>
                                   }
                                     
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </section>
            </div>

           

      </div>
    );
  }


}

export default withRouter(Reportstate);