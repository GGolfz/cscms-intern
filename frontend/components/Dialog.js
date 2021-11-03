import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { Fragment, useEffect, useState } from "react";

const Form = ({ dialog, handleClose }) => {
  const [companyName, setCompanyName] = useState("");
  const [positions, setPositions] = useState([]);
  const [position, setPosition] = useState("");
  const [url, setUrl] = useState("");
  const [closeDate, setCloseDate] = useState(null);

  const handleAdd = () => {
    if (companyName.length > 0 && url.length > 0 && positions.length > 0) {
      // TODO: call API
      const data = {
        companyName,
        positions,
        url,
        closeDate,
      };
      console.log(data);

      clearData();
      handleClose();
    }
  };
  const clearData = () => {
    setCompanyName("");
    setPositions([]);
    setPosition("");
    setUrl("");
    setCloseDate(null);
  };
  const handleKeyDown = (key) => {
    if (key == "Enter") {
      if (positions.indexOf(position) == -1 && position.length > 0) {
        const temp = [...positions];
        temp.push(position);
        setPositions(temp);
      }
      setPosition("");
    } else if (key == "Backspace") {
      if (position.length == 0) {
        const temp = [...positions];
        temp.pop();
        setPositions(temp);
      }
    }
  };
  return (
    <Fragment>
      <Dialog open={dialog} onClose={handleClose}>
        <DialogTitle>Add Internship Information</DialogTitle>
        <DialogContent>
          <span>Please add valid and reliable data for your own benefit.</span>
          <Box>
            {positions.toString()}
            <TextField
              fullWidth
              InputLabelProps={{ shrink: true }}
              label="Company Name"
              margin="dense"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            ></TextField>
            <TextField
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: positions.map((item) => (
                  <Chip
                    color="primary"
                    key={item}
                    tabIndex={-1}
                    label={item}
                    onDelete={() => {
                      setPositions(positions.filter((i) => i !== item));
                    }}
                  />
                )),
              }}
              label="Positions (Press enter for add)"
              margin="dense"
              required
              value={position}
              onKeyDown={(e) => handleKeyDown(e.key)}
              onChange={(e) => setPosition(e.target.value)}
            ></TextField>
            <TextField
              fullWidth
              InputLabelProps={{ shrink: true }}
              label="URL"
              margin="dense"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            ></TextField>
            <TextField
              fullWidth
              InputLabelProps={{ shrink: true }}
              label="Close Date (leave if unknown)"
              type="date"
              margin="dense"
              value={closeDate}
              onChange={(e) => setCloseDate(e.target.value)}
            ></TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleAdd}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
export default Form;
