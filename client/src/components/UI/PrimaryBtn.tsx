type BtnUsecases = { usecase: 'big' | 'normal'; text: string };

function PrimaryBtn({ usecase, text }: BtnUsecases) {
  const btnClass = () => {
    switch (usecase) {
      case 'big':
        return 'sm:px-12 sm:py-5 px-14 py-3 font-semibold text-2xl';
      case 'normal':
        return 'px-5 py-3 font-semibold text-lg';
    }
  };
  return (
    <button className={`${btnClass()} bg-primary text-white rounded-lg`}>
      {text}
    </button>
  );
}

export default PrimaryBtn;
