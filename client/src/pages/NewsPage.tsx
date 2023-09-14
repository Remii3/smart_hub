import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
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
} from '../hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '../data/endpoints';
import { Label } from '@components/UI/label';
import { Input } from '@components/UI/input';

interface NewsArticleType {
  title: string;
  subtitle: string;
  headImage: null;
  content: string;
}

interface SelectArticleType {
  isLoading: boolean;
  data: null | NewsArticleType;
}

export default function NewsPage() {
  const [newsList, setNewsList] = useState<null | NewsTypes[]>(null);
  const [newArticleData, setNewArticleData] = useState<NewsArticleType>({
    title: '',
    subtitle: '',
    headImage: null,
    content: '',
  });
  const [selectedArticle, setSelectedArticle] = useState<SelectArticleType>({
    isLoading: false,
    data: null,
  });
  const fetchData = useCallback(async () => {
    const { data } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.NEWS_ALL,
    });
    setNewsList(data);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addNewNewsHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.NEWS_ONE,
      body: newArticleData,
    });
    await fetchData();
  };

  const changeNewArticleHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setNewArticleData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };
  const fetchArticleData = async (newsId: string) => {
    const { data } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.NEWS_ONE,
      params: { newsId },
    });

    return data;
  };
  const showArticleHandler = async (newsId: string) => {
    setSelectedArticle((prevState) => {
      return { ...prevState, isLoading: true };
    });

    const data = await fetchArticleData(newsId);
    setSelectedArticle({ data, isLoading: false });
  };
  return (
    <MainContainer>
      <div>
        <span>News</span>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">+Add new</Button>
          </DialogTrigger>
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
                    onClick={() => showArticleHandler(item._id)}
                  >
                    <h6>{item.title}</h6>
                    {item.subtitle && (
                      <section className="pt-3">{item.subtitle}</section>
                    )}
                  </button>
                </DialogTrigger>
                <DialogContent>
                  {selectedArticle.isLoading ? (
                    <div>loading</div>
                  ) : (
                    <div>
                      {selectedArticle.data && (
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <h3>{selectedArticle.data.title}</h3>
                            <h6 className="text-slate-600">
                              {selectedArticle.data.subtitle}
                            </h6>
                          </div>
                          <p>{selectedArticle.data.content}</p>
                        </div>
                      )}
                    </div>
                  )}
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
