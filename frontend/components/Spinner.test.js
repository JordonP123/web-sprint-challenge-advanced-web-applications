import React from 'react'
import { render, userEvent, fireEvent, rerender, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import '@testing-library/jest-dom/extend-expect'
import { setupServer, getHandlers } from '../../backend/mock-server'
import Spinner from './Spinner'
import App from './App'
import Articles from './Articles'

const renderApp = ui => {
  window.localStorage.clear()
  window.history.pushState({}, 'Test page', '/')
  return render(ui)
}
let server
beforeAll(() => {
  server = setupServer(...getHandlers())
  server.listen()
})
afterAll(() => {
  server.close()
})
beforeEach(() => {
  renderApp(<BrowserRouter><App /></BrowserRouter>)
})
afterEach(() => {
  server.resetHandlers(...getHandlers())
})

const loginFlow = async () => {
  fireEvent.change(usernameInput(), { target: { value: 'Foo' } })
  fireEvent.change(passwordInput(), { target: { value: '12345678' } })
  fireEvent.change(loginBtn())
}

// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
const usernameInput = () => screen.queryByPlaceholderText('Enter username')
const passwordInput = () => screen.queryByPlaceholderText('Enter password')
const loginBtn = () => screen.queryByText('Submit credentials')
const cancelBtn = () => screen.queryByTestId('cancelBtn')

test('sanity', () => {
  expect(true).toBe(true)
})

test(' Spinner renders with boolean prop "spinnerOn" ', () => {
  render (<Spinner on={true} />)
})

test('On submit of login process, spinner displays', async () => {
  render(<Spinner on={true} />)
  await loginFlow()
  expect(screen.getByText(/Please wait.../)).toBeInTheDocument()
})

test('Rendering spinner checks for spinner', async() => {
 render(<Spinner on={true}/>)
 expect(screen.getByText(/Please wait.../)).toBeInTheDocument()
})

test('I noticed this was not being tested so I will try, cancel edit button does not render automatically', async() => {
  await loginFlow()
  expect(cancelBtn()).not.toBeInTheDocument()
})
