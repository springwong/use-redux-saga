const initialState = 0;
const reducer = (state: number = initialState, action: any):number  => {
  switch (action.type) {
    case 'demo_add': return state + 1;
    case 'demo_minus': return state - 1;
    case 'demo_set': return action.count;
  }
  return state;
};

export default reducer;