type CheckiconTypes = {
  height?: number;
  width?: number;
};

const defaultProps = {
  height: 6,
  width: 6,
};

function CheckIcon({ height, width }: CheckiconTypes) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <svg viewBox="0 0 24 24" fill="none" className={`h-${height} w-${width}`}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

CheckIcon.defaultProps = defaultProps;

export default CheckIcon;
