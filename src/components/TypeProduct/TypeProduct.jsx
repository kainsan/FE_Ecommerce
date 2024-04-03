import React from 'react'
import { useNavigate } from 'react-router-dom'

const TypeProduct = ({name}) => {
  const navigate = useNavigate()
  const handleNavigatetype = (type) => {
    navigate(`/product/${type.normalize('NFD').replace(/[\u0300-\u036f]/g, '')?.replace(/ /g, '_')}`, {state: type})
  }
  return (
    <div className="p-[10px] cursor-pointer hover:bg-blue-500 hover:text-[#fff] hover:rounded" onClick={() => handleNavigatetype(name)}>
      {name}
    </div>
  )
}

export default TypeProduct
