import { createStyles } from 'antd-style';

const antdStyle = createStyles(({ token }) => {
  return {
    field: {
      margin: '0',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
    label: {
      fontSize: token.fontSize,
      lineHeight: '22px',
    },
    number: {
      marginLeft: '8px',
      color: token.colorTextHeading,
    },
  };
});

export default antdStyle;
