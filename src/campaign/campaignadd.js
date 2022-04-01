import React, { Component } from "react";
import store from "store";
import axios from "axios";
import Header from "../Header";
import { Redirect, Link } from "react-router-dom";
import Auth from "../modules/Auth";

class Campaignadd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        lead_type: "",
        quality_type: "",
        base_price: "",
        bid_price: "",
        display_name: "",
        product_text: "",
        lead_type_text: "",
        quality_type_text: "",
      },
      errors: {},
      errorMessage: "",
      status: "",
      status_exist: 1,
      message: "",
      lead_results: [],
      quality_results: [],
      product_results: [],
      load_spinner: false,
    };

    //console.log(this.props.match.params.id);

    this.getLeadtypeandQuality();
    this.handleChange = this.handleChange.bind(this);
    this.change = this.change.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.submituserRegistrationForm =
      this.submituserRegistrationForm.bind(this);
  }

  changeStatus(e) {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;

    this.setState({
      fields,
    });
  }

  change(e) {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    fields[e.target.name + "_text"] =
      e.target.options[e.target.selectedIndex].text;

    let display_name =
      this.state.fields.product_text +
      "-" +
      this.state.fields.lead_type_text +
      "-" +
      this.state.fields.quality_type_text;
    fields["display_name"] = display_name;
    this.setState({
      fields,
    });
    //  this.multiselectRef.current.resetSelectedValues();

    //console.log(this.state.fields.lead_type)

    if (this.state.fields.lead_type != "" && this.state.fields.quality_type) {
      this.checkcampaignstatus(
        this.state.fields.lead_type,
        this.state.fields.quality_type,
        this.state.fields.product
      );
    }
  }

  checkcampaignstatus(lead_type, quality_type, product) {
    const headers = {
      "Content-Type": "application/json",
      Authkey: Auth.Authkey(),
      session: Auth.getToken(),
    };

    axios
      .post(
        `${Auth.getapiurl()}/checkcampaignstatus`,
        {
          lead_type: lead_type,
          quality_type: quality_type,
          product: product,
        },
        {
          headers: headers,
        }
      )
      .then((res) => {
        let fields = this.state.fields;
        const status_exist = res.data.status;
        const errorMessage = res.data.message;
        this.setState({ status_exist });

        if (res.data.status == 1) {
          Auth.toastmsg(res.data.message, "S");
        } else {
          Auth.toastmsg(res.data.message, "E");
        }

        if (status_exist == 1) {
          const base_price = res.data.responsedata.base_price;
          fields["base_price"] = base_price;
          this.setState({ fields });
          this.setState({ status: "" });
        } else {
          this.setState({ errorMessage });
          this.setState({ status: status_exist });
          fields["base_price"] = "0.00";
          this.setState({ fields });
        }
      });
  }

  renderAlert() {
    if (this.state.errorMessage && this.state.status == "0") {
      return (
        <div className="row">
          <div className="col-md-12">
            <div className="alert alert-danger">
              <strong>!Opps, </strong>
              {this.state.errorMessage}
            </div>
          </div>
        </div>
      );
    } else if (this.state.status == "1") {
      return (
        <div className="row">
          <div className="col-md-12">
            <div className="alert alert-success">
              <strong>Success, </strong>
              {this.state.errorMessage}
            </div>
          </div>
        </div>
      );
    }
  }

  handleChange(e) {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState({
      fields,
    });
  }

  getLeadtypeandQuality() {
    const headers = {
      "Content-Type": "application/json",
      Authkey: Auth.Authkey(),
      session: Auth.getToken(),
    };

    axios
      .post(
        `${Auth.getapiurl()}/getLeadtypeandQuality`,
        {
          userID: this.props.match.params.id,
        },
        {
          headers: headers,
        }
      )
      .then((res) => {
        const lead_results = res.data.responsedata.lead_results;
        this.setState({ lead_results });
        const quality_results = res.data.responsedata.quality_results;
        this.setState({ quality_results });
        const product_results = res.data.responsedata.product_results;
        this.setState({ product_results });
      });
  }

  submituserRegistrationForm(e) {
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
          `${Auth.getapiurl()}/addCampaign`,
          {
            product: this.state.fields.product,
            lead_type_id: this.state.fields.lead_type,
            quality_id: this.state.fields.quality_type,
            base_price: this.state.fields.base_price,
            bid_price: this.state.fields.bid_price,
            status: this.state.fields.status,
            display_name: this.state.fields.display_name,
          },
          {
            headers: headers,
          }
        )

        .then((res) => {
          this.setState({
            errorMessage: res.data.message,
            status: res.data.status,
          });

          if (res.data.status == 1) {
            Auth.toastmsg(res.data.message, "S");
            setTimeout(() => {
              this.setState({
                errorMessage: "",
                status: "",
              });

              this.setState({ load_spinner: false });
              this.props.history.push("/campaign");
            }, 2000);
          } else {
            this.setState({ load_spinner: false });
            Auth.toastmsg(res.data.message, "E");
          }
        });
    }
  }

  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields["product"]) {
      formIsValid = false;
      errors["product"] = "*Please select Product.";
    }

    if (!fields["lead_type"]) {
      formIsValid = false;
      errors["lead_type"] = "*Please select Line of Business.";
    }

    if (!fields["quality_type"]) {
      formIsValid = false;
      errors["quality_type"] = "*Please select Media Channel.";
    }

    if (!fields["base_price"]) {
      formIsValid = false;
      errors["base_price"] = "*Please Enter Base Price.";
    }

    if (!fields["bid_price"]) {
      formIsValid = false;
      errors["bid_price"] = "*Please Enter Bid Price.";
    } else {
      if (parseInt(fields["bid_price"]) < parseInt(fields["base_price"])) {
        formIsValid = false;
        errors["bid_price"] = "*Please Enter Higher Bid Price of base price.";
      }
    }

    if (typeof fields["bid_price"] !== "undefined") {
      if (!fields["bid_price"].match(/^\d+(\.\d{1,2})?$/)) {
        formIsValid = false;
        errors["bid_price"] = "*Please Enter Numeric Value Price.";
      }
    }

    if (!fields["status"]) {
      formIsValid = false;
      errors["status"] = "*Please select Campaign Status.";
    }

    if (!fields["display_name"]) {
      formIsValid = false;
      errors["display_name"] = "*Please Enter Display Name.";
    }

    this.setState({
      errors: errors,
    });
    return formIsValid;
  }

  render() {
    const fields = this.state.fields;

    if (!Auth.getToken()) {
      return <Redirect to="/login" />;
    }

    let select_product;

    select_product = (
      <select className="form-control" onChange={this.change} name="product">
        <option value="">-Select Product-</option>
        {this.state.product_results.map((value) => (
          <option key={value.product_id} value={value.name}>
            {value.name}
          </option>
        ))}
      </select>
    );

    let select_lead_type;

    select_lead_type = (
      <select className="form-control" onChange={this.change} name="lead_type">
        <option value="">-Select Line of Business-</option>
        {this.state.lead_results.map((value) => (
          <option key={value.lead_type_id} value={value.lead_type_id}>
            {value.lead_type_name}
          </option>
        ))}
      </select>
    );

    let select_quality_type;

    select_quality_type = (
      <select
        className="form-control"
        onChange={this.change}
        name="quality_type"
      >
        <option value="">-Select Media Channel-</option>
        {this.state.quality_results.map((value) => (
          <option key={value.quality_id} value={value.quality_id}>
            {value.name}
          </option>
        ))}
      </select>
    );

    let input_base_price;

    input_base_price = (
      <input
        type="text"
        className="form-control"
        readOnly
        placeholder="Base Price"
        defaultValue={this.state.fields.base_price}
        onChange={this.handleChange}
        onKeyUp={this.handleChange}
        name="base_price"
      />
    );

    let input_bid_price;

    input_bid_price = (
      <input
        type="text"
        className="form-control"
        placeholder="Bid Price"
        defaultValue={this.state.fields.bid_price}
        onChange={this.handleChange}
        onKeyUp={this.handleChange}
        name="bid_price"
      />
    );

    let input_display_name;

    input_display_name = (
      <input
        type="text"
        className="form-control"
        placeholder="Display Name"
        defaultValue={this.state.fields.display_name}
        onChange={this.handleChange}
        onKeyUp={this.handleChange}
        name="display_name"
      />
    );

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
                    <h3 className="box-title">Add New Campaign</h3>
                  </div>

                  <form
                    className="form-horizontal has-validation-callback"
                    onSubmit={this.submituserRegistrationForm}
                  >
                    <div className="box-body">
                      <div className="form-group">
                        <label className="col-sm-2 control-label">
                          Product: <span className="red">*</span>
                        </label>

                        <div className="col-sm-6">
                          {select_product}
                          <div className="errorMsg">
                            {this.state.errors.product}
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="col-sm-2 control-label">
                          Line of Business: <span className="red">*</span>
                        </label>

                        <div className="col-sm-6">
                          {select_lead_type}
                          <div className="errorMsg">
                            {this.state.errors.lead_type}
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="col-sm-2 control-label">
                          Media Channel: <span className="red">*</span>
                        </label>

                        <div className="col-sm-6">
                          {select_quality_type}
                          <div className="errorMsg">
                            {this.state.errors.quality_type}
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="col-sm-2 control-label">
                          Base Price: <span className="red">*</span>
                        </label>

                        <div className="col-sm-6">
                          {input_base_price}
                          <div className="errorMsg">
                            {this.state.errors.base_price}
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="col-sm-2 control-label">
                          Bid Amount: <span className="red">*</span>
                        </label>

                        <div className="col-sm-6">
                          {input_bid_price}
                          <div className="errorMsg">
                            {this.state.errors.bid_price}
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="col-sm-2 control-label">
                          Display Name: <span className="red">*</span>
                        </label>

                        <div className="col-sm-6">
                          {input_display_name}
                          <div className="errorMsg">
                            {this.state.errors.display_name}
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="col-sm-2 control-label">
                          Campaign Status: <span className="red">*</span>
                        </label>

                        <div className="col-sm-6">
                          <select
                            className="form-control"
                            onChange={this.changeStatus}
                            name="status"
                          >
                            <option value="">-Select status-</option>
                            <option value="Draft">Save Campaign</option>
                            <option value="ReadytoGoLive">
                              Ready to GoLive
                            </option>
                            <option value="RequestActivation">
                              Request Activation
                            </option>
                          </select>

                          <div className="errorMsg">
                            {this.state.errors.status}
                          </div>
                        </div>
                      </div>

                      <div className="box-footer text-center col-sm-8">
                        <Link className="btn btn-primary" to="/campaign">
                          Back
                        </Link>
                        {this.state.status_exist == 1 ? (
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
                        ) : (
                          ""
                        )}
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

export default Campaignadd;
