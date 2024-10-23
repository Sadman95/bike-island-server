const SIGNUP_PAYLOAD = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@doe.com',
  password: '12345',
  confirmPassword: '12345',
  isVerified: true
};

const SIGNIN_PAYLOAD = {
  email: 'john@doe.com',
  password: '12345',
  rememberMe: true
};

const PAYLOAD = {
  productTitle: 'Mountain Bike',
  productDesc: 'Mountain Bike is awesome to ride',
  brand: 'Hero',
  type: 'Gear',
  productImg:
    'https://img.freepik.com/free-vector/bicycle-cartoon-isolated_1308-27560.jpg?size=626&ext=jpg&ga=GA1.1.885695879.1720685552&semt=ais_hybrid',
  productPrice: 1200
};

 const ORDER_PAYLOAD = {
   items: [
     {
       product: '67155c135c041208ea7f31ce',
       quantity: 2,
       price: 12
     }
   ],
   totalAmount: 24,
   address: {
     street: '123 Main St',
     city: 'New York',
     state: 'NY',
     postalCode: '10001',
     country: 'USA'
   }
 };

module.exports = {
  SIGNUP_PAYLOAD,
  SIGNIN_PAYLOAD,
  PAYLOAD,
  ORDER_PAYLOAD
};
