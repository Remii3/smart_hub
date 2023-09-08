import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import MainContainer from '../containers/MainContainer';
import { Button } from '../components/UI/button';
import { NewsTypes } from '../types/interfaces';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from '../components/UI/dialog';

export default function NewsPage() {
  const [newsList, setNewsList] = useState<null | NewsTypes[]>(null);

  const fetchData = async () => {
    const res = await axios.get('/news/all');
    setNewsList(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addNewNewsHandler = () => {};
  return (
    <MainContainer>
      <div>
        <span>News</span>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">+Add new</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>News</DialogTitle>
              <DialogDescription>Add new news</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="default">Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col gap-4">
        {newsList ? (
          newsList.map((item) => (
            <Link to={`/news/${item.id}`} key={item.id} className="block p-3">
              <p>{item.title}</p>
              {item.shortDescription && (
                <section className="pt-3">{item.shortDescription}</section>
              )}
            </Link>
          ))
        ) : (
          <h4>No news</h4>
        )}
      </div>
    </MainContainer>
  );
}
