import React,{useState} from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';


const Component = () => 
{
    const [value, setValue] = useState(null);
    console.log(value)
// geocodeByAddress(value.label)
// .then(results => getLatLng(results[0]))
// .then(({ lat, lng }) =>
//   console.log('Successfully got latitude and longitude', { lat, lng })
// );
    
    return(

  <div>
    <GooglePlacesAutocomplete
      apiKey="AIzaSyB_dTh5gK_Jw0K-Snt7CG84DarcmxnAOOA"
      selectProps={{
        value,
        onChange: setValue,
      }}
    />
  </div>
);}

export default Component;