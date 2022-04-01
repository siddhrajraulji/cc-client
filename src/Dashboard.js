import React, { Component } from "react";
import store from 'store';
import Header from './Header';
import { Redirect, Link } from 'react-router-dom';
import Auth from './modules/Auth';
import axios from 'axios';
import {Bar} from 'react-chartjs-2';
import Loader from 'react-loader';
import DatePicker from "react-datepicker";
import moment from 'moment';
import NumberFormat from 'react-number-format';

class Dashboard extends Component {
  
  constructor(props) {
      super(props);
      this.state = {
        campaign_count:'0',
        totalclicks:'0',
        totalcalls:'0',
        totalleads:'0',
        conversionrate:'0',
        ctr:'0',
        totalcost:'0',
        avg_duration:'0',
        campaign:[],
        campaign_name:'',
        product:'',
        dataset:[],
        label:[],
        loaded: true,
        startDate:new Date(),
        endDate:new Date(),
        timeframe:'today',
        xlabel:'Time of Day – Current Day',
        ylabel:'Volume'
       


      }
    
  
    
    
      
      
        this.fieldchange = this.fieldchange.bind(this);
        this.fielddatechange = this.fielddatechange.bind(this);
        this.getAllCountData = this.getAllCountData.bind(this);
        this.handleChangestart = this.handleChangestart.bind(this);
    this.handleChangeend = this.handleChangeend.bind(this);
        
        
    };

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



getAllCountData(e){
  if(this.state.startDate && this.state.endDate){
    this.getAllCount(this.state.startDate,this.state.endDate,this.state.campaign_name,this.state.product);    
  }
}
fielddatechange(e){
      
  var timeframe = e.target.value

  var index = e.nativeEvent.target.selectedIndex;




  if(timeframe!='custom'){
  Auth.fielddatechange(timeframe);
  
  var formdate = store.get('fromdate');
  var todate = store.get('todate');
  formdate = new Date(formdate);
  todate = new Date(todate);
  var xlabel = e.nativeEvent.target[index].text;

  this.setState({
      startDate:formdate,
      endDate:todate,
      xlabel:xlabel
    });
  this.getAllCount(formdate,todate,this.state.campaign_name,this.state.product);    

}

this.setState({
  timeframe
});

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
                    }else{
                      this.setState({ campaign:[] });
                    }
                
        })
    
  }


componentDidMount(){
  this.getAllCount(this.state.startDate,this.state.endDate,this.state.campaign_name,this.state.product);
  this.getCampaign();
}

fieldchange(e){
   



      
      this.setState({
        campaign_name:e.target.value,
        product:e.target[e.target.selectedIndex].getAttribute("data-name")
      });



      
        this.getAllCount(this.state.startDate,this.state.endDate,e.target.value,e.target[e.target.selectedIndex].getAttribute("data-name"));
      

     }


 

      getAllCount(fromdate,todate,campaign_name,product)
  {
this.setState({ loaded: false }); 
const headers = {
  'Content-Type': 'application/json',
  'Authkey': Auth.Authkey(),
  'session': Auth.getToken()
}


  axios.post(`${Auth.getapiurl()}/getAllCount`,
  {
  fromdate:moment(new Date(fromdate)).format("YYYY-MM-DD"),
  todate:moment(new Date(todate)).format("YYYY-MM-DD"),
  campaign_id:campaign_name,
  product:product

  },
  {
    headers: headers
  }).then(res => {

      this.setState({ loaded: true }); 
        const status = res.data.status;
        if(status==1){
        const campaign_count = res.data.responsedata.campaign_count;
                this.setState({ campaign_count });
        const totalcalls = res.data.responsedata.totalcalls;
                this.setState({ totalcalls });
        const totalclicks = res.data.responsedata.totalclicks;
                this.setState({ totalclicks });                
        const totalleads = res.data.responsedata.totalleads;
                this.setState({ totalleads });
        const conversionrate = res.data.responsedata.conversionrate;
                this.setState({ conversionrate }); 
        const avg_duration = res.data.responsedata.avg_duration;
                this.setState({ avg_duration });                               
        const ctr = res.data.responsedata.ctr;
                this.setState({ ctr });
        const totalcost = res.data.responsedata.totalcost;
                this.setState({ totalcost });
        const label = res.data.responsedata.label;
                this.setState({ label });        

                

          const dataset = [];
  
     const graphleaddata = res.data.responsedata.graphdata[0];
                if(graphleaddata!=0){
                  dataset.push(graphleaddata)
              
                  }


        const graphcalldata = res.data.responsedata.graphdata[1];
        if(graphcalldata!=0){
                 
                 dataset.push(graphcalldata)
              }

        const graphclickdata = res.data.responsedata.graphdata[2];
                  if(graphclickdata!=0){
                
                   dataset.push(graphclickdata)

                }  

                 this.setState({ dataset });    

        }                
                
        })
    
  }

  
  render() {
    
  if (!store.get('id_token')) {
     
     return <Redirect to="/login" />;
  }   



  const data = {
  labels: this.state.label,
  datasets: this.state.dataset,

};


     let select_campaign;

        select_campaign = <select className="form-control"  onChange={this.fieldchange} name="campaign_name">
                    <option value="">-All Campaigns-</option>
                    <option value="" data-name="Calls">All Call Campaigns</option>
                    <option value="" data-name="Clicks">All Clicks Campaigns</option>
                    <option value="" data-name="Leads">All Leads Campaigns</option>
                    
                 { this.state.campaign.length > 0 ?  
                 this.state.campaign.map(item => 
                  <option key={item.campaign_name} value={item.buyer_lead_type_id} data-name={item.product}>{item.display_name}</option>
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
          <section className="content">

            <h1>Dashboard</h1>


          
        <div className="row">
        
       
        
       <div className="col-lg-3 col-xs-12">

       <div className="info-box bg-aqua">
            <span className="info-box-icon"><i className="fa fa-free-code-camp"></i></span>

            <div className="info-box-content">
              
              <span className="info-box-number">{this.state.campaign_count}</span>
              <div className="progress">
                <div className="progress-bar" style={{width:'100%'}}></div>
              </div>
                <Link to={"/campaign"}><span className="progress-description"> Campaigns </span></Link>
              
            </div>
       
          </div>

            </div>


          </div>    


            


          <div className="row">

             <div className="col-md-4 margin15b margin15t">
                { select_campaign }
            </div>
            <div className="col-md-3 margin15b margin15t">
          
          <div className="nav-tabs-custom">

            <select name="timeframe" className="form-control" onChange={this.fielddatechange}>
     
         <option value="today">Today</option>
        <option value="yesterday">Yesterday</option>
        <option value="day_bef_yest">Day Before Yesterday</option>
        <option value="last_week">Last Week</option>
        <option value="this_week">This Week</option>
        <option value="this_month">This Month</option>
        <option value="last_month">Last month</option>
        <option value="this_year">YTD</option>
        <option value="custom">custom</option>
    </select>
  </div>
                 </div>

                
                { this.state.timeframe == 'custom' ?
                  <div>
                <div className="col-md-2 margin15b margin15t">
                <div className="nav-tabs-custom">
                  <DatePicker
                      className="myDatePicker"
        selected={this.state.startDate}
        onChange={this.handleChangestart}
        startDate={this.state.startDate}
        endDate={this.state.endDate}
        
        showMonthDropdown
      useShortMonthInDropdown
      className="form-control"
      placeholderText="From date"
      
        dateFormat="yyyy-MM-dd"
        showYearDropdown
        locale="en-GB"
      />
                </div>
                </div>
                <div className="col-md-2 margin15b margin15t">
                <div className="nav-tabs-custom">
                  <DatePicker
        selected={this.state.endDate}
        onChange={this.handleChangeend}
        startDate={this.state.startDate}
        endDate={this.state.endDate}
        minDate={this.state.startDate}
        
        showMonthDropdown
      useShortMonthInDropdown
      className="form-control"
       placeholderText="To date"
       
        dateFormat="yyyy-MM-dd"
        showYearDropdown
        locale="en-GB"
      />
                </div>
                </div>
                <div className="col-md-1 margin15b margin15t">
                
<button type="submit" className="btn btn-info"  onClick={this.getAllCountData} data-toggle="tooltip" data-placement="bottom" title="Generate"><i className="fa fa-send"></i></button>
                
            </div>
            </div>

              : '' }

          </div>   
    

          <ul className="Data_List">
            
            <li>
              <small>Total Clicks</small>
              <span>{this.state.totalclicks}</span>
            </li>
            <li>
              <small>CTR</small>
              <span>{this.state.ctr}%</span>
            </li>
            <li>
              <small>Total Calls</small>
              <span>{this.state.totalcalls}</span>
            </li>
            <li>
              <small>Avg Duration</small>
              <span>{this.state.avg_duration}</span>
            </li>
            <li>
              <small>Total Leads</small>
              <span>{this.state.totalleads}</span>
            </li>
            <li>
              <small>Conversion Rate</small>
              <span>{this.state.conversionrate}</span>
            </li>
            <li>
              <small>Total Cost</small>
             <NumberFormat value={this.state.totalcost} displayType={'text'} thousandSeparator={true} prefix={'$'} />
            </li>

          </ul>

    
         

          <div className="row ">

           



            <div className="col-md-12 margin15t">


            <div className="nav-tabs-custom">
            
           
            <div className="tab-content no-padding">




          <Bar
          data={data}
          width={200}
          height={500}
          options={{
            maintainAspectRatio: false,
            scales: {
    
    xAxes: [{
      scaleLabel: {
        display: true,
        labelString: this.state.xlabel
      }
    }],
    yAxes: [{
      scaleLabel: {
        display: true,
        labelString: this.state.ylabel
      }
    }],
  }  
          }}
        />
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
 
export default Dashboard;
