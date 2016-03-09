import _ from 'lodash';

//const otherwise = Symbol(otherwise);

const defaultWeights = {
  'country': 1000,
  'administrative_area_level_1': 1000,
  'locality': 1000,
  'postal_code': 1000,
  'neighborhood': -10,
  'route': -10,
  'street_address': -10,
  'point_of_interest': -10,
};

const sumMap = _.flowRight(_.sum, _.map);

function locationWeight(location, weights = defaultWeights) {
  return sumMap(location['address_components'], addressComponent => {
    return sumMap(addressComponent.types, type => {
      return weights[type] || 0;
    });
  });
}

export function pickBestResult(locations, weights) {
  return _.maxBy(locations, location => locationWeight(location, weights));
}

export function humanize(locations, weights) {
  const location = pickBestResult(locations, weights);
  return _.reduce(
    _.map(location['address_components'], addressComponent => {
      return { [addressComponent.types[0]]: 'foo' };
    }),
    _.extend
  );
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
