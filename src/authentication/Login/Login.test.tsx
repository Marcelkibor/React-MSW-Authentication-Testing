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

it("Should render the form inputs and submit button",()=>{
  expect(userNameField).toBeTruthy()
  expect(passwordField).toBeTruthy()
  expect(loginButton).toBeTruthy()
});

it("Should change form values when a user types a new entry",()=>{
  fireEvent.change(userNameField,{target:{value:"MaryJane"}})
  fireEvent.change(passwordField,{target:{value:"MJ123"}})
  expect((userNameField as HTMLInputElement).value).toBe("MaryJane");
  expect((passwordField as HTMLInputElement).value).toBe("MJ123");
});

it("Should display an error message when any form input is empty on submit", async()=>{
    await act(async ()=>{
      const errorMessage1 = await LoginRequest("","")
      const errorMessage2 = await LoginRequest("Admin","")
      const errorMessage3 = await LoginRequest("","Admin123")
      expect(errorMessage1).toBe("Please fill in the form")
      expect(errorMessage2).toBe("Please fill in the form")
      expect(errorMessage3).toBe("Please fill in the form")
    })
});

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
    Authorization: 'Basic ' + btoa('Admin:Admin123'),
  },
});
expect(response.status).toEqual(200)
const responseBody = await response.json()
expect(responseBody.authenticated).toBe(true)
})
})
