import React from 'react'

const LikeButtonComponent = (props) => {
    const {datahref} = props
  return (
    <div className="mt-2">
    <div class="fb-like" data-href={datahref} data-width="" data-layout="" data-action="" data-size="" data-share="true"></div>
    </div>
  )
}

export default LikeButtonComponent
