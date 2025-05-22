import React, { useState } from "react";
import AnimatedPage from "../../components/AnimatedPage";
import DataTable from "react-data-table-component";
import { BsThreeDots } from "react-icons/bs";
import Dropdown from "react-bootstrap/Dropdown";

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
    name: "Receivers Name",
    selector: (row) => row.name,
    sortable: true,
    cell: (row) => <strong>{row.name}</strong>,
  },
  {
    name: "Sender Email",
    selector: (row) => row.senderemail,
    sortable: true,
    cell: (row) => <strong>{row.senderemail}</strong>,
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
            {/* <Dropdown.Item href="transfer-details">View</Dropdown.Item> */}
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

const data = [
  {
    id: 1,
    name: "Alice Johnson",
    senderemail: "peterwillson@gmail.com",
  },
  {
    id: 2,
    name: "Britney Adams",
    senderemail: "ammar@untitledui.com",
  },
  {
    id: 3,
    name: "William Spears",
    senderemail: "ammar@untitledui.com",
  },
  {
    id: 4,
    name: "Whitney Blue",
    senderemail: "ammar@untitledui.com",
  },
  {
    id: 5,
    name: "William Spears",
    senderemail: "sushma@untitledui.com",
  },
  {
    id: 6,
    name: "Alice Johnson",
    senderemail: "ammar@untitledui.com",
  },
  {
    id: 7,
    name: "Whitney Blue",
    senderemail: "olly@untitledui.com",
  },
  {
    id: 8,
    name: "William Spears",
    senderemail: "mathilde@untitledui.com",
  },
  {
    id: 9,
    name: "Whitney Blue",
    senderemail: "olly@untitledui.com",
  },
  {
    id: 10,
    name: "Alice Johnson",
    senderemail: "mathilde@untitledui.com",
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

const Receivers = () => {
  const [filterText, setFilterText] = useState("");

  const filteredData = data.filter((item) =>
    (item.name + item.senderemail)
      .toLowerCase()
      .includes(filterText.toLowerCase())
  );

  const displayData = filteredData;

  const subHeaderComponent = (
    <div className="d-flex gap-3 mb-3 align-items-center">
      <input
        type="text"
        className="form-control form-control-md filter-input"
        placeholder="Search . . . "
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
    </div>
  );

  return (
    <>
      <AnimatedPage>
        <div className="page-title">
          <div className="d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <h1>Receivers List</h1>
            </div>
            {subHeaderComponent}
            {/* <a href="add-receiver">
          <button
            type="button"
            class="float-end download-button btn btn-success"
          >
            <img src={AddReceiver} alt="img" /> Add Receiver
          </button>
        </a> */}
          </div>
        </div>

        <div className="row mt-4">
          <DataTable
            columns={columns}
            data={displayData}
            customStyles={customStyles}
            noHeader
            striped
            highlightOnHover
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[5, 10, 15, 20]}
          />
        </div>
      </AnimatedPage>
    </>
  );
};

export default Receivers;
