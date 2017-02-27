import { fx_bar } from '../actions/validations';
import { f_bar } from '../actions/validations';

export default function (state = "", action) {
    switch (action.type) {

        case fx_bar:
            return action.payload;
            break;

        case f_bar:
            {
                return action.payload;
                break;
            }

            defualt: return state;
    }
    return state;
}
