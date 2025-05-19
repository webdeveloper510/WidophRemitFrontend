import React from "react";
import Card from "react-bootstrap/Card";
import DataTable from "react-data-table-component";
import { FaArrowRotateRight } from "react-icons/fa6";
import RecentReceiver from "../../assets/images/icons1.png";

const handleSendAgain = (row) => {
  console.log("Send Again clicked for:", row.name);
};

const columns = [
  {
    name: "S. No.",
    selector: (row, index) => index + 1,
    width: "80px",
    center: true,
  },
  {
    name: "Destination",
    selector: (row) => row.destination,
    sortable: true,
    cell: (row) => <strong>{row.destination}</strong>,
  },
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
    cell: (row) => <strong>{row.name}</strong>,
  },
  {
    name: "Send Again",
    cell: (row) => (
      <div className="send-again-btn" onClick={() => handleSendAgain(row)}>
        <FaArrowRotateRight />
      </div>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
    center: true,
    width: "120px",
  },
];

const data = [
  {
    id: 1,
    destination: "Australia",
    name: "Alice Johnson",
  },
  {
    id: 2,
    destination: "United States Of America",
    name: "Britney Adams",
  },
  {
    id: 3,
    destination: "India",
    name: "William Spears",
  },
  {
    id: 4,
    destination: "United Kingdom",
    name: "Whitney Blue",
  },
  {
    id: 5,
    destination: "New Zealand",
    name: "William Spears",
  },
];

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
  return (
    <Card className="receiver-card">
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
