import AnimatedPage from "../../components/AnimatedPage";
import Back from "../../assets/images/back.png";
import Button from "react-bootstrap/Button";
import { Row, Col, Spinner } from "react-bootstrap";
import AddReceiver from "../../assets/images/add-receiver.png";
import Card from "react-bootstrap/Card";
import DataTable from "react-data-table-component";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useEffect, useState } from "react";
import { recipientList } from "../../services/Api";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
const ReceiverList = () => {
  const location = useLocation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleSendAgain = (row) => {
    sessionStorage.setItem("selected_receiver", JSON.stringify(row));
    navigate("/review-transfer", {
      state: {
        from: "receivers-list"
      }
    });
  };

  useEffect(() => {
    if (!(location.state?.from === "send-money" || location.state?.from === "review-Transfer" || location.state?.from === "receiver-add")) {
      navigate("/send-money")
    }
  }, [location])

  const columns = [
    {
      name: "S. No.",
      selector: (row, index) => index + 1,
      width: "80px",
      center: true,
    },
    {
      name: "Receiver Name",
      selector: (row) => row.account_name,
      // No need for cell override; row click will still work
    },
    {
      name: "Receiver Mobile",
      selector: (row) => row.mobile,
    },
    {
      name: "Action",
      cell: (row) => (
        <div
          className="send-again-btn d-flex align-items-center gap-1"
          onClick={(e) => {
            e.stopPropagation(); // prevent row click and button click from both firing
            handleSendAgain(row);
          }}
          style={{ cursor: "pointer", fontWeight: "bold" }}
        >
          <MdOutlineKeyboardArrowRight size={20} />
        </div>
      ),
      allowOverflow: true,
      button: true,
      center: true,
      width: "180px",
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
        cursor: "pointer",
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

  useEffect(() => {
    const fetchRecipients = async () => {
      setLoading(true);
      const res = await recipientList({});

      if (res?.code === "200") {
        if (Array.isArray(res.data)) {
          setData(res.data);
        } else {
          setData([]);
        }
      } else if (
        res?.code === "400" &&
        res?.message === "Recipients not found"
      ) {
        setData([]);
      } else {
        toast.error("Failed to fetch receiver list", {
          autoClose: 3000,
          position: "bottom-right",
        });
      }

      setLoading(false);
    };

    fetchRecipients();
  }, []);

  return (
    <AnimatedPage>
      <div className="page-title">
        <div className="d-flex justify-content-between">
          <div className="d-flex align-items-center">
            <Link to="/send-money" state={{ backFromReceivers: true }}>
              <img src={Back} alt="Back" />
            </Link>

            <h1>Select a Receiver to Send money</h1>
          </div>
          <Button
            type="button"
            className="float-end download-button btn btn-success"
            onClick={() => navigate("/receiver-add", {
              state: {
                from: "receivers-list"
              }
            })}
          >
            <img src={AddReceiver} alt="Add" /> Add Receiver
          </Button>
        </div>
      </div>

      <div className="row mt-4">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2"></p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={data}
            customStyles={customStyles}
            noHeader
            striped
            pointerOnHover
            onRowClicked={handleSendAgain}
            highlightOnHover
          />
        )}
      </div>
    </AnimatedPage>
  );
};

export default ReceiverList;
