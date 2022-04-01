import React, { Component } from "react";
import store from "store";
import axios from "axios";
import Header from "../Header";
import { Redirect, Link } from "react-router-dom";
import Auth from "../modules/Auth";
import "../campaign/style.css";

class Apispecs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [],
      errors: {},
      errorMessage: "",
      status: 0,
      Campaign_code: "",
      load_spinner: false,
    };
  }

  render() {
    const fields = this.state.fields;
    const campaignID = this.props.match.params.id;
    const token_lead = this.props.match.params.token;
    const token = token_lead!="null" ? token_lead : <b>"ask administrator to generate Token"</b>;
    const display_name = this.props.match.params.display_name;
    
    
    if (!Auth.getToken()) {
      return <Redirect to="/login" />;
    }

    return (
      <div id="main" style={{ padding: "15px" }}>
        <div id="documentation">
          <h1>
            Consumer Coverage Click Marketplace Real-time Bidding (RTB) API
            Specifications - ({display_name})
          </h1>

          <code>NOTE: You will need your IP(s) white-listed before being able to make any RTB requests.</code>

          <h4>Get Current Bids</h4>
         

          <p>
          This API Call will return an average position for the Campaign based on the data range passed. <br /> This API Call will also return difference between payouts for 1st Position and the current client payouts if their position is > 1.
           
        
          </p>

         

          <h4>POST URL</h4>

          <p>
            <code>https://cpanel.consumercoverage.com/api/getCurrentBid</code>
          </p>

         
         
          <p></p>
          <h4>Parameters are as below:</h4>
          <table class="list zebra top table table-border" width="900">
            <tbody>
              <tr>
                <th>Parameter Name</th>
                <th>Required or Not</th>
                <th>Example</th>
              </tr>
              <tr>
                <td class="code">AuthKey</td>
                <td>Required</td>
                <td>{token}</td>
              </tr>
              <tr>
                <td class="code">campaignID</td>
                <td>Required</td>
                <td>{campaignID}</td>
              </tr>
              <tr>
                <td class="code">state</td>
                <td>state	Not Required. If you don’t pass it will take based on your filters	US state two character short code</td>
                <td>US state two character short code</td>
              </tr>
              <tr>
                <td class="code">from_date</td>
                <td>
                Required
                </td>
                <td>Date in YYYY-MM-DD format</td>
              </tr>


              <tr>
                <td class="code">to_date</td>
                <td>
                Required
                </td>
                <td>Date in YYYY-MM-DD format</td>
              </tr>
            </tbody>
          </table>
          <p></p>

          <h4>Example Request JSON</h4>
          <p>
            <code name="lead_ping_post">
              {'{'}
              <br />
              {'"AuthKey":"'+token+'",'}
              <br />
              {'"campaignID":"'+campaignID+'",'}
              <br />
              {' "state":"AL",'}
              <br />
              {' "from_date":"2021-06-25",'}
              <br />
              {' "to_date":"2021-06-30"'}

              <br />
              {'}'}
            </code>
          </p>




          <h4>Response Data:</h4>

          <table class="list zebra top table table-border" width="900">
            <tbody>
              <tr>
                <th>Parameter Name</th>
                <th>Explanation</th>
                
              </tr>
              <tr>
                <td class="code">status</td>
                <td>1 for Success , 0 for Failure</td>
             
              </tr>
              <tr>
                <td class="code">avg_position</td>
                <td>Average Position of your campaign for specified date period</td>
                
              </tr>
              <tr>
                <td class="code">difference_price</td>
                <td>Difference between Price for 1st Position and their price if their position is > 1</td>
              </tr>
              <tr>
                <td class="code">Message</td>
                <td>
                Success or failure message
                </td>
               
              </tr>


            
            </tbody>
          </table>

          <p>
            <code name="lead_ping_post">
              {'{'}
              <br />
              {'"status":1,'}
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;{' "responsedata":'}
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;{'{'}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;{' "avg_position":2,'}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;{' "difference_price":"0.08"'}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;{'},'}
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;{' "message":"Data Found Successfully"'}
                


                  <br />
              {'}'}
            </code>
          </p>





          <hr/>

          <h4><b>Update Current Bids</b></h4>
         

          <p>
          This API Call will update your bid price for any given campaign.
           
        
          </p>

         

          <h4>POST URL</h4>

          <p>
            <code>https://cpanel.consumercoverage.com/api/updateCurrentBid</code>
          </p>

         
         
          <p></p>
          <h4>Parameters are as below:</h4>
          <table class="list zebra top table table-border" width="900">
            <tbody>
              <tr>
                <th>Parameter Name</th>
                <th>Required or Not</th>
                <th>Example</th>
              </tr>
              <tr>
                <td class="code">AuthKey</td>
                <td>Required</td>
                <td>{token}</td>
              </tr>
              <tr>
                <td class="code">campaignID</td>
                <td>Required</td>
                <td>{campaignID}</td>
              </tr>
              <tr>
                <td class="code">state</td>
                <td>Required if your Pricing is Dynamic (State wise) and You are passing Fixed on type variable below. </td>
                <td>US state two character short code</td>
              </tr>
              <tr>
                <td class="code">type</td>
                <td>
                Required
                </td>
                <td>Fixed / Variable</td>
              </tr>


              <tr>
                <td class="code">amount</td>
                <td>
                Required
                </td>
                <td>Decimal Value</td>
              </tr>
            </tbody>
          </table>
          <p></p>

          <h4>Example Request JSON</h4>
          <p>
            <code name="lead_ping_post">
              {'{'}
              <br />
              {'"AuthKey":"'+token+'",'}
              <br />
              {'"campaignID":"'+campaignID+'",'}
              <br />
              {' "state":"AL",'}
              <br />
              {' "type":"Fixed",'}
              <br />
              {' "amount":"2"'}

              <br />
              {'}'}
            </code>
          </p>




          <h4>Response Data:</h4>

          <table class="list zebra top table table-border" width="900">
            <tbody>
              <tr>
                <th>Parameter Name</th>
                <th>Explanation</th>
                
              </tr>
              <tr>
                <td class="code">status</td>
                <td>1 for Success , 0 for Failure</td>
             
              </tr>
              <tr>
                <td class="code">updated_price</td>
                <td>Updated Price only when Individual state updated or fixed price Campaign</td>
                
              </tr>
             
              <tr>
                <td class="code">Message</td>
                <td>
                Success or failure message
                </td>
               
              </tr>


            
            </tbody>
          </table>

          <p>
            <code name="lead_ping_post">
              {'{'}
              <br />
              {'"status":1,'}
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;{' "responsedata":'}
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;{'{'}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;{' "updated_price":"20",'}
                
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;{'},'}
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;{' "message":"Price Update Successfully'}
                


                  <br />
              {'}'}
            </code>
          </p>  


          <p>
          When You have Dynamic Pricing and Fixed Type is selected and State not Passed.
          </p>

         
          <p>
            <code name="lead_ping_post">
              {'{'}
              <br />
              {'"status":"0",'}
              <br />
              {' "responsedata":"[]",'}
              <br />
              {' "message":"State Required."'}
            
              <br />
              {'}'}
            </code>
          </p>




        </div>
      </div>
    );
  }
}

export default Apispecs;
