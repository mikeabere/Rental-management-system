import React from "react";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import { Logo, FormRow, SubmitBtn } from "../components";
import { Form, Link } from "react-router-dom";
import { toast } from "react-toastify";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    await customFetch.post("/auth/register", data);
    toast.success("Registration successful");
    return redirect("login");
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};


function Register() {
  return (
    <Wrapper>
      <Form method="post" className="form">
        <Logo />
        <h4>Register</h4>
        <FormRow type="text" name="name" />
        <FormRow type="email" name="email" />

        <FormRow type="password" name="password" />
        <FormRow type="text" name="lastName" labelText="last name" />
        <FormRow type="text" name="location" />
        <FormRow type="text" name="role" />
        <FormRow type="number" name="phone" />

        <SubmitBtn />
        <p>
          Already a member?
          <Link to="/login" className="member-btn">
            Login
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
}

export default Register;
