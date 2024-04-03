import React from "react";
import { SearchOutlined } from "@ant-design/icons";
import InputComponent from "../InputComponent/InputComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";

const ButtonInputSearch = (props) => {
  const {
    size,
    placeholder,
    textbutton,
    bordered,
    backgroundColorInput = "#fff",
    backgroundColorButton = "rgb(13,92,182)",
    colorButton = "#fff",
    borderRadius = 0,
  } = props;
  return (
    <div className="flex">
      <InputComponent
        size={size}
        placeholder={placeholder}
        bordered={bordered}
        style={{
          backgroundColor: backgroundColorInput,
          borderRadius: borderRadius,
        }}
        {...props}
      />
      <ButtonComponent
        size={size}
        style={{
          background: backgroundColorButton,
          borderRadius: borderRadius,
          color: colorButton,
          border: !bordered && "none",
        }}
        icon={<SearchOutlined color={colorButton} style={{color: '#fff'}} />}
        textbutton={textbutton}
        styleButton={{color:{colorButton}}}
      />
    </div>
  );
};

export default ButtonInputSearch;
