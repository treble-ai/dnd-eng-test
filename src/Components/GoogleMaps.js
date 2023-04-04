import React from "react";

class GoogleMapsSearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.autocompleteInput = React.createRef();
    this.autocomplete = null;
    this.handlePlaceChanged = this.handlePlaceChanged.bind(this);
  }

  componentDidMount() {
    this.autocomplete = new window.google.maps.places.Autocomplete(
      this.autocompleteInput.current,
      { types: ["geocode"] }
    );

    this.autocomplete.addListener("place_changed", this.handlePlaceChanged);
  }

  handlePlaceChanged() {
    const place = this.autocomplete.getPlace();
    this.props.onPlaceLoaded(place);
  }

  render() {
    return (
      <input
        ref={this.autocompleteInput}
        id="autocomplete"
        placeholder="Enter your address"
        type="text"
        onChange={this.props.onChange}
      ></input>
    );
  }
}

class TrebleMapPointer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <i className="icon icon--map-pin-lavander"></i>
      </div>
    );
  }
}

export { GoogleMapsSearchBar, TrebleMapPointer };
