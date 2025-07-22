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
import { toast } from "react-toastify";
import loaderlogo from "../../assets/images/logo.png"

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
  const [deleteId, setDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [Loader, setLoader] = useState(true);


  useEffect(() => {
    fetchList();
    const timer = setTimeout(() => setLoader(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const fetchList = async () => {
    try {
      const response = await recipientList();
      if (response.code === "200") {
        setList(response.data);
      }
    } catch (err) {
      console.error("Error fetching list:", err);
    }
  };

  const handleClose = () => {
    setDeleteId(null);
  };

  const handleDelete = async () => {
    try {
      const response = await deleteRecipient(deleteId);
      if (response.code === "200") {
        toast.success("Receiver deleted successfully");
        fetchList();
        handleClose();
      } else {
        toast.error(response.message || "Failed to delete receiver");
      }
    } catch (error) {
      console.error("Deletion error:", error);
      toast.error("Unexpected error occurred");
    }
  };

  const filteredData = (list || []).filter((item) =>
    (item.first_name + item.middle_name + item.last_name + item.email)
      .toLowerCase()
      .includes(filterText.toLowerCase())
  );

  const columns = [
    {
      name: "S. No.",
      selector: (row, index) => (currentPage - 1) * perPage + index + 1,
      width: "80px",
      center: true,
    },
    {
      name: "Receiver Name",
      selector: (row) => `${row.first_name} ${row.middle_name} ${row.last_name}`,
      sortable: true,
      cell: (row) => (
        <strong>
          {row.first_name} {row.last_name}
        </strong>
      ),
    },
    {
      name: "Receiver Mobile",
      selector: (row) => row.mobile,
      sortable: true,
      cell: (row) => <strong>{row.mobile}</strong>,
    },
    {
      name: "Action",
      cell: (row) => (
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            <BsThreeDots />
          </Dropdown.Toggle>

          <Dropdown.Menu className="recievers-list">
            <Dropdown.Item as={Link} to={`/update-receiver/${row.id}`}>
              Update
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setDeleteId(row.id)}>
              Delete
            </Dropdown.Item>
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

  if (Loader) {
    return (
      <div className="loader-wrapper">
        <img src={loaderlogo} alt="Logo" className="loader-logo" />
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <AnimatedPage>
        <div className="page-title">
          <div className="d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <img src={RecentReceiver} alt="img" /> <h1>Receivers List</h1>
            </div>

            <div className="add_receipent_row">
              <Link to={"/add-receiver"}>
                <button type="button" className="download-button btn btn-success">
                  <img src={AddReceiver} alt="img" /> Add Receiver
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="row mt-4 receiverslist-table">
          <DataTable
            columns={columns}
            data={filteredData}
            customStyles={customStyles}
            noHeader
            striped
            highlightOnHover
            pagination
            paginationPerPage={perPage}
            paginationRowsPerPageOptions={[5, 10, 15, 20]}
            onChangePage={(page) => setCurrentPage(page)}
            onChangeRowsPerPage={(newPerPage, page) => {
              setPerPage(newPerPage);
              setCurrentPage(page);
            }}
          />
        </div>
      </AnimatedPage>

      <Modal show={!!deleteId} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Receiver</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <h5>Are you sure you want to delete this receiver?</h5>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Receivers;
