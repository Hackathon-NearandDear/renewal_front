import { useMemo } from "react";
import Select, { StylesConfig } from "react-select";
import countryList from "react-select-country-list";

interface CountryOption {
  label: string;
  value: string;
}

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
}

const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange }) => {
  const options = useMemo(() => countryList().getData(), []);

  const changeHandler = (selectedOption: CountryOption | null) => {
    onChange(selectedOption?.value || "");
  };

  const customStyles: StylesConfig<CountryOption, false> = {
    menu: (provided) => ({
      ...provided,
      maxHeight: "200px",
      width: "100%",
      marginLeft: "0",
      marginTop: "5px",
      backgroundColor: "#2A2D36",
      color: "white",
      borderRadius: "0.375rem",
      border: "1px solid #4A4D56",
      
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "200px",
      padding: "0",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#00D897"
        : state.isFocused
        ? "#3A3D46"
        : "#2A2D36",
      color: "white",
      padding: "0.5rem",
      "&:active": {
        backgroundColor: "#00D897",
        color: "white",
      },
      "&:hover": {
        backgroundColor: "#00D897",
        color: "white",
      },
    }),
    control: (provided) => ({
      ...provided,
      borderRadius: "0",
      border: "none",
      borderBottom: "1px solid #4A4D56",
      boxShadow: "none",
      backgroundColor: "transparent",
      color: "white",
      padding: "0.5rem 0",
      "&:hover": {
        borderColor: "#4A4D56",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    input: (provided) => ({
      ...provided,
      color: "white",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9CA3AF",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#9ca3af", // Keeps the arrow color white
      "&:hover": {
        color: "#9ca3af", // Prevents the arrow color from changing on hover
      },
    }),
    indicatorSeparator: (provided) => ({
      display: "none",
    }),
  };

  return (
    <div>
      <label
        htmlFor="country"
        className="block text-sm font-medium text-gray-300 mb-1"
      >
        Country
      </label>
      <Select
        options={options}
        value={options.find((option) => option.value === value) || null}
        onChange={changeHandler}
        styles={customStyles}
        className="w-full"
        classNamePrefix="react-select"
        placeholder="Select"
        id="country"
      />
    </div>
  );
};

export default CountrySelect;
