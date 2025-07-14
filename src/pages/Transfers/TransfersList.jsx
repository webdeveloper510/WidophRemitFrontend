import React, { useEffect, useState } from "react";
import AnimatedPage from "../../components/AnimatedPage";
import Card from "react-bootstrap/Card";
import DataTable from "react-data-table-component";
import { BsThreeDots } from "react-icons/bs";
import Dropdown from "react-bootstrap/Dropdown";
import TransferList from "../../assets/images/transfer-list-icon.png";
import { pendingTransactions, transactionHistory } from "../../services/Api";
import { Link } from "react-router-dom";

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
  const [list, setList] = useState([]);

  const fetchList = async () => {
    let data = [];
    const response = await transactionHistory();
    const pend_res = await pendingTransactions();

    if (response.code === "200" && response.data?.data) {
      data = response.data.data;
    }

    if (pend_res.code === "200" && pend_res.data) {
      setList([...data, ...pend_res.data]);
    } else {
      setList(data);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const filteredData = list.filter((item) => {
    const matchesText = (
      item.recipient_name +
      item.payment_status +
      item.date +
      item.amount
    )
      .toLowerCase()
      .includes(filterText.toLowerCase());

    const matchesStatus = selectedStatus
      ? item.payment_status.toLowerCase().includes(selectedStatus.toLowerCase())
      : true;

    return matchesText && matchesStatus;
  });

  const displayData = filteredData;

  const statusOptions = ["", "Cancelled", "Pending", "Incomplete", "Complete"];

  const subHeaderComponent = (
    <div className="d-flex gap-3 mb-3 align-items-center">
      {/* <input
        type="text"
        className="form-control form-control-md filter-input"
        placeholder="Search . . . "
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      /> */}
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

  const columns = [
    {
      name: "S. No.",
      selector: (row, index) => index + 1,
      width: "80px",
      center: true,
    },
    {
      name: "Transfer ID",
      selector: (row) => row.transaction_id,
      sortable: true,
      cell: (row) => <strong>{row.transaction_id}</strong>,
    },
    {
      name: "Receiver",
      selector: (row) => row.recipient_name,
      sortable: true,
      cell: (row) => <strong>{row.recipient_name}</strong>,
    },
    {
      name: "Amount Paid",
      selector: (row) => row.amount,
      sortable: true,
      cell: (row) => <strong>{row.send_currency + " " + row.amount}</strong>,
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
      selector: (row) => row.payment_status,
      sortable: true,
      cell: (row) => (
        <span className={`status-badge ${row.payment_status.toLowerCase()}`}>
          {row.payment_status}
        </span>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="send-again-btn">
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              <BsThreeDots />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                href={`${import.meta.env.VITE_APP_API_URI}/payment/receipt/${
                  row.id
                }`}
              >
                Download Receipt
              </Dropdown.Item>
              <Dropdown.Item
                as={Link}
                to={`/transfer-details/${row.transaction_id}`}
              >
                View Details
              </Dropdown.Item>
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

  return (
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
        <DataTable
          className="TranferList"
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
    </AnimatedPage>
  );
};

export default TransfersList;
