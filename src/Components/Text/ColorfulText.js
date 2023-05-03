import React from 'react';

const ColorfulText = ({ text, color }) => {
  const parts = text.split(/<0>|<\/0>/g);

  return (
    <p>
      {parts.map((part, index) => 
        index % 2 === 0 ? part : <span style={{ color }}>{part}</span>
      )}
    </p>
  );
};

export default ColorfulText;
