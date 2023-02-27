import { render, fireEvent, cleanup} from '@testing-library/react';
import Login from './Login';
import {beforeEach, describe, afterEach, it, expect, beforeAll, afterAll} from 'vitest';
import LoginRequest from './LoginRequest';
import { act } from 'react-dom/test-utils';
import { handlers } from '../../mocks/handlers';
import { setupServer } from 'msw/node';

// setup the mock server handler
const server = setupServer(...handlers);

let userNameField: any;
let passwordField: any;
let loginButton: any;

beforeAll(()=>{
  server.listen();
})

beforeEach(()=>{
  const { getByRole, getByPlaceholderText } = render(<Login />);
  userNameField = getByPlaceholderText(/Username/i);
  passwordField = getByPlaceholderText(/Password/i);
  loginButton = getByRole("button",{name:"Log In"});

})

afterEach(()=>{
  cleanup();
  server.resetHandlers();
})

afterAll(()=>{
  server.close();
})

describe("Login",()=>{

const user = {
  username:'Admin',
  password: 'Admin123'
}

it("Should render the form inputs and submit button",()=>{
  expect(userNameField).toBeTruthy()
  expect(passwordField).toBeTruthy()
  expect(loginButton).toBeTruthy()
});

it("Should change form values when a user types a new entry",()=>{
  fireEvent.change(userNameField,{target:{value:user.username}})
  fireEvent.change(passwordField,{target:{value:user.password}})
  expect((userNameField as HTMLInputElement).value).toBe(user.username);
  expect((passwordField as HTMLInputElement).value).toBe(user.password);
});

it("Should display an error message when form inputs are empty on submit", async()=>{
    await act(async ()=>{
      const errorMessage1 = await LoginRequest("","")
      const errorMessage2 = await LoginRequest(user.username,"")
      const errorMessage3 = await LoginRequest("",user.password)
      expect(errorMessage1).toBe("Please fill in the form")
      expect(errorMessage2).toBe("Please fill in the form")
      expect(errorMessage3).toBe("Please fill in the form")
    })
});

it("Should not display an empty form error when inputs contain some value",async()=>{
  const errorMessage = await LoginRequest(user.username,user.password)
  expect(errorMessage).not.toBe("Please fill in the form")
})

it("Should not authenticate a user with invalid credentials",async()=>{
const response = await fetch('https://dev3.openmrs.org/openmrs/ws/rest/v1/session', {
  headers: {
    Authorization: 'Basic ' + btoa('notAdmin:notAdmin123'),
  },
});
expect(response.status).toEqual(401)
const responseBody = await response.json()
expect(responseBody.authenticated).toBe(false)
})

it("Should authenticate a user with valid credentials",async()=>{
const response = await fetch('https://dev3.openmrs.org/openmrs/ws/rest/v1/session', {
  headers: {
    Authorization: 'Basic ' + btoa(`${user.username}:${user.password}`),
  },
});
expect(response.status).toEqual(200)
const responseBody = await response.json()
expect(responseBody.authenticated).toBe(true)
})}
)
