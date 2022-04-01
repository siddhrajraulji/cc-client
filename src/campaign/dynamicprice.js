import React, { Component } from "react";
import store from "store";
import axios from "axios";
import Header from "../Header";
import { Redirect, Link } from "react-router-dom";
import Auth from "../modules/Auth";

let weekday = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

class Dynamicprice extends Component {
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

    this.getDynamicprice();
    this.handleChange = this.handleChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  submitForm(e) {
    e.preventDefault();
    if (this.validateForm()) {
      this.setState({ load_spinner: true });

      const headers = {
        "Content-Type": "application/json",
        Authkey: Auth.Authkey(),
        session: Auth.getToken(),
      };

      axios
        .post(
          `${Auth.getapiurl()}/getupdatedynamicprice`,
          {
            campaign_id: this.props.match.params.id,
            data: this.state.fields,
          },
          {
            headers: headers,
          }
        )

        .then((res) => {
          //console.log(res);
          this.setState({
            errorMessage: res.data.message,
            status: res.data.status,
          });
          this.setState({ load_spinner: false });
          if (res.data.status == 1) {
            Auth.toastmsg(res.data.message, "S");
          } else {
            Auth.toastmsg(res.data.message, "E");
          }
          this.props.history.push("/campaign");
        });
    }
  }

  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    fields.map((question, i) => {
      if (!question.stateprice) {
        formIsValid = false;
        var stateCopy = Object.assign({}, this.state);
        stateCopy.fields[i].errorsmsg = "Fill " + question.statecode;
        this.setState(stateCopy);
      } else {
        var stateCopy = Object.assign({}, this.state);
        stateCopy.fields[i].errorsmsg = "";
        this.setState(stateCopy);
      }
    });

    return formIsValid;
  }

  getDynamicprice() {
    const headers = {
      "Content-Type": "application/json",
      Authkey: Auth.Authkey(),
      session: Auth.getToken(),
    };

    axios
      .post(
        `${Auth.getapiurl()}/getdynamicprice`,
        {
          campaign_id: this.props.match.params.id,
        },
        {
          headers: headers,
        }
      )
      .then((res) => {
        const status = res.data.status;
        this.setState({ status });
        const Campaign_code = res.data.responsedata.Campaign_code;
        this.setState({ Campaign_code });
        const bid_type = res.data.responsedata.bid_type;
        this.setState({ bid_type });
        if (status == 1) {

            if (bid_type == "Dynamic") {
              const data = res.data.responsedata.campaign_price;

              var fields = this.state.fields;

              data.map(function (map) {
                fields.push({
                  priceid: map.priceid,
                  statecode: map.statecode,
                  stateprice: map.stateprice,
                  statename: map.statename,
                  errorsmsg: "",
                });
              });
              this.setState({ fields: fields });
            } else {
              Auth.toastmsg(res.data.message, "E");
            }
        } else {
          var fields = this.state.fields;
          weekday.map(function (map, i) {
            fields.push({
              priceid: "",
              statecode: "",
              stateprice: "",
              statename: "",
            });
          });
          this.setState({ fields: fields });
        }
      });
  }

  handleChange(e) {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState({
      fields,
    });
  }

  render() {
    const fields = this.state.fields;

    if (!Auth.getToken()) {
      return <Redirect to="/login" />;
    }

    var questionNodes = this.state.fields.map((question, i) => {
      var updateTextBox = (e) => {
        var stateCopy = Object.assign({}, this.state);
        stateCopy.fields[i].stateprice = e.target.value;
        this.setState(stateCopy);
      };

      return (
        <div key={question.priceid}>
          <label className="col-md-1 control-label">
            {question.statecode} : <span className="red">*</span>
          </label>

          <div className="col-md-2">
            <input
              type="number"
              step="0.1"
              className="form-control"
              placeholder={question.statename}
              defaultValue={question.stateprice}
              onChange={updateTextBox}
              onKeyUp={updateTextBox}
            />
            <div className="errorMsg">{question.errorsmsg}</div>
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
              <div className="col-md-12 text-center"></div>

              <div className="col-md-12">
                <div className="box box-info">
                  <div className="box-header with-border">
                    <h3 className="box-title">Dynamic Price</h3>
                    <div class="pull-right">
                      <h2 className="box-title">
                        [ Campaign : {this.state.Campaign_code} ]
                      </h2>
                    </div>
                  </div>

                  <form
                    className="form-horizontal has-validation-callback"
                    onSubmit={this.submitForm}
                  >
                    <div className="box-body">
                      <div className="row">{questionNodes}</div>

                     
                      <div className="box-footer text-center col-sm-12">
                      <Link className="btn btn-primary" to="/campaign">
                          Back
                        </Link>
                      {this.state.bid_type=="Dynamic" ?
                       
                        this.state.load_spinner ? (
                          <button className="btn btn-info leftside">
                            <i className="fa fa-spinner fa-spin"></i>
                          </button>
                        ) : (
                          <button
                            type="submit"
                            className="btn btn-info leftside"
                          >
                            Save
                          </button>
                        ) 
                        : ''
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

export default Dynamicprice;
