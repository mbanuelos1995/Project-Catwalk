import React, { useState, createRef } from 'react';
import PrismaZoom from 'react-prismazoom'

export default function ExpandedView({ close, handleIconClick, url, photos, back, forward, selectedPhotoIndex }) {

  const [isZoomed, toggleZoom] = useState(false);

  const prismaZoom = createRef();

  const renderExpandedViewIcons = () => {
    return <div className='expanded-view-icons-row'>
      {photos.map((photo, i) => {
        return <div
          className='expanded-view-icon'
          key={i}
          onClick={(e) => handleIconClick(e, photo.url, i)}
          id={i === selectedPhotoIndex ? 'selected' : null}
        >
        </div>
      })}
    </div>
  }

  return (
    <div className='expanded-gallery-modal-inner'>
      <button onClick={() => close()} id='modal-x-button'>&#x2715;</button>
      {isZoomed ?
        <div className='expanded-view-message'>Click and hold to pan; double click to zoom out.</div>
        : <div className='expanded-arrow-and-icon-container'>
          {selectedPhotoIndex > 0 ?
            <button style={{ marginRight: 8 }} className='expanded-arrow-button' onClick={(e) => { back(e) }}>&#x2190;</button>
            : <div style={{ marginRight: 8 }} className='expanded-arrow-placeholder'></div>
          }
          {renderExpandedViewIcons()}
          {selectedPhotoIndex < photos.length - 1 ?
            <button className='expanded-arrow-button' onClick={(e) => { forward(e) }}>&#x2192;</button>
            : <div className='expanded-arrow-placeholder'></div>
          }
        </div>
      }
      <PrismaZoom
        onZoomChange={() => toggleZoom(!isZoomed)}
        scrollVelocity={null}
        animDuration={0.3}
        minZoom={1}
        maxZoom={2.5}
        ref={prismaZoom}
      >
        <img className='expanded-view-image' id={isZoomed ? 'zoomed' : 'not-zoomed'} src={url} />
      </PrismaZoom>
    </div>
  )
}