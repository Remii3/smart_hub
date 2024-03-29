import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import parse from 'html-react-parser';

interface ProductDescriptionTypes {
  newDescription: string;
  setNewDescription: React.Dispatch<React.SetStateAction<string>>;
  show?: boolean;
  descriptionToShow?: string;
}

export default function ProductDescription({
  newDescription,
  setNewDescription,
  show = false,
  descriptionToShow = '',
}: ProductDescriptionTypes) {
  return (
    <article>
      {show ? (
        <CKEditor
          editor={ClassicEditor}
          data={newDescription}
          config={{
            mediaEmbed: { previewsInData: true },
            toolbar: {
              shouldNotGroupWhenFull: true,
              items: [
                'heading',
                '|',
                'bold',
                'italic',
                'link',
                'bulletedList',
                'numberedList',
                '|',
                'outdent',
                'indent',
                '|',

                'blockQuote',
                'insertTable',
                'mediaEmbed',
                'undo',
                'redo',
              ],
            },
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            setNewDescription(data);
          }}
        />
      ) : (
        <article className="prose max-w-full">
          {parse(descriptionToShow)}
        </article>
      )}
    </article>
  );
}
