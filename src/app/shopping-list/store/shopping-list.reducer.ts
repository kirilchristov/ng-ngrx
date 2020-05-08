import { Action } from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.actions'

import { Ingredient } from '../../shared/ingredient.model';

export interface State {
  ingredients: Ingredient[],
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

export interface AppState {
  shoppingList: State;
}


const initialState: State = {
  ingredients: [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10),
  ],
  editedIngredient:null,
  editedIngredientIndex: -1, // we store -1 beacuse 0 will be a valid index
};

export function shoppingListReducer(
  state:State = initialState,
  //our TS knows the SLActions is one of the types exported
  action: ShoppingListActions.SLActions
  ) {
  switch (action.type) {
    //--- ADD ONE
    case ShoppingListActions.ADD_INGREDIENT:
      return {
        ...state, //always inlcude the old state
        ingredients: [...state.ingredients, action.payload]
      };
    //--- ADD MANY
    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload]
      };
    //--- UPDATE
    case ShoppingListActions.UPDATE_INGREDIENT:
      const ingredient = state.ingredients[action.payload.index]
      const updatedIngredient = {
        ...ingredient, //it keeps the old ingredient and re-writes the new stuff, good practice but NOT MANDATORY
        ...action.payload.ingredient //changes what need to be changed
      }
      const updatedIngredients = [...state.ingredients] //creating a copy of the old state ingredients so to safely edit
      updatedIngredients[action.payload.index] = updatedIngredient
      return {
        ...state,
        ingredients: updatedIngredients
      }
    //--- DELETE
    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter((ing, ingIndex)=> { //classic js filter, takes argument and index (automatically)
          return ingIndex !== action.payload // return true/ false. In this case we return all items that are not with the deleted item index (action.payload)
        })
      }

      //--- START EDIT - I want to set the item INDEX and ITEM
      case ShoppingListActions.START_EDIT:
        return {
          ...state,
          editedIngredientIndex: action.payload, //in this case the payload is just a number
          editedIngredient: {...state.ingredients[action.payload]} // editedIngredient: a new object so not to mess with the original state

        }

      //--- STOP EDIT
      case ShoppingListActions.STOP_EDIT:
        return {
          ...state,
          editedIngredient: null,
          editedInfredientIndex: -1,
        }

    default:
      return state;
  }
}
