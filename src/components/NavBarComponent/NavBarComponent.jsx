import React from "react";
import { Checkbox, Rate } from "antd";
import { WrapperContent, WrapperLabelText, WrapperTextPrice, WrapperTextValue } from './style'
const NavBarComponent = () => {
  const checkBoxChange = () => {};
  const renderContent = (type, options) => {
    switch (type) {
      case "text":
        return options.map((option) => (
          <h1 className="text-[#38383d] font-normal text-xs">{option}</h1>
        ));
      case "checkbox":
        return (
          <Checkbox.Group
            className="w-full flex flex-col gap-3"
            onChange={checkBoxChange}
          >
            {options.map((option) => (
              <Checkbox value={option.value}>{option.label}</Checkbox>
            ))}
          </Checkbox.Group>
        );
      case "star":
        return options.map((option) => (
        <div className="flex">
          <Rate disabled allowHalf defaultValue={option} />
          <span>{`tu ${option} sao`}</span>
        </div>
        ));
        case "price":
        return options.map((option) => (
        <div className="p-1 text-[#38383d] rounded-lg bg-[#eeeeee] w-fit">
         {option}
        </div>
        ));

      default:
        return {};
    }
  };
  return (
    <div>
    </div>
  );
};

export default NavBarComponent;
