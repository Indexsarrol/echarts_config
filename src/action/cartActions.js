export const ADD_TO_CART = 'ADD_TO_CART';

export function addToCart(text) {
    console.log(text);
    return {
        type: ADD_TO_CART,
        payload: text
    }
}

// const action = addToCart("learn redux");