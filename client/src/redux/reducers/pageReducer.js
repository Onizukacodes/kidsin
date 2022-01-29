import { GLOBALTYPES } from "../actions/globalTypes";

const initialState={
  a:''
}
const pageReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.PAGEID:
      console.log(action.payload)
      return {...state,a:action.payload};

    default:
      return state;
  }
};

export default pageReducer;
