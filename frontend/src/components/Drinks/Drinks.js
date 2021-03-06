import { useSelector } from 'react-redux';

import Drink from './Drink';

const Drinks = () => {
  const drinksObj = useSelector(state => state.drinks);

  return (
    <div className="tw-max-w-7xl tw-mx-auto tw-p-2 tw-min-h-screen">
      <h1 className="tw-text-clouds tw-text-5xl tw-font-semibold tw-text-center tw-font-serif">All the Drinks</h1>
      {Object.values(drinksObj).map(drink => (
        <div className="tw-flex tw-justify-center tw-p-4" key={drink.id}>
          <Drink drink={drink} />
        </div>)
      )}
    </div>
  );
};

export default Drinks;
