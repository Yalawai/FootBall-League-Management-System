import React, { useEffect } from 'react';

const FacebookPost = ({ url }) => {
  useEffect(() => {
    if (window.FB) {
      window.FB.XFBML.parse();
      
    }
  }, [url]);

  return (
    <div>
        
         
<div className="fb-post" data-href={url} data-width="500"></div>
    </div>
   
  );
};

export default FacebookPost;