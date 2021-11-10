import {
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import Head from "next/head";
import FormDialog from "../components/Dialog";

const Home = ({ searchString }) => {
  const [data, setData] = useState([]);
  const [showData, setShowData] = useState([]);
  const [search, setSearch] = useState(searchString);
  const [dialog, setDialog] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    if (search == "") {
      setShowData(data);
    } else {
      handleSearch(search);
    }
  }, [data]);
  const fetchData = () => {
    axios
      .get("/api/internship")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleSearch = (search) => {
    const searchData = data.filter(
      (item) =>
        item.company_name.toLowerCase().includes(search.toLowerCase()) ||
        item.positions.filter((pos) =>
          pos.name.toLowerCase().includes(search.toLowerCase())
        ).length > 0
    );
    setShowData(searchData);
  };
  const handleClose = ({ fetched = false }) => {
    setDialog(false);
    if (fetched) {
      fetchData();
    }
  };
  const renderData = () => {
    return showData.length == 0 ? (
      <Fragment>
        <TableRow>
          <TableCell colSpan={4} align="center">
            No Data Found
          </TableCell>
        </TableRow>
      </Fragment>
    ) : (
      showData.map((item) => {
        return (
          <TableRow key={item.id}>
            <TableCell>{item.company_name}</TableCell>
            <TableCell>
              <ul>
                {item.positions.map((e) => (
                  <li key={e.id}>{e.name}</li>
                ))}
              </ul>
            </TableCell>
            <TableCell>
              <a href={item.url} target="_blank" rel="noreferrer noopener">Link</a>
            </TableCell>
            <TableCell>
              {item.close_date != null
                ? item.close_date.split("T")[0]
                : "unknown"}
            </TableCell>
          </TableRow>
        );
      })
    );
  };
  return (
    <Fragment>
      <Head>
        <title>CSCMS Internship Collection</title>
      </Head>
      <Container>
        <FormDialog dialog={dialog} handleClose={handleClose} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "2rem 0",
          }}
        >
          <TextField
            id="input-with-icon-textfield"
            placeholder="Search (Company, Position)"
            fullWidth
            InputProps={{
              startAdornment: (
                <svg
                  focusable="false"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  data-testid="SearchIcon"
                  style={{ width: "36px", height: "36px", margin: ".5rem" }}
                >
                  <path
                    d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                    fill="#3f51b5"
                  ></path>
                </svg>
              ),
            }}
            variant="standard"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key == "Enter") handleSearch(search);
            }}
          />
          <Button
            style={{ margin: "1rem 0 1rem 1rem" }}
            variant="outlined"
            onClick={() => handleSearch(search)}
            color="primary"
          >
            Search
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "2rem 0",
          }}
        >
          <Typography variant="h4" component="h1">
            Internship List
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setDialog(true)}
            color="primary"
          >
            Add
          </Button>
        </div>
        <div style={{ height: "65vh", overflow: "auto", marginTop: "65px" }}>
          <Table>
            <TableHead
              style={{
                position: "sticky",
                top: "0px",
                zIndex: "1",
                background: "white",
              }}
            >
              <TableRow>
                <TableCell style={{ width: "25%" }}>Company</TableCell>
                <TableCell style={{ width: "45%" }}>Position</TableCell>
                <TableCell style={{ width: "15%" }}>Link</TableCell>
                <TableCell style={{ width: "15%" }}>Close Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderData()}</TableBody>
          </Table>
        </div>
      </Container>
    </Fragment>
  );
};

Home.getInitialProps = async (ctx) => {
  const query = ctx.query;
  if (query.search) return { searchString: query.search };
  return { searchString: "" };
};

export default Home;
