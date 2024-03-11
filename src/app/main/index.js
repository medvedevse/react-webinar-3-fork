import {memo, useCallback, useEffect, useState} from 'react';
import Item from "../../components/item";
import PageLayout from "../../components/page-layout";
import Head from "../../components/head";
import BasketTool from "../../components/basket-tool";
import List from "../../components/list";
import useStore from "../../store/use-store";
import useSelector from "../../store/use-selector";
import Pagination from '../../components/pagination';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  BrowserRouter,
  Routes
} from "react-router-dom";
import AboutOrder from '../about-order';

function Main() {

  const select = useSelector(state => ({
    list: state.catalog.list,
    amount: state.basket.amount,
    sum: state.basket.sum,
    countItems: state.catalog.countItems,
    isLoading: state.catalog.isLoading,
  }));

  const store = useStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
 
  const items = Array.from({ length: select.countItems }, (_, index) => index + 1);

  // Получить текущие элементы
  const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = items => items.slice(indexOfFirstItem, indexOfLastItem);

  // Изменить страницу
  const paginate = pageNumber => setTimeout(() => {setCurrentPage(pageNumber)}, 500)

  useEffect(() => {
    store.actions.catalog.load(itemsPerPage, (currentPage-1)*10);
  }, [currentPage]);
 
  useEffect(() => {
    store.actions.catalog.loadCountItems(itemsPerPage, currentPage);
  }, [store]);  //?

  // useEffect(() => {
  //   store.actions.catalog.openOrderInfo(id);
  // }, [store]);

  const callbacks = {
    // Добавление в корзину
    addToBasket: useCallback(_id => store.actions.basket.addToBasket(_id), [store]),
    // Открытие модалки корзины
    openModalBasket: useCallback(() => store.actions.modals.open('basket'), [store]),
  }

  const renders = {
    item: useCallback((item) => {
      return <Item item={item} onAdd={callbacks.addToBasket}/>
    }, [callbacks.addToBasket]),
  };

  return (
    <PageLayout>
      <Head title='Магазин'/>
      <BasketTool onOpen={callbacks.openModalBasket} 
                  amount={select.amount} 
                  sum={select.sum}
                  paginate={paginate}/>
      <List list={select.list} renderItem={renders.item}/>
      <Pagination
         indexOfLastItem={indexOfLastItem}
         itemsPerPage={itemsPerPage}
         totalItems={items.length}
         paginate={paginate}
         currentPage={currentPage}
         isLoading={select.isLoading}/>

    </PageLayout>
    
  );
}

export default memo(Main);