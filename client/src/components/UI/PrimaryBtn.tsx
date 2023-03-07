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
    <button className={`${btnClass()} bg-primary rounded-lg text-white`}>
      {text}
    </button>
  );
}

export default PrimaryBtn;
