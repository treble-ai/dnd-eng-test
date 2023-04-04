import CountriesModule from "utils/Countries";
import MultipleSelectDropdown from "./MultipleSelectDropdown";
import "Components/MultipleSelectCountryDropdown.scss";
import React from "react";
const IMPORTANT_COUNTRIES = ["Colombia", "Brazil", "Mexico", "Argentina"];

/*
	props:
		- onSelect func: info on changes to parent
	
*/

class MultipleSelectCountryDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countries: this.getOptionsFromCountryCodes(),
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.countryCodes !== prevProps.countryCodes) {
      this.setState({ countries: this.getOptionsFromCountryCodes() });
    }
  }

  handleCountrySelect = (keys) => {
    this.setState({ countries: keys });
    this.props.onSelect(keys);
  };

  getOptionsFromCountryCodes = () => {
    let selectedOptions = [];
    if (this.props.countryCodes) {
      CountriesModule.forEach((country) => {
        this.props.countryCodes.forEach((cc) => {
          if (
            cc === `+${country.phone}` &&
            !selectedOptions.includes(country)
          ) {
            selectedOptions.push(country);
          }
        });
      });
    }
    return selectedOptions;
  };

  orderOptions = () => {
    let countriesInfo = [...CountriesModule];

    countriesInfo.sort((a, b) => {
      if (this.state.countries.includes(a)) {
        return -1;
      } else if (this.state.countries.includes(b)) {
        return 1;
      } else {
        if (IMPORTANT_COUNTRIES.includes(a["name"])) {
          return -1;
        } else if (IMPORTANT_COUNTRIES.includes(b["name"])) {
          return 1;
        }
        return 0;
      }
    });

    return countriesInfo;
  };

  render() {
    return (
      <div className="multipleselect-country-selector-v2">
        <MultipleSelectDropdown
          options={this.orderOptions()}
          display={(opt) => {
            return (
              <div className="country">
                <span className="flag-span">
                  <img src={opt["image"]} className="flag" />
                </span>
                <span>
                  <p className="r"> {"+" + opt["phone"]} </p>
                </span>
                {this.state.countries.includes(opt) ? (
                  <div className="icon icon--check" />
                ) : null}
              </div>
            );
          }}
          titleDisplay={(selectedOptions) => {
            console.log(selectedOptions);
            return `${selectedOptions.length} ${this.props.strings.selected}`;
          }}
          noSelectionTitle={this.props.noSelectionTitle}
          onSelect={this.handleCountrySelect}
          selectedOptions={this.getOptionsFromCountryCodes()}
        ></MultipleSelectDropdown>
      </div>
    );
  }
}
export default MultipleSelectCountryDropdown;
