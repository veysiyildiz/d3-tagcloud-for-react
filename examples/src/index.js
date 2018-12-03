
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import GithubCorner from 'react-github-corner';
import { Catalog, CodeSpecimen, ReactSpecimen, pageLoader } from 'catalog';
import ReactGA from 'react-ga';
import DemoCloud from './DemoCloud';

import './styles.css';
import 'purecss/build/pure.css';

ReactGA.initialize('UA-130297711-3');
ReactGA.pageview(window.location.pathname + window.location.search);
const documentationImports = {};


const pages = [
  {
    path: '/',
    title: 'Documentation',
    content: pageLoader(() => import('../../README.md')),
  },
  {
    path: '/demo',
    title: 'Demo',
    content: () => <DemoCloud />,
  }
];


ReactDOM.render(
  <Fragment>
    <GithubCorner
      href="https://github.com/veysiyildiz/d3-tagcloud-for-react"
      bannerColor="#fff"
      octoColor="#000"
      width={80}
      height={80}
      direction="right"
    />
    <Catalog
      imports={documentationImports}
      pages={pages}
      styles={{display: 'block'}}
      theme={{ }}
      specimens={{
        javascript: props => <CodeSpecimen {...props} lang="javascript" />,
        js: props => <CodeSpecimen {...props} lang="javascript" />,
        jsx: props => <ReactSpecimen {...props} />,
      }}
      title="d3 tagcloud for react"
    />
  </Fragment>,
  document.getElementById('catalog'),
);
