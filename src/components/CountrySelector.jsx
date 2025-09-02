import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import "flag-icons/css/flag-icons.min.css";

export const CountrySelector = ({
  value,
  onChange,
  countries,
  onBlur,
  name = "countryCode",
  placeholder = "Select Country",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedCountry =
    countries.find((c) => `${c.dial_code}-${c.name}` === value) || countries[0];

  const handleSelect = (selectedValue) => {
    onChange({
      target: {
        name: name,
        value: selectedValue,
      },
    });
    setIsOpen(false);
  };

  return (
    <Dropdown show={isOpen} onToggle={setIsOpen} style={{ flex: "0 0 160px" }}>
      {/* Toggle */}
      <Dropdown.Toggle
        variant="outline-secondary"
        onBlur={onBlur}
        style={{
          width: "100%",
          height: "58px",
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "white",
          border: "1px solid #ced4da",
          fontSize: "16px",
          color: "#212529", // ensure text is visible
        }}
      >
        {selectedCountry ? (
          <span className="d-flex align-items-center">
            {/* Flag */}
            <span
              className={`fi fi-${selectedCountry.code.toLowerCase()} me-2`}
              style={{
                width: "20px",
                height: "15px",
                borderRadius: "2px",
                boxShadow: "0 0 1px rgba(0,0,0,0.3)",
              }}
            ></span>

            {/* Country code + dial code */}
            <span style={{ fontSize: "14px", fontWeight: 500 }}>
              {selectedCountry.dial_code} ({selectedCountry.code})
            </span>
          </span>
        ) : (
          placeholder
        )}
      </Dropdown.Toggle>

      {/* Dropdown menu */}
      <Dropdown.Menu
        style={{
          maxHeight: "250px",
          overflowY: "auto",
          width: "160px",
          fontSize: "14px",
        }}
      >
        {countries.map((country) => {
          const isSelected =
            selectedCountry.code === country.code &&
            selectedCountry.dial_code === country.dial_code;
          return (
            <Dropdown.Item
              key={country.code}
              onClick={() =>
                handleSelect(`${country.dial_code}-${country.name}`)
              }
              className="d-flex align-items-center py-2"
              style={{
                cursor: "pointer",
                whiteSpace: "nowrap",
                overflow: "visible",
                color: "#212529", // text color
                backgroundColor: isSelected ? "#e9ecef" : "white", // highlight selected
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f3f5")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = isSelected ? "#e9ecef" : "white")
              }
              title={`${country.name} ${country.dial_code} (${country.code})`}
            >
              <span
                className={`fi fi-${country.code.toLowerCase()} me-2`}
                style={{
                  width: "20px",
                  height: "15px",
                  borderRadius: "2px",
                  boxShadow: "0 0 1px rgba(0,0,0,0.3)",
                  flexShrink: 0,
                }}
              ></span>

              <span
                style={{
                  fontSize: "14px",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                {country.dial_code} ({country.code})
              </span>
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
};
    