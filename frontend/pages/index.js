import {
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Fragment, useEffect, useRef, useState } from "react";
import FormDialog from "../components/Dialog";
const Home = () => {
  const data = [
    {
      id: 1,
      company_name: "Google",
      url: "https://www.google.com",
      positions: ["Full Stack Developer", "ML Engineer"],
      close_date: null,
    },
  ];
  const [showData, setShowData] = useState([]);
  const [dialog, setDialog] = useState(false);
  useEffect(() => {
    setShowData(data);
  }, []);
  const handleClose = () => {
    setDialog(false);
  };
  const renderData = () => {
    return showData.map((item) => {
      return (
        <TableRow key={item.id}>
          <TableCell>{item.company_name}</TableCell>
          <TableCell>
            <ul>
              {item.positions.map((e, index) => (
                <li key={index}>{e}</li>
              ))}
            </ul>
          </TableCell>
          <TableCell>
            <a href={item.url}>Link</a>
          </TableCell>
          <TableCell>{item.close_date ?? "unknown"}</TableCell>
        </TableRow>
      );
    });
  };
  return (
    <Fragment>
      <Container>
        <FormDialog dialog={dialog} handleClose={handleClose} />

        <div>Search and filter bar</div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>Internship List</h1>
          <Button
            variant="outlined"
            onClick={() => setDialog(true)}
            color="primary"
          >
            Add
          </Button>
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Link</TableCell>
              <TableCell>Close Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderData()}</TableBody>
        </Table>
      </Container>
    </Fragment>
  );
};

export default Home;
