// import { useState } from "react";
// import {  redirect } from "react-router-dom";
// import Button from "react-bootstrap/Button";
// import Form from "react-bootstrap/Form";
// import Modal from "react-bootstrap/Modal";
// //import axios from "axios";
// import { toast } from "react-toastify";
// import customFetch from "../utils/customFetch";

// export const action = async ({ request }) => {
//   const formData = await request.formData();
//   const data = Object.fromEntries(formData);

//   try {
//     await customFetch.post("/tenants", data);
//     toast.success("Tenant added successfully");
//     return redirect("tenants");
//   } catch (error) {
//     toast.error(error?.response?.data?.msg);
//     return error;
//   }
// };

//function AddHouseModal() {
  //const [tenantName, setTenantName] = useState("");
  //const [age, setAge] = useState("");
 // const [jobStatus, setJobStatus] = useState("");
  //const [jobType, setJobType] = useState("");
  //const [jobLocation, setJobLocation] = useState("");


  // const [show, setShow] = useState(false);
  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  //async function handleAddData(e) {
   // e.preventDefault();
    //try {
      //const response = await axios.post("http://localhost:6000/api/v1/tenants", {
      //  tenantNamename: tenantName,
       // age: age,
        //jobStatus: jobStatus,
        //jobType: jobType,
        //jobLocation: houseRent,
      
     // });
     
     // console.log(response.data);
     // setShow(false);
    //} catch (error) {
   //   console.log(error.response);
    //}
  //}

  // return (
  //   <>
  //     <Button
  //       variant="primary"
  //       style={{ marginTop: "1rem", marginLeft: "1rem" }}
  //       onClick={handleShow}
  //     >
  //       Add Tenant
  //     </Button>

      // <Modal show={show} onHide={handleClose}>
      //   <Form
      //     className="form"
      //     method="POST"
      //     action="/api/v1/tenants"
          //onSubmit={handleAddData}
        // >
        //   <Modal.Header closeButton>
        //     <Modal.Title>Tenant Form</Modal.Title>
        //   </Modal.Header>
        //   <Modal.Body>
        //     <Form.Group className="mb-3" controlId="formBasicTenantname">
        //       <Form.Label>Name</Form.Label>
        //       <Form.Control
        //         type="text"
        //         placeholder="Tenant Name"
        //         name="tenantName"
                //onChange={(e) => setTenantName(e.target.value)}
//               />
//             </Form.Group>

//             <Form.Group className="mb-3" controlId="formBasicAge">
//               <Form.Label>Age</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Age"
//                 name="age"
//                 //onChange={(e) => setAge(e.target.value)}
//               />
//             </Form.Group>

//             <Form.Group className="mb-3" controlId="formBasicJobstatus">
//               <Form.Label>Job Status</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Job Status"
//                 name="jobStatus"
//                 //onChange={(e) => setJobStatus(e.target.value)}
//               />
//             </Form.Group>

//             <Form.Group className="mb-3" controlId="formBasicJobtype">
//               <Form.Label>Job Type</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Job Type"
//                 name="jobType"
//                 //onChange={(e) => setJobType(e.target.value)}
//               />
//             </Form.Group>

//             <Form.Group className="mb-3" controlId="formBasicJoblocation">
//               <Form.Label>Job Location</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Job Location"
//                 name="jobLocation"
//                 //onChange={(e) => setJobLocation(e.target.value)}
//               />
//             </Form.Group>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={handleClose}>
//               Close
//             </Button>
//             <Button variant="primary" type="submit" >
//               Submit
//             </Button>
//           </Modal.Footer>
//         </Form>
//       </Modal>
//     </>
//   );
// }

// export default AddHouseModal;

import React from "react";
import { FormRow, FormRowSelect, SubmitBtn } from "../components";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { useOutletContext } from "react-router-dom";
import { JOB_STATUS, JOB_TYPE } from "../../../utils/constants";
import { Form, redirect } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
//import { AddTenant } from ".";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.post("/tenants", data);
    toast.success("tenant added successfully");
    return redirect("tenants");
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

function AddTenant() {
  //const { user } = useOutletContext();

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">add tenant</h4>
        <div className="form-center">
          <FormRow type="text" name="name" />
          <FormRow type="text" name="age" />
          <FormRow
            type="text"
            labelText="job location"
            name="jobLocation"
           // defaultValue={user.location}
          />
          <FormRowSelect
            labelText="job status"
            name="jobStatus"
            defaultValue={JOB_STATUS.PENDING}
            list={Object.values(JOB_STATUS)}
          />
          <FormRowSelect
            name="jobType"
            labelText="job type"
            defaultValue={JOB_TYPE.FULL_TIME}
            list={Object.values(JOB_TYPE)}
          />
          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  );
}

export default AddTenant;
