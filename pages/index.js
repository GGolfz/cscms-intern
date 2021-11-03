import { Fragment, useEffect, useState } from "react";
const Home = () => {
  const data = [
    {
      id: 1,
      name: "Google",
      url: "https://www.google.com",
      position: ["Full Stack Developer", "ML Engineer"],
      close_date: null,
    },
  ];
  const [showData, setShowData] = useState([]);
  const [dialog, setDialog] = useState(false);
  useEffect(() => {
    setShowData(data);
  }, [data]);
  const renderData = () => {
    return showData.map((item) => {
      return (
        <tr key={item.id}>
          <td>{item.name}</td>
          <td>
            <ul>
              {item.position.map((e, index) => (
                <li key={index}>{e}</li>
              ))}
            </ul>
          </td>
          <td>
            <a href={item.url}>Link</a>
          </td>
          <td>{item.close_date ?? "unknown"}</td>
        </tr>
      );
    });
  };
  return (
    <Fragment>
      
      <div>Search and filter bar</div>
      
      <div>
        <table>
          <tr>
            <th>Company</th>
            <th>Position</th>
            <th>Link</th>
            <th>Close Date</th>
          </tr>
          {renderData()}
        </table>
      </div>
    </Fragment>
  );
};

export default Home;
