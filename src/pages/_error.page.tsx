import { ErrorProps } from 'next/error';
import { NextPage, NextPageContext } from 'next';
import Router from 'next/router';
import { Button } from '@material-ui/core';

interface InitialProps {
  statusCode: number;
}

const Error: NextPage<ErrorProps> = ({ statusCode, title }) => (
  <div>
    <p>
      {statusCode
        ? `An error ${title} - ${statusCode} occurred on server`
        : `An error ${title} - ${statusCode} occurred on client`}
    </p>
    <Button variant="contained" color="primary" onClick={() => Router.push('/')}>
      Home
    </Button>
  </div>
);

Error.getInitialProps = ({ res, err }: NextPageContext): InitialProps => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode } as InitialProps;
};

export default Error;
