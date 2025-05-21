import React, { useState } from "react";
import AnimatedPage from "../../components/AnimatedPage";
import Card from "react-bootstrap/Card";
import DataTable from "react-data-table-component";
import { BsThreeDots } from "react-icons/bs";
import Dropdown from "react-bootstrap/Dropdown";
import TransferList from "../../assets/images/transfer-list-icon.png";

const data = [
  {
    id: 1,
    transferid: "ADPFT20250",
    name: "William Spears",
    amount: "180.00 AUD",
    date: "26-March-2025",
    reason: "Lorem Ipsum",
    status: "pending",
  },
  {
    id: 2,
    transferid: "ADPFT20250",
    name: "William Spears",
    amount: "180.00 AUD",
    date: "26-March-2025",
    reason: "Lorem Ipsum",
    status: "Complete",
  },
  {
    id: 3,
    transferid: "ADPFT20250",
    name: "William Spears",
    amount: "180.00 AUD",
    date: "26-March-2025",
    reason: "Lorem Ipsum",
    status: "cancelled",
  },
  {
    id: 4,
    transferid: "ADPFT20250",
    name: "William Spears",
    amount: "180.00 AUD",
    date: "26-March-2025",
    reason: "Lorem Ipsum",
    status: "Incomplete",
  },
  {
    id: 5,
    transferid: "ADPFT20250",
    name: "Kathy",
    amount: "180.00 AUD",
    date: "26-March-2025",
    reason: "Lorem Ipsum",
    status: "Incomplete",
  },
  {
    id: 6,
    transferid: "ADPFT20250",
    name: "William Spears",
    amount: "180.00 AUD",
    date: "26-March-2025",
    reason: "Lorem Ipsum",
    status: "Complete",
  },
  {
    id: 7,
    transferid: "ADPFT20250",
    name: "Kat Spears",
    amount: "180.00 AUD",
    date: "26-March-2025",
    reason: "Lorem Ipsum",
    status: "Incomplete",
  },
  {
    id: 8,
    transferid: "ADPFT20250",
    name: "John Spears",
    amount: "180.00 AUD",
    date: "26-March-2025",
    reason: "Lorem Ipsum",
    status: "pending",
  },
  {
    id: 9,
    transferid: "ADPFT20250",
    name: "William Spears",
    amount: "180.00 AUD",
    date: "26-March-2025",
    reason: "Lorem Ipsum",
    status: "cancelled",
  },
  {
    id: 10,
    transferid: "ADPFT20250",
    name: "Kat Spears",
    amount: "180.00 AUD",
    date: "26-March-2025",
    reason: "Lorem Ipsum",
    status: "Complete",
  },
  {
    id: 11,
    transferid: "ADPFT20250",
    name: "Kathy",
    amount: "180.00 AUD",
    date: "26-March-2025",
    reason: "Lorem Ipsum",
    status: "Complete",
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
    name: "Transfer ID",
    selector: (row) => row.transferid,
    sortable: true,
    cell: (row) => <strong>{row.transferid}</strong>,
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
    name: "Date",
    selector: (row) => row.date,
    sortable: true,
    cell: (row) => <strong>{row.date}</strong>,
  },

  {
    name: "Transfer Reason",
    selector: (row) => row.reason,
    sortable: true,
    cell: (row) => <strong>{row.reason}</strong>,
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
            <Dropdown.Item href="#">Download Receipt</Dropdown.Item>
            <Dropdown.Item href="transfer-details">View Details</Dropdown.Item>
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

const TransfersList = () => {
  const [filterText, setFilterText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const filteredData = data.filter((item) => {
    const matchesText = (item.name + item.status + item.date + item.amount)
      .toLowerCase()
      .includes(filterText.toLowerCase());

    const matchesStatus = selectedStatus
      ? item.status.toLowerCase() === selectedStatus.toLowerCase()
      : true;

    return matchesText && matchesStatus;
  });

  const displayData = filteredData;

  const statusOptions = ["", "Cancelled", "Pending", "Incomplete", "Complete"];

  const subHeaderComponent = (
    <div className="d-flex gap-3 mb-3 align-items-center">
      <input
        type="text"
        className="form-control form-control-md filter-input"
        placeholder="Search . . . "
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
      <select
        className="form-select form-select-md filter-select"
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
      >
        {statusOptions.map((status, index) => (
          <option key={index} value={status}>
            {status || "All Transfers"}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <>
      <AnimatedPage>
        <div className="page-title">
          <div className="d-flex gap-3 mb-3 align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <img src={TransferList} alt="img" />
              <h1>Transfers list</h1>
            </div>
            {subHeaderComponent}
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-12">
            <DataTable
              columns={columns}
              data={displayData}
              customStyles={customStyles}
              noHeader
              striped
              highlightOnHover
              pagination
              paginationPerPage={15}
              paginationRowsPerPageOptions={[5, 10, 15, 20]}
            />
          </div>
        </div>
      </AnimatedPage>
    </>
  );
};

export default TransfersList;
