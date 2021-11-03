import { Fragment } from "react";

const Form = () => {
  return (
    <Fragment>
      <form>
        <label for="company">Company</label>
        <input type="text" name="company" placeholder="Company" /> <br />
        <label for="url">Internship URL</label>
        <input type="text" name="url" placeholder="URL" /> <br />
        <label for="position">Position (separate by comma)</label>
        <input type="text" name="position" placeholder="Company" /> <br />
        <label for="close_date">Close Date (Leave blank if unknown)</label>
        <input type="date" name="close_date" /> <br />
        <button type="submit">Submit</button>
      </form>
    </Fragment>
  );
};
export default Form;
