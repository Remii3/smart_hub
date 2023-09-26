import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from '@components/UI/dialog';
import MainContainer from '@layout/MainContainer';
import { Button } from '@components/UI/button';
import { NewsTypes } from '@customTypes/interfaces';
import {
  useGetAccessDatabase,
  usePostAccessDatabase,
} from '../../hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '../../data/endpoints';
import { Label } from '@components/UI/label';
import { Input } from '@components/UI/input';
import { UserContext } from '@context/UserProvider';
import NewsArticle from './NewsArticle';

interface NewArticleType {
  title: string;
  subtitle: string;
  headImage: null;
  content: string;
}

export default function NewsPage() {
  const [newsList, setNewsList] = useState<null | NewsTypes[]>(null);
  const [newArticleData, setNewArticleData] = useState<NewArticleType>({
    title: '',
    subtitle: '',
    headImage: null,
    content: '',
  });
  const { userData } = useContext(UserContext);
  const fetchData = useCallback(async () => {
    const { data } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.NEWS_ALL,
    });
    setNewsList(data);
  }, []);

  const addNewNewsHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.NEWS_ONE,
      body: { userId: userData?._id, ...newArticleData },
    });
    await fetchData();
  };

  const changeNewArticleHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setNewArticleData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const deleteArticleHandler = async (newsId: string) => {
    await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.NEWS_DELETE,
      body: { userId: userData?._id, newsId },
    });
    await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <MainContainer>
      <div>
        <span>News</span>
        <Dialog>
          {userData && userData.role !== 'User' && (
            <DialogTrigger asChild>
              <Button variant="default">+Add new</Button>
            </DialogTrigger>
          )}
          <DialogContent>
            <form className="space-y-4" onSubmit={addNewNewsHandler}>
              <DialogHeader>
                <DialogTitle>News</DialogTitle>
                <DialogDescription>Add new news</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <fieldset>
                  <Label>
                    Title
                    <Input
                      className="block"
                      name="title"
                      onChange={(e) => changeNewArticleHandler(e)}
                      type="text"
                    />
                  </Label>
                </fieldset>
                <fieldset>
                  <Label>
                    Subtitle
                    <Input
                      className="block"
                      name="subtitle"
                      onChange={(e) => changeNewArticleHandler(e)}
                      type="text"
                    />
                  </Label>
                </fieldset>
                <fieldset>
                  <Label>
                    Head image
                    <Input
                      className="block"
                      type="file"
                      name="headImage"
                      onChange={(e) => changeNewArticleHandler(e)}
                    />
                  </Label>
                </fieldset>
                <fieldset>
                  <Label>
                    Content
                    <Input
                      className="block"
                      type="text"
                      name="content"
                      onChange={(e) => changeNewArticleHandler(e)}
                    />
                  </Label>
                </fieldset>
              </div>
              <DialogFooter>
                <DialogTrigger asChild>
                  <Button variant="default" type="submit">
                    Submit
                  </Button>
                </DialogTrigger>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col gap-4">
        {newsList ? (
          newsList.map((item) => (
            <div key={item._id} className="block p-3">
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="rounded-md border border-slate-400 p-3 text-start shadow-sm"
                  >
                    <h6>{item.title}</h6>
                    {item.subtitle && (
                      <section className="pt-3">{item.subtitle}</section>
                    )}
                  </button>
                </DialogTrigger>
                <DialogContent className="h-full max-h-full w-screen overflow-y-auto sm:max-h-[80%]">
                  <NewsArticle
                    newsId={item._id}
                    deleteArticleHandler={deleteArticleHandler}
                  />
                </DialogContent>
              </Dialog>
            </div>
          ))
        ) : (
          <h4>No news</h4>
        )}
      </div>
    </MainContainer>
  );
}