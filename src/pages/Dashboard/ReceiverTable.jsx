import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import DataTable from "react-data-table-component";
import { FaArrowRotateRight } from "react-icons/fa6";
import RecentReceiver from "../../assets/images/icons1.png";
import { recipientList } from "../../services/Api";

const handleSendAgain = (row) => { };

const customStyles = {
  headCells: {
    style: {
      backgroundColor: "#CFDA2F",
      fontWeight: "bold",
      fontSize: "14px",
      color: "#434800",
    },
  },
  rows: {
    style: {
      minHeight: "55px",
    },
  },
  cells: {
    style: {
      fontSize: "14px",
      paddingLeft: "16px",
      paddingRight: "16px",
    },
  },
};

const ReceiverTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await recipientList();
      if (response.code === "200") {
        if (response.data.length >= 5) setData(response.data.slice(0, 5));
        else setData(response.data);
      }
    })();
  }, []);

  const columns = [
    {
      name: "S. No.",
      selector: (row, index) => index + 1,
      width: "80px",
      center: true,
    },
    {
      name: "Destination",
      selector: (row) => row.country,
      cell: (row) => <strong>{row.country}</strong>,
    },
    {
      name: "Name",
      selector: (row) => {
        `${row.first_name} ${row.last_name}`;
      },
      cell: (row) => <strong>{`${row.first_name} ${row.last_name}`}</strong>,
    },
  ];

  return (
    <Card className="receiver-card customHeight">
      <Card.Body>
        <div className="table-header">
          <span className="icon">
            <img src={RecentReceiver} alt="img" />
          </span>
          <Card.Title className="mb-0">Recent Receivers</Card.Title>
        </div>
        <DataTable
          columns={columns}
          data={data}
          customStyles={customStyles}
          noHeader
          striped
          highlightOnHover
        />
      </Card.Body>
    </Card>
  );
};

export default ReceiverTable;
