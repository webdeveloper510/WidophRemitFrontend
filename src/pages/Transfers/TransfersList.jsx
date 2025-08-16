import { useEffect, useMemo, useState } from "react";
import AnimatedPage from "../../components/AnimatedPage";
import DataTable from "react-data-table-component";
import { BsThreeDots } from "react-icons/bs";
import Dropdown from "react-bootstrap/Dropdown";
import TransferList from "../../assets/images/transfer-list-icon.png";
import { GetAllPaymentStatus, pendingTransactions, transactionHistory } from "../../services/Api";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../../components/Loader";

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
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [statusOptions, setstatusOptions] = useState([]);

  const fetchList = async () => {
    setLoading(true);
    try {
      let data = [];
      const response = await transactionHistory();
      const pend_res = await pendingTransactions();

      if (response.code === "200" && response.data?.data) {
        data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        data = response.data.data;
      }

      if (pend_res.code === "200" && pend_res.data) {
        setList([...data, ...pend_res.data]);
      } else {
        setList(data);
      }
    } catch (error) {
      console.error("Error fetching transaction list:", error);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        const response = await GetAllPaymentStatus();
        if (response.code === "200") {
          setstatusOptions(Object.values(response.data));
          setSelectedStatus("All Transfer");
        } else {
          console.error("Failed to fetch payment status:", response.message);
        }
      } catch (error) {
        console.error("Error fetching payment status:", error);
      }
    };

    fetchPaymentStatus();
    fetchList();
  }, []);

  const filteredData = useMemo(() => {
    let filtered = list.filter((item) => {
      const matchesText = (
        item.recipient_name +
        item.payment_status +
        item.date +
        item.amount
      )
        .toLowerCase()
        .includes(filterText.toLowerCase());

      if (selectedStatus === "All Transfer") {
        return matchesText;
      }

      const matchesStatus = selectedStatus
        ? item.payment_status.toLowerCase().includes(selectedStatus.toLowerCase())
        : true;

      return matchesText && matchesStatus;
    });

    if (selectedStatus === "All Transfer") {
      filtered = filtered.sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      );
    }

    return filtered;
  }, [list, filterText, selectedStatus]);

  const subHeaderComponent = (
    <div className="d-flex gap-3 mb-3 align-items-center">
      <select
        className="form-select form-select-md filter-select"
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
      >
        {statusOptions.map((status, index) => (
          <option key={index} value={status}>
            {status || "All Transfer"}
          </option>
        ))}
      </select>
    </div>
  );

  const handleDownloadReceipt = async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URI}/payment/receipt/${id}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;

      const disposition = response.headers["content-disposition"];
      let filename = `receipt-${id}.pdf`;
      if (disposition && disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/"/g, "").trim();
      }

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download receipt. Please try again.");
    }
  };

  const columns = [
    {
      name: "S. No.",
      cell: (row, index) => (currentPage - 1) * perPage + index + 1,
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
      cell: (row) => {
        const status = row.payment_status?.toLowerCase();

        const isDownloadAllowed = !["abandoned", "expired"].includes(status);

        return (
          <div className="send-again-btn">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                <BsThreeDots />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {isDownloadAllowed && (
                  <Dropdown.Item onClick={() => handleDownloadReceipt(row.id)}>
                    Download Receipt
                  </Dropdown.Item>
                )}
                <Dropdown.Item as={Link} to={`/transfer-details/${row.transaction_id}`}>
                  View Details
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      center: true,
      width: "120px",
    }



  ];

  if (loading) return <Loader />;

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
  );
};

export default TransfersList;
