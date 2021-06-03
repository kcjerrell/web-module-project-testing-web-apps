import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

const getForm = (screen) => {
	const firstName = screen.queryByLabelText(/first name/i);
	const lastName = screen.queryByLabelText(/last name/i);
	const email = screen.queryByLabelText(/email/i);
	const message = screen.queryByLabelText(/message/i);
	const submit = screen.getByRole("button");

	return { firstName, lastName, email, message, submit };
}

test('renders without errors', () => {
	render(<ContactForm />);
});

test('renders the contact form header', () => {
	render(<ContactForm />);

	const header = screen.queryByText(/contact form/i);

	expect(header).toBeInTheDocument();
	expect(header).toBeTruthy();
	expect(header).toHaveTextContent(/contact form/i);
});

test('test helper function returns the correct elements', () => {
	render(<ContactForm />)
	const { firstName, lastName, email, message, submit } = getForm(screen);

	expect(firstName).not.toBeNull();
	expect(lastName).not.toBeNull();
	expect(email).not.toBeNull();
	expect(message).not.toBeNull();
	expect(submit).not.toBeNull();
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
	render(<ContactForm />);

	// const firstName = screen.queryByLabelText(/first name/i);
	const { firstName } = getForm(screen);
	await userEvent.type(firstName, "Al");

	const errorText = await screen.findByText(/error: firstName must have/i);

	expect(errorText).toBeInTheDocument();
	expect(errorText).toBeVisible();

	const allErrorText = await screen.findAllByText(/error:/i);
	expect(allErrorText.length).toEqual(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
	render(<ContactForm />);

	const { submit } = getForm(screen);
	userEvent.click(submit);

	const allErrorText = await screen.findAllByText(/error:/i);
	expect(allErrorText.length).toEqual(3);
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
	render(<ContactForm />);
	const { firstName, lastName, email, submit } = getForm(screen);

	await userEvent.type(firstName, "Warren");
	await userEvent.type(lastName, "Longmire");
	expect(email).toBeEmpty();

	userEvent.click(submit);

	const errorText = await screen.findByText(/error: email must be/i);

	expect(errorText).toBeInTheDocument();
	expect(errorText).toBeVisible();

	const allErrorText = await screen.findAllByText(/error:/i);
	expect(allErrorText.length).toEqual(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
	render(<ContactForm />);
	const { email } = getForm(screen);

	await userEvent.type(email, "doooooooo");

	const errorText = await screen.findByText(/error: email must be/i);

	expect(errorText).toBeInTheDocument();
	expect(errorText).toBeVisible();

	const allErrorText = await screen.findAllByText(/error:/i);
	expect(allErrorText.length).toEqual(1);
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
	render(<ContactForm />);
	const { lastName, submit } = getForm(screen);

	expect(lastName).toBeEmpty();
	userEvent.click(submit);

	const errorText = await screen.findByText(/error: lastname is a required field/i);

	expect(errorText).toBeInTheDocument();
	expect(errorText).toBeVisible();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
	render(<ContactForm />);
	const { firstName, lastName, email, message, submit } = getForm(screen);

	await userEvent.type(firstName, 'Kelly');
	await userEvent.type(lastName, 'Jerrell');
	await userEvent.type(email, 'email@gmail.com');
	expect(message).toBeEmpty();

	userEvent.click(submit);

	const firstNameSubmission = screen.queryByTestId("firstnameDisplay");
	expect(firstNameSubmission).toBeInTheDocument();
	expect(firstNameSubmission).toBeVisible();

	const lastNameSubmission = screen.queryByTestId("lastnameDisplay");
	expect(lastNameSubmission).toBeInTheDocument();
	expect(lastNameSubmission).toBeVisible();

	const emailSubmission = screen.queryByTestId("emailDisplay");
	expect(emailSubmission).toBeInTheDocument();
	expect(emailSubmission).toBeVisible();

	const messageSubmission = screen.queryByTestId("messageDisplay");
	expect(messageSubmission).not.toBeInTheDocument();
});

test('renders all fields text when all fields are submitted.', async () => {
	render(<ContactForm />);
	const { firstName, lastName, email, message, submit } = getForm(screen);

	await userEvent.type(firstName, 'Kelly');
	await userEvent.type(lastName, 'Jerrell');
	await userEvent.type(email, 'email@gmail.com');
	await userEvent.type(message, 'Holler');

	userEvent.click(submit);

	const firstNameSubmission = screen.queryByTestId("firstnameDisplay");
	expect(firstNameSubmission).toBeInTheDocument();
	expect(firstNameSubmission).toBeVisible();

	const lastNameSubmission = screen.queryByTestId("lastnameDisplay");
	expect(lastNameSubmission).toBeInTheDocument();
	expect(lastNameSubmission).toBeVisible();

	const emailSubmission = screen.queryByTestId("emailDisplay");
	expect(emailSubmission).toBeInTheDocument();
	expect(emailSubmission).toBeVisible();

	const messageSubmission = screen.queryByTestId("messageDisplay");
	expect(messageSubmission).toBeInTheDocument();
	expect(messageSubmission).toBeVisible();
});
