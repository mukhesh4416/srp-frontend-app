import React from 'react';
import PropTypes from 'prop-types';

function Loader({enableLoader = false, loaderHeight = '400px'}) {
  return (
    <>
        {enableLoader && <div className="trainLoader"  style={{ height: loaderHeight, width: '100%',paddingTop: '160px'}}></div>}
    </>
  )
}

Loader.propTypes = {
  enableLoader: PropTypes.bool,
  loaderHeight: PropTypes.string,
};

export default Loader