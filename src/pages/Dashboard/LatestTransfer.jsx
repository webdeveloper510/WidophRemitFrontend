import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import DataTable from "react-data-table-component";
import { FaArrowRotateRight } from "react-icons/fa6";
import RecentReceiver from "../../assets/images/icons1.png";
import { BsThreeDots } from "react-icons/bs";
import Dropdown from "react-bootstrap/Dropdown";
import { pendingTransactions, transactionHistory } from "../../services/Api";

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
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  const handleViewDetails = (row) => {
    navigate(`/transfer-details/${row.transaction_id}`);
  };

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
      selector: (row) => row.recipient_name,
      sortable: true,
      cell: (row) => <strong>{row.recipient_name}</strong>,
    },
    {
      name: "Amount Paid",
      selector: (row) => row.amount,
      sortable: true,
      cell: (row) => <strong>{row.amount}</strong>,
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
              <Dropdown.Item onClick={() => handleViewDetails(row)}>
                View
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

  useEffect(() => {
    (async () => {
      let data = [];
      const response = await transactionHistory();
      const pend_res = await pendingTransactions();

      if (response.code === "200") {
        data = response.data.data;
      }

      if (pend_res.code === "200") {
        data = [...data, ...pend_res.data];
      }

      data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      setList(data.length >= 5 ? data.slice(0, 5) : data);
    })();
  }, []);

  console.log(list);
  

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
          data={list}
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
