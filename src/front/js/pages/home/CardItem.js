import React from 'react';
import { Link } from 'react-router-dom';

function CardItem(props) {
  return (
    <>
      <li className='cards__item'>
        <Link className='cards__item__link' to={props.path}>
          <figure className='cards__item__pic-wrap' data-category={props.label}>
            <img
              className='cards__item__img'
              alt='Travel Image'
              src={props.image}
            />
          </figure>
          <div className='cards__item__info'>
            <h3 className='cards__item__text'>{props.text}</h3>
            <div className='cards__item__text__body mt-3'>{props.text2}</div>
          </div>
          <div className='cards__item__text__body m-3' style={{fontSize:'13px'}}>{props.text3}</div>
        </Link>
      </li>
    </>
  );
}

export default CardItem;