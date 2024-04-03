import React from 'react'

const CommentComponent = () => {
    
  return (
    <div className="w-full mt-2">
    <div class="fb-comments" data-href={process.env.REACT_APP_IS_LOCAL ?"https://developers.facebook.com/docs/plugins/comments#configurator" : window.location.href }data-width="1270" data-numposts="5"></div>
    </div>
  )
}

export default CommentComponent
