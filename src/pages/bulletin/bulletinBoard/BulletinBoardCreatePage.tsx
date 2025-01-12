import {BulletinBoardCreate, NewFaqBoard} from '~/components';

import { useNavigate } from 'react-router-dom';


export const BulletinBoardCreatePage = () => {
  const navigate = useNavigate();
  const handleSaved = () => navigate(`..`);
  const handleCancel = () => navigate(`..`);
  return (
    <BulletinBoardCreate onSaved={handleSaved} onCancel={handleCancel} />
  );
};

