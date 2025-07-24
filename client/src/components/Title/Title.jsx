import React from "react";

const Title = ({ title1, title2, titleStyles, paraStyles }) => {
  return (
    <div className={`text-center ${titleStyles}`}>
      <h2 className={`text-3xl md:text-4xl font-bold`}>
        {title1}
        <span className="text-blue-500 mx-2 dark:text-blue">{title2}</span>
      </h2>
      {/* <p className={`text-gray-600 dark:text-gray-400 mt-2 ${paraStyles}`}>
        From timeless classics to modern masterpieces,
        <br />
        find the perfect read for every moment.
      </p> */}
    </div>
  );
};

export default Title;
