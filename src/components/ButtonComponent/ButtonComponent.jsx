import React from 'react'
import { Button } from "antd";
const ButtonComponent = ({size,styleButton,styleTextButton,textbutton,disabled, ...rests}) => {
  return (
    <Button
        size={size} 
        style={{
          ...styleButton
        , background: disabled ? '#ccc' : styleButton.background
        }}
        {...rests}
      >
        <span style={styleTextButton}>{textbutton}</span>
      </Button>
  )
}

export default ButtonComponent
