import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import DataTable from "react-data-table-component";
import { FaArrowRotateRight } from "react-icons/fa6";
import RecentReceiver from "../../assets/images/icons1.png";
import { BsThreeDots } from "react-icons/bs";
import Dropdown from "react-bootstrap/Dropdown";

const handleSendAgain = (row) => {
  console.log("Send Again clicked for:", row.name);
};

const data = [
  {
    id: 1,
    date: "24-March-2025",
    amount: "104.00 AUD",
    name: "Alice Johnson",
    status: "pending",
  },
  {
    id: 2,
    date: "24-March-2025",
    amount: "104.00 AUD",
    name: "Britney Adams",
    status: "processing",
  },
  {
    id: 3,
    date: "24-March-2025",
    amount: "104.00 AUD",
    name: "William Spears",
    status: "review",
  },
  {
    id: 4,
    date: "25-March-2025",
    amount: "250.00 AUD",
    name: "Whitney Blue",
    status: "processing",
  },
  {
    id: 5,
    date: "26-March-2025",
    amount: "180.00 AUD",
    name: "William Spears",
    status: "pending",
  },
  {
    id: 6,
    date: "26-March-2025",
    amount: "180.00 AUD",
    name: "William Spears",
    status: "pending",
  },
  {
    id: 7,
    date: "26-March-2025",
    amount: "180.00 AUD",
    name: "William Spears",
    status: "pending",
  },
  {
    id: 8,
    date: "26-March-2025",
    amount: "180.00 AUD",
    name: "William Spears",
    status: "pending",
  },
  {
    id: 9,
    date: "26-March-2025",
    amount: "180.00 AUD",
    name: "William Spears",
    status: "pending",
  },
  {
    id: 10,
    date: "26-March-2025",
    amount: "180.00 AUD",
    name: "William Spears",
    status: "pending",
  },
  {
    id: 11,
    date: "26-March-2025",
    amount: "180.00 AUD",
    name: "William Spears",
    status: "pending",
  },
];

const columns = [
  {
    name: "S. No.",
    selector: (row, index) => index + 1,
    width: "80px",
    center: true,
  },
  {
    name: "Date",
    selector: (row) => row.date,
    sortable: true,
    cell: (row) => <strong>{row.date}</strong>,
  },
  {
    name: "Receiver",
    selector: (row) => row.name,
    sortable: true,
    cell: (row) => <strong>{row.name}</strong>,
  },
  {
    name: "Amount Paid",
    selector: (row) => row.amount,
    sortable: true,
    cell: (row) => <strong>{row.amount}</strong>,
  },
  {
    name: "Status",
    selector: (row) => row.status,
    sortable: true,
    cell: (row) => (
      <span className={`status-badge ${row.status.toLowerCase()}`}>
        {row.status}
      </span>
    ),
  },
  {
    name: "Action",
    cell: (row) => (
      <div className="send-again-btn" onClick={() => handleSendAgain(row)}>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            <BsThreeDots />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="#">Delete</Dropdown.Item>
            <Dropdown.Item href="#">Edit</Dropdown.Item>
            <Dropdown.Item href="transfer-details">View</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
    center: true,
    width: "120px",
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

const LatestTransfer = () => {
  const [filterText, setFilterText] = useState("");

  const filteredData = data.filter((item) =>
    (item.name + item.status + item.date + item.amount)
      .toLowerCase()
      .includes(filterText.toLowerCase())
  );

  const displayData = filteredData;

  const subHeaderComponent = (
    <input
      type="text"
      className="form-control form-control-sm w-25"
      placeholder="Filter transfers..."
      value={filterText}
      onChange={(e) => setFilterText(e.target.value)}
    />
  );

  return (
    <Card className="receiver-card">
      <Card.Body>
        <div className="table-header mb-3 d-flex align-items-center">
          <span className="icon me-2">
            <img src={RecentReceiver} alt="img" />
          </span>
          <Card.Title className="mb-0">Latest Transfers</Card.Title>
        </div>
        <DataTable
          columns={columns}
          data={displayData}
          customStyles={customStyles}
          noHeader
          striped
          highlightOnHover
          pagination
          paginationPerPage={5}
          paginationRowsPerPageOptions={[5, 10, 15, 20]}
        />
      </Card.Body>
    </Card>
  );
};

export default LatestTransfer;
