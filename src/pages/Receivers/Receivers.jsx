import React, { useEffect, useState } from "react";
import AnimatedPage from "../../components/AnimatedPage";
import DataTable from "react-data-table-component";
import { BsThreeDots } from "react-icons/bs";
import Dropdown from "react-bootstrap/Dropdown";
import RecentReceiver from "../../assets/images/icons1.png";
import { deleteRecipient, recipientList } from "../../services/Api";
import { Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import AddReceiver from "../../assets/images/add-receiver.png";

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
  const [list, setList] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [show, setShow] = useState(false);

  const columns = [
    {
      name: "S. No.",
      selector: (row, index) => index + 1,
      width: "80px",
      center: true,
    },
    {
      name: "Receivers Name",
      selector: (row) => {
        `${row.first_name} ${row.middle_name} ${row.last_name}`;
      },
      sortable: true,
      cell: (row) => (
        <strong>{`${row.first_name}${row.last_name}`}</strong>
      ),
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
      sortable: true,
      cell: (row) => <strong>{row.mobile}</strong>,
    },
    {
      name: "Sender Email",
      selector: (row) => row.email,
      sortable: true,
      cell: (row) => <strong>{row.email}</strong>,
    },
    {
      name: "Action",
      cell: (row) => (
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            <BsThreeDots />
          </Dropdown.Toggle>

          <Dropdown.Menu className="recievers-list">
            <Dropdown.Item onClick={() => setShow(row.id)}>
              Delete
            </Dropdown.Item>
            {/* <Dropdown.Item href="transfer-details">View</Dropdown.Item> */}
          </Dropdown.Menu>
        </Dropdown>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      center: true,
      width: "120px",
    },
  ];

  const filteredData = Array.isArray(list)
    ? list.filter((item) =>
      (item.first_name + item.middle_name + item.last_name + item.email)
        .toLowerCase()
        .includes(filterText.toLowerCase())
    )
    : [];

  const displayData = filteredData;

  const subHeaderComponent = (
    <div className="d-flex gap-3 mb-3 align-items-center">
      {/* <input
        type="text"
        className="form-control form-control-md filter-input"
        placeholder="Search . . . "
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      /> */}
    </div>
  );

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    try {
      const response = await recipientList();

      if (response.code === "200") {
        setList(response.data);
        console.log(response.data);
      }
    } catch (err) {
      console.error("Error fetching list:", err);
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleDelete = async () => {
    const response = await deleteRecipient(show);
    if (response.code === "200") {
      fetchList();
    }
  };

  return (
    <>
      <AnimatedPage>
        <div className="page-title">
          <div className="d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <img src={RecentReceiver} alt="img" /> <h1>Receivers List</h1>
            </div>
            {/* {subHeaderComponent} */}
            <div className="add_receipent_row">
              <Link to={"/add-receiver"}>
                <button
                  type="button"
                  class="float-end download-button btn btn-success"
                >
                  <img src={AddReceiver} alt="img" /> Add Receiver
                </button>
              </Link>
            </div>
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
      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header></Modal.Header>
        <Modal.Body className="text-center">
          <h5>Are you sure you want to delete ?</h5>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleClose()}>
            Close
          </Button>
          <Button
            className="delete_recipient"
            variant="danger"
            onClick={() => {
              handleDelete();
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Receivers;
