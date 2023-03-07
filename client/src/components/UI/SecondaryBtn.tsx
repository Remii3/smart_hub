type PropsType = {
  text: string;
  onClick?: () => void;
  customCSS?: string;
};

function SecondaryBtn({ text, onClick, customCSS }: PropsType) {
  const clickHandler = () => {
    if (onClick) {
      onClick();
    }
    return;
  };

  return (
    <button
      className={`${customCSS} text-darkTint h-[60px] rounded-lg bg-white px-3 transition-[filter,transform] duration-200 ease-out hover:brightness-95 active:scale-95 active:brightness-90`}
      onClick={clickHandler}
    >
      {text}
    </button>
  );
}

export default SecondaryBtn;
