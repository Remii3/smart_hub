type BtnUsecases = { usecase: 'big' | 'normal'; text: string };

function PrimaryBtn({ usecase, text }: BtnUsecases) {
  const btnClass = () => {
    switch (usecase) {
      case 'big':
        return 'sm:px-12 sm:py-5 px-14 py-3 font-semibold text-2xl';
      case 'normal':
        return 'px-6 py-4 font-semibold text-lg max-h-[60px]';
    }
  };
  return (
    <button
      className={`${btnClass()} bg-primary transition-[filter, scale] rounded-lg text-white shadow duration-200 ease-out hover:shadow-md hover:brightness-90 active:scale-95 active:brightness-75`}
    >
      {text}
    </button>
  );
}

export default PrimaryBtn;
