import React, { useEffect } from 'react';

const ErrorPage: React.FC = () => {
  useEffect(() => {
    console.log('In Error page');
  }, []);

  // you don't need to explicitly set error to `unknown`
  let errorMessage = 'Unknown error';

  return (
    <div id="error-page" className="flex flex-col gap-8 justify-center items-center h-screen">
      <h1 className="text-4xl font-bold">Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p className="text-slate-400">
        <i>{errorMessage}</i>
      </p>
    </div>
  );
};

export default ErrorPage;
