import React from "react";
import { Form } from "react-bootstrap";
import "./InputTextarea.scss";

/*
	props:
		- placeholder str: text to be displayed when empty
    - onChange function([obj]): to be called when something is written in the input
    - value str: value to be written
*/

const InputTextarea = (props) => {
  let onChange = props.onChange;

  if (typeof onChange !== "function") onChange = () => {};

  return (
    <Form>
      <Form.Group>
        <Form.Control
          as="textarea"
          rows="2"
          onChange={props.onChange}
          placeholder={props.placeholder}
        />
      </Form.Group>
    </Form>
  );
};

export default InputTextarea;
