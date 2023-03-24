import React, { useEffect, useState } from 'react';

import HeaderMainPage from '../../Components/HeaderMainPage';
import ModalEvaluation from '../../Components/ModalEvaluation';
import Loading from '../../Components/Loading';
import AreaOrder from '../../Components/AreaOrder';
import PriceArea from '../../Components/PriceArea';
import OrderItemCard from '../../Components/OrderItemCard';
import ButtonToOnClick from '../../Components/ButtonToOnClick';
import ButtonNotClickable from '../../Components/ButtonNotClickable';

import api from '../../Services/api';

import './styles.css';

export default function OrderContentNew(props) {
  // ORDER
  const [order, setOrder] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // status
  const [status, setStatus] = useState(0);
  const [statusWord, setStatusWord] = useState('');

  // PRODUCTS
  const [products, setProducts] = useState([]);

  // SERVICES
  const [services, setServices] = useState([]);

  async function loadServices(id, page) {
    await api.get(`/order-services/${id}/${page}`).then(res => {
      setServices(res.data.content);
    });
  }

  async function loadProducts(id, page) {
    await api.get(`/order-products/${id}/${page}`).then(res => {
      setProducts(res.data.content);
    });
  }

  useEffect(() => {
    async function loadOrderById(id) {
      await api.get(`/orders/${id}`).then(res => {
        setOrder(res.data);
        setIsLoading(false);
        switch (res.data.statusOrder) {
          case 'NOT_PAID':
            return setStatusWord("Pendente");
          case 'PAID':
            setStatusWord("Pagamento aprovado");
            return setStatus(1);
          case 'PROCESS':
            setStatusWord("Em andamento");
            return setStatus(2);
          case 'DEVELIVERYING':
            setStatusWord("Pronto pra entrega");
            return setStatus(3);
          case 'FINISHED':
            setStatusWord("Finalizado");
            return setStatus(4);
          default:
            return 0;
        }
      }).catch(err => {
        switch (err.message) {
          case "Request failed with status code 403":
            return props.history.push('/');
          default:
            return ''
        }
      });
    }
    loadOrderById(props.match.params.id);
    if (order.id !== undefined && order.id) {
      loadServices(order.id, 0);
      loadProducts(order.id, 0);
    }
  }, [props.match.params.id, order.id, props.history]);

  function handleOpen(e) {
    e.preventDefault();
    let btn = e.currentTarget;
    btn.classList.add('selectedButton');

    // content information
    let btnInformation = document.getElementById('button-information');
    let divInfo = document.getElementById('information-of-order');

    // content products
    let btnProducts = document.getElementById('button-products');
    let list = document.getElementById('list-products-was-bought');

    if (btn === btnInformation) {
      btnProducts.classList.remove('selectedButton');
      list.classList.remove('visible-list');
      divInfo.classList.add('visible-div-infomation');
    } else {
      btnInformation.classList.remove('selectedButton');
      divInfo.classList.remove('visible-div-infomation');
      list.classList.add('visible-list');
    }
  }

  function openModalEvaluation() {
    let modalEvaluation = document.getElementById('id-modal-evaluation');
    if(modalEvaluation !== null) {
      modalEvaluation.classList.add('openModalEvaluation');
    }
  }

  return (
    <>
      <HeaderMainPage props={props} validate={true} />
      <div className="container-order">
        <div className="content-order">
          {isLoading ? (<Loading />) : (
            <>
              {order.evaluated ? ('') : (<ModalEvaluation props={props} idDiv="id-modal-evaluation" orderInfo={order} isEvaluated={order.evaluated} />)}
              <div className="card-info-order">
                <div className="header-info-order">
                  <h2>{order.nameCompany}</h2>
                  <nav className="nav-order">
                    <button id="button-information" className="selectedButton" onClick={e => handleOpen(e)} ><span>Informações</span></button>
                    <button id="button-products" onClick={e => handleOpen(e)}><span>Produtos</span></button>
                  </nav>
                </div>
                <div className="info-order">
                  <div className="content-order-header">
                    <h3>Informações do pedido</h3>
                  </div>
                  <div className="content-order-info">
                    <AreaOrder staticText="Status:" info={statusWord} />
                    <AreaOrder staticText="Subtotal:" info={'R$ ' + order.subTotal} />
                    <PriceArea staticText="Total:" info={'R$ ' + order.total} />
                    {status >= 4 ? (
                      <>
                        {order.evaluated ? (<ButtonNotClickable text="Avaliar" />) : (<ButtonToOnClick text="Avaliar" onClick={openModalEvaluation} />)}
                      </>
                    ) : ('')}
                  </div>
                </div>
              </div>
              <div id="list-products-was-bought" className="products-list">
                {services.length > 0 ? (services.map(service => <OrderItemCard key={service.id} item={service} />)) : ('')}
                {products.length > 0 ? (products.map(product => <OrderItemCard key={product.id} item={product} />)) : ('')}
              </div>
              <div id="information-of-order" className="information-area visible-div-infomation">
                <div className="information-of-order visible-div-infomation">
                  <div className="not-paid">
                    <div className="list-grey statusConfirmed" />
                    <div className="svg-area statusConfirmed">
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="square" strokeLinejoin="arcs"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </div>
                  </div>
                  <div className="paid">
                    <div className={status >= 1 ? ('list-grey statusConfirmed') : ('list-grey')} />
                    <div className={status >= 1 ? ('svg-area statusConfirmed') : ('svg-area')}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="square" strokeLinejoin="arcs"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                  </div>
                  <div className="process">
                    <div className={status >= 2 ? ('list-grey statusConfirmed') : ('list-grey')} />
                    <div className={status >= 2 ? ('svg-area statusConfirmed') : ('svg-area')}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="square" strokeLinejoin="arcs"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
                  </div>
                  <div className="deliverying">
                    <div className={status >= 3 ? ('list-grey statusConfirmed') : ('list-grey')} />
                    <div className={status >= 3 ? ('svg-area statusConfirmed') : ('svg-area')}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="square" strokeLinejoin="arcs"><circle cx="10" cy="20.5" r="1" /><circle cx="18" cy="20.5" r="1" /><path d="M2.5 2.5h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6l1.6-8.4H7.1" /></svg>
                    </div>
                  </div>
                  <div className="finished">
                    <div className={status >= 4 ? ('list-grey statusConfirmed') : ('list-grey')} />
                    <div className={status >= 4 ? ('svg-area statusConfirmed') : ('svg-area')}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="square" strokeLinejoin="arcs"><path d="M6 2L3 6v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V6l-3-4H6zM3.8 6h16.4M16 10a4 4 0 1 1-8 0" /></svg>
                    </div>
                  </div>
                </div>
                <div className="information">
                  <div className="info-circle">
                    <span>Pendente!</span>
                  </div>
                  <div className="info-circle">
                    <span>Pago!</span>
                  </div>
                  <div className="info-circle">
                    <span>Em Andamento!</span>
                  </div>
                  <div className="info-circle">
                    <span>Pronto pra entrega!</span>
                  </div>
                  <div className="info-circle">
                    <span>Finalizado!</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}