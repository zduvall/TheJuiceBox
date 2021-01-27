import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { getDrinks, updateDrink, deleteDrink } from '../../store/drinks';

const DrinkDetails = () => {
  const dispatch = useDispatch();
  const { drinkId } = useParams();
  const drink = useSelector(state => state.drinks[drinkId]);
  const user = useSelector(state => state.session.user);

  const [name, setName] = useState(drink.name);
  const [description, setDescription] = useState(drink.description);
  const [image, setImage] = useState(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    dispatch(getDrinks()).then(() => setIsLoaded(true));
  }, [dispatch]);

  const editClickHandler = () => {
    setEditMode(prev => !!prev);
  };

  const submitClickHandler = async (e) => {
    e.preventDefault();
    await dispatch(updateDrink({ id: drinkId, name, description, image }));
    setEditMode(false);
    dispatch(getDrinks());
  };

  const deleteClickHandler = () => {
    setShowDeleteModal(true);
  };

  const updateFile = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  if (!isLoaded) return null;

  if (editMode) {
    return (
      <div className="tw-grid-cols-3 tw-grid tw-p-8 tw-flex tw-flex-col tw-items-center">
        <div className="tw-flex tw-justify-center tw-col-span-1 tw-p-4 tw-max-h-96">
          <img src={drink.imageUrl} alt={drink.name} />
        </div>
        <div className="tw-col-span-2 tw-p-4 tw-flex tw-flex-col">
          <h1 className="tw-font-serif tw-text-xl tw-font-semibold">Drink No. {drink.id} Details</h1>
          <form onSubmit={submitClickHandler}>
            <input type="text" placeholder="Drink Name" value={name} onChange={e => setName(e.target.value)} />
            <input type="textarea" placeholder="Drink Description" value={description} onChange={e => setDescription(e.target.value)} />
            <input type="file" onChange={updateFile} />
            <button className="tw-p-1 tw-m-1 tw-border hover:tw-bg-gray-300" type="submit">Submit</button>
          </form>
          <div className="tw-w-2/4 tw-flex tw-flex-start">
            <button className="tw-p-1 tw-m-1 tw-border hover:tw-bg-gray-300" onClick={editClickHandler}>Edit</button>
            <button className="tw-p-1 tw-m-1 tw-border hover:tw-bg-gray-300" onClick={deleteClickHandler}>Delete</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tw-grid-cols-3 tw-grid tw-p-8 tw-flex tw-flex-col tw-items-center">
      <div className="tw-flex tw-justify-center tw-col-span-1 tw-p-4 tw-max-h-96">
        <img src={drink.imageUrl} alt={drink.name} />
      </div>
      <div className="tw-col-span-2 tw-p-4 tw-flex tw-flex-col">
        <h1 className="tw-font-serif tw-text-xl tw-font-semibold">Drink No. {drink.id} Details</h1>
        <h3 className="tw-text-l tw-font-bold">The {drink.name}</h3>
        <p>{drink.description}</p>
        {user && drink.creatorId === user.id && (
          <div className="tw-w-2/4 tw-flex tw-flex-start">
            <button className="tw-p-1 tw-m-1 tw-border hover:tw-bg-gray-300" onClick={editClickHandler}>Edit</button>
            <button className="tw-p-1 tw-m-1 tw-border hover:tw-bg-gray-300" onClick={deleteClickHandler}>Delete</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DrinkDetails;
