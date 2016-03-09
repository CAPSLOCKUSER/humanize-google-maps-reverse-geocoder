'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pickBestResult = pickBestResult;
exports.humanize = humanize;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//const otherwise = Symbol(otherwise);

var defaultWeights = {
  'country': 1000,
  'administrative_area_level_1': 1000,
  'locality': 1000,
  'postal_code': 1000,
  'neighborhood': -10,
  'route': -10,
  'street_address': -10,
  'point_of_interest': -10
};

var sumMap = _lodash2.default.flowRight(_lodash2.default.sum, _lodash2.default.map);

function locationWeight(location) {
  var weights = arguments.length <= 1 || arguments[1] === undefined ? defaultWeights : arguments[1];

  return sumMap(location['address_components'], function (addressComponent) {
    return sumMap(addressComponent.types, function (type) {
      return weights[type] || 0;
    });
  });
}

function pickBestResult(locations, weights) {
  return _lodash2.default.maxBy(locations, function (location) {
    return locationWeight(location, weights);
  });
}

function humanize(locations, weights) {
  var location = pickBestResult(locations, weights);
  return _lodash2.default.reduce(_lodash2.default.map(location['address_components'], function (addressComponent) {
    return _defineProperty({}, addressComponent.types[0], 'foo');
  }), _lodash2.default.extend);
}

/*export function formatLocationForServer(location, radius) {
 const componentForm = {
 country: 'short_name', // US
 locality: 'long_name', // city
 administrative_area_level_1: 'short_name', // state
 postal_code: 'short_name' // zip
 };

 const tempPos = _.reduce(
 _.map(location.address_components, (ac) => {
 const format = componentForm[ac.types[0]];
 return {[ac.types[0]]: ac[format]};
 }), _.extend
 );

 const position = {
 'radius': radius,
 'lat': location.geometry.location.lat(),
 'lng': location.geometry.location.lng(),
 'name': location.formatted_address,
 'placeId': location.place_id,
 'country': tempPos.country,
 'city': tempPos.locality,
 'state': tempPos.administrative_area_level_1,
 'zip': tempPos.postal_code
 };
 return _.pickBy(position, _.identity);
 }*/
