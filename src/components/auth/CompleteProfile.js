import React, { Component } from 'react';
import FormErrors from "../FormErrors";
import Validate from "../utility/FormValidation";
import { Auth } from "aws-amplify";


class CompleteProfile extends Component {
  state = {
    address: "",
    given_name: "",
    family_name: "",
    confirmfamily_name: "",
    errors: {
      cognito: null,
      blankfield: false,
      family_namematch: false
    }
  }

  clearErrorState = () => {
    this.setState({
      errors: {
        cognito: null,
        blankfield: false,
        family_namematch: false
      }
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    // Form validation
    this.clearErrorState();
    const error = Validate(event, this.state);
    if (error) {
      this.setState({
        errors: { ...this.state.errors, ...error }
      });
    }

    // AWS Cognito integration here
    const { address, given_name, family_name } = this.state;
    try {
      const user = await Auth.currentAuthenticatedUser();

      let params = {};
      const CompleteProfileResponse = await Auth.updateUserAttributes(
        user, {
          'address': address,
          'given_name': given_name,
          'family_name': family_name
        }
      );
      this.props.history.push("/");
      console.log(CompleteProfileResponse);
    } catch (error) {
      let err = null;
      !error.message ? err = { "message": error } : err = error;
      this.setState({
        errors: {
          ...this.state.errors,
          cognito: err
        }
      });
    }
  }

  onInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
    document.getElementById(event.target.id).classList.remove("is-danger");
  }

  render() {
    return (
      <section className="section auth">
        <div className="container">
          <h1>Complete Profile</h1>
          <FormErrors formerrors={this.state.errors} />

          <form onSubmit={this.handleSubmit}>
            <div className="field">
              <p className="control">
                <input 
                  className="input" 
                  type="text"
                  id="address"
                  aria-describedby="addressHelp"
                  placeholder="Enter address"
                  value={this.state.address}
                  onChange={this.onInputChange}
                />
              </p>
            </div>
            <div className="field">
              <p className="control">
                <input 
                  className="input" 
                  type="given_name"
                  id="given_name"
                  aria-describedby="given_nameHelp"
                  placeholder="Enter first name"
                  value={this.state.given_name}
                  onChange={this.onInputChange}
                />
              </p>
            </div>
            <div className="field">
              <p className="control">
                <input 
                  className="input" 
                  type="family_name"
                  id="family_name"
                  placeholder="Enter last name"
                  value={this.state.family_name}
                  onChange={this.onInputChange}
                />
              </p>
            </div>
            
            <div className="field">
              <p className="control">
                <button className="button is-success">
                  Submit
                </button>
              </p>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export default CompleteProfile;