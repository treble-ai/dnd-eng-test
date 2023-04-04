import CountriesModule from "utils/Countries";
import Dropdown from "./Dropdown";
import "Components/countryDropdown.scss";
import React from "react";
const IMPORTANT_COUNTRIES = ["Colombia", "Brazil", "Mexico", "Argentina"];

/*
	props:
		- onSelect funcition: tells parent changes on dropdown
		- selectedCountry str: display if it is diferent from undifined 
	
*/

class CountryDropdown extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			countryIndex: 0,
			open: false,
			dropdown: undefined,
			keypress: "",
		};
	};
	keypressListener = (event) =>{
		let country_list = CountriesModule.filter(
			(country) => country.name.charAt(0) == event.key.toUpperCase()
		);
		let country = country_list[0];
		if (country == undefined) {
			return;
		}
		let is_important_country = IMPORTANT_COUNTRIES.includes(country.name);
		if (is_important_country) {
			country = country_list[1];
		}
		var elmnt = document.getElementById(country.name);
		elmnt.scrollIntoView();
	};

	eventListener = () => {
		if (this.state.dropdown) {
			window.addEventListener("keypress", this.keypressListener);
		} else {
			window.removeEventListener("keypress", this.keypressListener);
		}
	};

	toggleDropdown = () =>{
		this.setState({
			dropdown: !this.state.dropdown,
		});
	};

	handleCountrySelect = (key) =>{
		this.props.onSelect(key);
		this.setState({
			countryIndex: key,
			dropdown: !this.state.dropdown,
		});
	};

	renderContent = (country) =>{
		if(this.props.render == 'name'){
			return(
				<div className="drop-content">
						<p className="r">
							{`+${country["phone"]} ${country["name"]}`}
						</p>
						<div className = 'flush-right'>
							<i className = 'fa fa-caret-down'/>
						</div>
				</div>
			)
			
		}else{
			return(
				<div className="drop-content">
					<span className="flag-span">
						<img
							src={country["image"]}
							className="flag"
						/>
					</span>
					<span>
						<p className="r">
							{" "}
							{"+" + country["phone"]}{" "}
						</p>{" "}
					</span>
				</div>
			)
		}
	};
	render() {
		let component = this;
		component.eventListener();
		let options = CountriesModule.map((item, key) => (
			<div
				className="dropdown-item"
				key={key}
				id={CountriesModule[key]["name"]}
				onClick={(e) => this.handleCountrySelect(key)}
			>
				<a className="dropdown-item-in" href="#">
					<img src={CountriesModule[key]["image"]} />
					<span className="country-item-name">
						{CountriesModule[key]["name"].length > 23
							? CountriesModule[key]["name"].slice(0, 20) + "..."
							: CountriesModule[key]["name"]}
					</span>
					<span className="country-item-phone">
						+{CountriesModule[key]["phone"]}
					</span>
				</a>
			</div>
		));
		//form inputs
		let country;
		if (this.props.currentCountry !== undefined) {
			country = CountriesModule[this.props.currentCountry]
		} else {
			country = CountriesModule[this.state.countryIndex];
		}

		let form = [
			<div className="form-group m-form__group" key = "this-countryDropdown-container">
				<div className="input-group" key = "countryDropdown-container">
					<div className="input-group-prepend">
						<Dropdown
							display={this.state.dropdown}
							onToggle={this.toggleDropdown.bind(this)}
							text={this.renderContent(country)}
						>
							<ul className="m-nav">{options}</ul>
						</Dropdown>
					</div>
				</div>
			</div>,
		];
		return <div className="country-selector-v2"> {form} </div>;
	}
}
export default CountryDropdown;
