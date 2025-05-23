import AnimatedPage from "../../components/AnimatedPage";
import Back from "../../assets/images/back.png";
import Button from "react-bootstrap/Button";
import { Row, Col } from "react-bootstrap";
import AddReceiver from "../../assets/images/add-receiver.png";
import Card from "react-bootstrap/Card";
import DataTable from "react-data-table-component";

import { MdOutlineKeyboardArrowRight } from "react-icons/md";

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
    name: "Action",
    cell: (row) => (
      <div className="send-again-btn" onClick={() => handleSendAgain(row)}>
        <MdOutlineKeyboardArrowRight />
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
  },
  {
    id: 2,
    name: "Britney Adams",
  },
  {
    id: 3,
    name: "William Spears",
  },
  {
    id: 4,
    name: "Whitney Blue",
  },
  {
    id: 5,
    name: "William Spears",
  },
  {
    id: 6,
    name: "Alice Johnson",
  },
  {
    id: 7,
    name: "Whitney Blue",
  },
  {
    id: 8,
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

const ReceiverList = () => {
  return (
    <AnimatedPage>
      <div className="page-title">
        <div className="d-flex justify-content-between">
          <div className="d-flex align-items-center">
            <a href="send-money">
              <img src={Back} />
            </a>
            <h1>Select a Receiver to Send Money</h1>
          </div>
          <a href="receiver-detail">
            <button
              type="button"
              class="float-end download-button btn btn-success"
            >
              <img src={AddReceiver} alt="img" /> Add Receiver
            </button>
          </a>
        </div>
      </div>

      <div className="row mt-4">
        <DataTable
          columns={columns}
          data={data}
          customStyles={customStyles}
          noHeader
          striped
          highlightOnHover
        />
      </div>

      <Row className="mt-4">
        <Col className="float-end">
          <a href="review-transfer">
            <Button variant="primary" className="float-end submit-btn">
              Continue
            </Button>
          </a>
        </Col>
      </Row>
    </AnimatedPage>
  );
};

export default ReceiverList;
